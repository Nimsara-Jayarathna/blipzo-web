import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Modal } from '../../components/Modal'
import { getTransactionSummary } from '../../api/transactions'
import { Spinner } from '../../components/Spinner'
import { ReportsHeader } from './ReportsHeader'
import { ReportsChart } from './ReportsChart'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler)

interface ReportsModalProps {
  open: boolean
  onClose: () => void
}

const summaryKey = ['summary']

export const ReportsModal = ({ open, onClose }: ReportsModalProps) => {
  const [view, setView] = useState<'daily' | 'monthly'>('monthly')
  const { data, isLoading } = useQuery({
    queryKey: summaryKey,
    queryFn: getTransactionSummary,
    enabled: open,
  })

  const chartData = useMemo(() => {
    const dataset = view === 'daily' ? data?.daily ?? [] : data?.monthly ?? []
    const labels = dataset.map(item => item.label)

    return {
      labels,
      datasets: [
        {
          label: 'Income',
          data: dataset.map(item => item.income),
          borderColor: '#2ECC71',
          backgroundColor: 'rgba(46, 204, 113, 0.15)',
          fill: true,
          tension: 0.3,
        },
        {
          label: 'Expenses',
          data: dataset.map(item => item.expense),
          borderColor: '#E74C3C',
          backgroundColor: 'rgba(231, 76, 60, 0.12)',
          fill: true,
          tension: 0.3,
        },
      ],
    }
  }, [data, view])

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Reports & Insights"
      subtitle="Visualize your cashflow trends to understand where money comes and goes."
      widthClassName="max-w-3xl"
    >
      <div className="flex flex-col gap-6">
        <ReportsHeader view={view} onChangeView={setView} totals={data?.totals} />

        {isLoading ? (
          <Spinner size="lg" centered />
        ) : data ? (
          <ReportsChart chartData={chartData} />
        ) : (
          <p className="rounded-2xl border border-dashed border-[var(--border-glass)] bg-[var(--surface-glass)] px-4 py-8 text-center text-sm text-[var(--text-muted)] backdrop-blur-md">
            No summary data yet. Add a transaction to see insights.
          </p>
        )}
      </div>
    </Modal>
  )
}
