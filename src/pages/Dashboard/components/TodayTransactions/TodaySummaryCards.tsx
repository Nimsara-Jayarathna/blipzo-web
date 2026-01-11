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
      title: "Today's income",
      amount: income,
      accent: 'income' as const,
      icon: <FontAwesomeIcon icon={faArrowTrendUp} />,
      highlight: 'Money in today',
    },
    {
      title: "Today's expenses",
      amount: expense,
      accent: 'expense' as const,
      icon: <FontAwesomeIcon icon={faArrowTrendDown} />,
      highlight: 'Money out today',
    },
    {
      title: "Today's balance",
      amount: balance,
      accent: 'balance' as const,
      icon: <FontAwesomeIcon icon={faWallet} />,
      highlight: balance >= 0 ? 'On track today' : 'Overspending today',
    },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-3">
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
