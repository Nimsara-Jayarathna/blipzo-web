import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowTrendDown, faArrowTrendUp, faWallet } from '@fortawesome/free-solid-svg-icons'
import { SummaryCard } from '../ui/SummaryCard'

interface TodaySummaryCardsProps {
  income: number
  expense: number
  balance: number
  currency?: string
}

export const TodaySummaryCards = ({ income, expense, balance, currency }: TodaySummaryCardsProps) => {
  const cards = [
    {
      title: "Income",
      amount: income,
      accent: 'income' as const,
      icon: <FontAwesomeIcon icon={faArrowTrendUp} />,
      highlight: 'Today',
    },
    {
      title: "Expenses",
      amount: expense,
      accent: 'expense' as const,
      icon: <FontAwesomeIcon icon={faArrowTrendDown} />,
      highlight: 'Today',
    },
    {
      title: "Balance",
      amount: balance,
      accent: 'balance' as const,
      icon: <FontAwesomeIcon icon={faWallet} />,
      highlight: balance >= 0 ? 'On track' : 'Overspent',
    },
  ]

  return (
    <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
      {cards.map(card => (
        <SummaryCard
          key={card.title}
          title={card.title}
          amount={card.amount}
          accent={card.accent}
          icon={card.icon}
          highlight={card.highlight}
          currency={currency}
        />
      ))}
    </div>
  )
}
