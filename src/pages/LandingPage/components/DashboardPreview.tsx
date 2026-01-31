import { motion } from 'framer-motion'

export const DashboardPreview = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2, duration: 1 }}
      className="relative rounded-[2.5rem] border border-[var(--border-glass)] bg-[var(--surface-glass)] p-4 shadow-xl backdrop-blur-xl"
    >
      <div className="rounded-[2rem] border border-[var(--border-glass)] bg-[var(--surface-glass-thick)] p-8 shadow-soft backdrop-blur-xl">
        <div className="mb-10 flex justify-center">
          <div className="inline-flex rounded-full border border-[var(--border-glass)] bg-[var(--surface-glass)] p-1 shadow-inner backdrop-blur-md">
            <button className="rounded-full bg-[#3498db] px-6 py-1.5 text-xs font-bold text-white shadow-sm">
              Today's Activity
            </button>
            <button className="rounded-full px-6 py-1.5 text-xs font-bold text-[var(--text-subtle)]">
              All Transactions
            </button>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-4">
          <div className="rounded-3xl border border-[#2ecc71]/20 bg-[#2ecc71]/5 p-5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#2ecc71]/70">Income Today</p>
            <p className="mt-1 text-2xl font-black text-[#2ecc71]">$4,820.00</p>
          </div>
          <div className="rounded-3xl border border-[#e74c3c]/20 bg-[#e74c3c]/5 p-5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#e74c3c]/70">Expenses Today</p>
            <p className="mt-1 text-2xl font-black text-[#e74c3c]">$1,120.40</p>
          </div>
        </div>

        <div className="space-y-3">
          {[
            { label: 'Freelance Payout', price: '+$2,400.00', color: '#2ecc71' },
            { label: 'Grocery Store', price: '-$120.00', color: '#e74c3c' },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-2xl border border-[var(--border-glass)] bg-[var(--surface-glass)] p-4 backdrop-blur-md"
            >
              <span className="text-sm font-semibold text-[var(--page-fg)]">{item.label}</span>
              <span className="text-sm font-bold" style={{ color: item.color }}>
                {item.price}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
