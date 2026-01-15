import { type FormEvent, useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useBlockingAsync } from '../../hooks/useBlockingAsync'

import dayjs from 'dayjs'
import { Modal } from '../../components/Modal'
import { createTransaction } from '../../api/transactions'
import type { Transaction } from '../../types'
import { getCategories } from '../../api/categories'
import { StepOne } from './step1/StepOne'
import { StepTwo } from './step2/StepTwo'
import { useAuth } from '../../hooks/useAuth'

interface AddTransactionModalProps {
  open: boolean
  onClose: () => void
  onTransactionCreated?: (transaction: Transaction) => void
}

const transactionKey = ['transactions']
const summaryKey = ['summary']
type AddTransactionStep = 1 | 2

type CategoryOption = {
  id: string
  name: string
  type: 'income' | 'expense'
  isDefault?: boolean
}

export const AddTransactionModal = ({ open, onClose, onTransactionCreated }: AddTransactionModalProps) => {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const currencySymbol = user?.currency?.symbol || '$'

  const [amount, setAmount] = useState('')
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('expense')
  const [categories, setCategories] = useState<CategoryOption[]>([])
  const [filteredCategories, setFilteredCategories] = useState<CategoryOption[]>([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [note, setNote] = useState('')
  const [step, setStep] = useState<AddTransactionStep>(1)
  const [isLoadingCategories, setIsLoadingCategories] = useState(false)

  useEffect(() => {
    if (open) {
      setStep(1)
      setTransactionType('expense')
      setDate(dayjs().format('YYYY-MM-DD'))
      setAmount('')
      setSelectedCategory('')
      setNote('')
    }
  }, [open])

  useEffect(() => {
    if (step !== 2) return

    const loadCategories = async () => {
      try {
        setIsLoadingCategories(true)
        const result = await getCategories()
        const mapped: CategoryOption[] = (result.categories ?? []).map(item => ({
          id: item.id ?? item._id ?? item.name,
          name: item.name,
          type: item.type,
          isDefault: item.isDefault,
        }))
        setCategories(mapped)
      } catch {
        // ignore error
      } finally {
        setIsLoadingCategories(false)
      }
    }

    void loadCategories()
  }, [step])

  useEffect(() => {
    if (!categories.length) {
      setFilteredCategories([])
      setSelectedCategory('')
      return
    }

    const nextFiltered = categories.filter(category => category.type === transactionType)
    setFilteredCategories(nextFiltered)

    if (!nextFiltered.length) {
      setSelectedCategory('')
      return
    }

    const defaultForType = nextFiltered.find(category => category.isDefault)
    setSelectedCategory(defaultForType?.id ?? nextFiltered[0]?.id ?? '')
  }, [categories, transactionType])

  const {
    execute: executeCreate,
    isLoading: isCreating,
    modal: blockingModal,
  } = useBlockingAsync(createTransaction, {
    successMessage: 'Transaction added successfully!',
    onSuccess: (transaction) => {
      queryClient.invalidateQueries({ queryKey: transactionKey })
      queryClient.invalidateQueries({ queryKey: summaryKey })
      onTransactionCreated?.(transaction)
      setAmount('')
      setNote('')
      setStep(1) // Reset to step 1
      onClose()
    },
  })

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const numericAmount = Number(amount)
    if (!numericAmount || Number.isNaN(numericAmount)) {

      return
    }
    if (!selectedCategory) {

      return
    }

    executeCreate({
      amount: numericAmount,
      type: transactionType,
      category: selectedCategory,
      date,
      note: note.trim() ? note.trim() : undefined,
    })
  }

  const handleSelectTypeAndContinue = (selectedType: 'income' | 'expense') => {
    const numericAmount = Number(amount)
    if (!numericAmount || Number.isNaN(numericAmount) || numericAmount <= 0) {

      return
    }
    setTransactionType(selectedType)
    setStep(2)
  }

  const handleBackToStepOne = () => {
    setStep(1)
  }

  return (
    <>
      {blockingModal}
      <Modal
        open={open}
        onClose={onClose}
        title="Add Transaction"
        subtitle="Quickly log income or expenses in two simple steps."
        widthClassName={step === 1 ? 'max-w-md' : 'max-w-xl'}
      >
        {step === 1 ? (
          <StepOne
            amount={amount}
            onChangeAmount={setAmount}
            onSelectType={handleSelectTypeAndContinue}
            currencySymbol={currencySymbol}
          />
        ) : (
          <StepTwo
            amount={amount}
            transactionType={transactionType}
            date={date}
            note={note}
            categories={categories}
            filteredCategories={filteredCategories}
            selectedCategory={selectedCategory}
            isLoadingCategories={isLoadingCategories}
            isSubmitting={isCreating}
            onBack={handleBackToStepOne}
            onSubmit={handleSubmit}
            onChangeType={setTransactionType}
            onChangeDate={setDate}
            onChangeNote={setNote}
            onSelectCategory={setSelectedCategory}
            currencySymbol={currencySymbol}
          />
        )}
      </Modal>
    </>
  )
}

