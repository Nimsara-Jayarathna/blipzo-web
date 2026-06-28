import { motion } from 'framer-motion'

const features = [
  { title: 'Unified View', desc: 'A single, calm dashboard tailored to your personal goals.' },
  { title: 'Smart Logging', desc: 'Record transactions with smart defaults and categories in seconds.' },
  { title: 'Privacy First', desc: 'Your data is encrypted and remains entirely yours. No ads, ever.' },
]

interface FeaturesSectionProps {
  onRegister: () => void
}

export const FeaturesSection = ({ onRegister }: FeaturesSectionProps) => {
  return (
    <section className="mt-16 sm:mt-20 lg:mt-24">
      <div className="grid gap-5 sm:gap-6 md:grid-cols-3 lg:gap-8">
        {features.map((feature, i) => (
          <motion.article
            key={feature.title}
            whileHover={{ y: -8 }}
            className="rounded-[2rem] border border-[var(--border-glass)] bg-[var(--surface-glass-thick)] p-7 shadow-soft backdrop-blur-xl transition-shadow hover:shadow-card sm:p-8"
          >
            <div className="mb-7 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#3498db]/10 text-sm font-black text-[#3498db] sm:mb-8 sm:h-12 sm:w-12">
              0{i + 1}
            </div>
            <h3 className="text-xl font-bold text-[var(--page-fg)]">{feature.title}</h3>
            <p className="mt-4 text-sm leading-6 text-[var(--text-muted)]">{feature.desc}</p>
          </motion.article>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5 }}
        className="mt-6 rounded-[2rem] border border-[var(--border-glass)] bg-[var(--surface-glass-thick)] p-7 text-center shadow-soft backdrop-blur-xl sm:mt-8 sm:p-8 md:flex md:items-center md:justify-between md:text-left"
      >
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#3498db]">Ready when you are</p>
          <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-[var(--page-fg)]">
            Start tracking without the noise.
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--text-muted)]">
            Keep income, expenses, and balance clear from day one with a workspace that stays simple.
          </p>
        </div>

        <button
          type="button"
          onClick={onRegister}
          className="mt-6 w-full rounded-full bg-[#3498db] px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:bg-[#2F89C9] md:mt-0 md:w-auto"
        >
          Create free account
        </button>
      </motion.div>
    </section>
  )
}
