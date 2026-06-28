import { motion } from 'framer-motion'

export const DashboardPreview = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2, duration: 1 }}
      className="relative rounded-[2rem] border border-[var(--border-glass)] bg-[var(--surface-glass)] p-3 shadow-xl backdrop-blur-xl sm:rounded-[2.5rem] sm:p-4"
    >
      <div className="rounded-[1.7rem] border border-[var(--border-glass)] bg-[var(--surface-glass-thick)] p-5 shadow-soft backdrop-blur-xl sm:rounded-[2rem] sm:p-8">
        <div className="mb-6 flex justify-center sm:mb-10">
          <div className="inline-flex w-full max-w-[18rem] rounded-full border border-[var(--border-glass)] bg-[var(--surface-glass)] p-1 shadow-inner backdrop-blur-md">
            <button className="flex-1 rounded-full bg-[#3498db] px-3 py-1.5 text-[11px] font-bold text-white shadow-sm sm:px-6 sm:text-xs">
              Today's Activity
            </button>
            <button className="flex-1 rounded-full px-3 py-1.5 text-[11px] font-bold text-[var(--text-muted)] sm:px-6 sm:text-xs">
              All Transactions
            </button>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3 sm:mb-8 sm:gap-4">
          <div className="rounded-3xl border border-[#2ecc71]/20 bg-[#2ecc71]/5 p-4 sm:p-5">
            <p className="text-[9px] font-bold uppercase tracking-widest text-[#2ecc71]/70 sm:text-[10px]">
              Income Today
            </p>
            <p className="mt-1 text-xl font-black text-[#2ecc71] sm:text-2xl">$4,820.00</p>
          </div>

          <div className="rounded-3xl border border-[#e74c3c]/20 bg-[#e74c3c]/5 p-4 sm:p-5">
            <p className="text-[9px] font-bold uppercase tracking-widest text-[#e74c3c]/70 sm:text-[10px]">
              Expenses Today
            </p>
            <p className="mt-1 text-xl font-black text-[#e74c3c] sm:text-2xl">$1,120.40</p>
          </div>
        </div>

        <div className="space-y-3">
          {[
            { label: 'Freelance Payout', price: '+$2,400.00', color: '#2ecc71' },
            { label: 'Grocery Store', price: '-$120.00', color: '#e74c3c' },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-2xl border border-[var(--border-glass)] bg-[var(--surface-glass)] p-3.5 backdrop-blur-md sm:p-4"
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
