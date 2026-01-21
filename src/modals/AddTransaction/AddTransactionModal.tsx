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

  /* REPLACE passive fetching with blocking action */
  const {
    execute: executeLoadCategories,
    modal: loadCategoriesModal,
  } = useBlockingAsync(getCategories, {
     loadingMessage: 'Loading active categories...',
     // No success message needed for internal data loading, or maybe a subtle one?  
     // Usually better to be silent on success for "migrations" like this, but 
     // the hook might default to "Operation successful" if not specified?
     // Let's check useBlockingAsync implementation. 
     // It says: setMessage(options.successMessage || 'Operation successful')
     // defaulting to that might be annoying.
     // However, we want to transition immediately.
     successDuration: 0, // Instant transition
  })

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

  const handleSelectTypeAndContinue = async (selectedType: 'income' | 'expense') => {
    const numericAmount = Number(amount)
    if (!numericAmount || Number.isNaN(numericAmount) || numericAmount <= 0) {
      return
    }

    setTransactionType(selectedType)

    // Blocking fetch
    const result = await executeLoadCategories()
    
    // logic continues if result is present (success)
    if (result) {
        const mapped: CategoryOption[] = (result.categories ?? []).map(item => ({
          id: item.id ?? item._id ?? item.name,
          name: item.name,
          type: item.type,
          isDefault: item.isDefault,
        }))
        setCategories(mapped)
        setStep(2)
    }
  }

  const handleBackToStepOne = () => {
    setStep(1)
  }

  return (
    <>
      {blockingModal}
      {loadCategoriesModal}
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
            isLoadingCategories={false}
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

