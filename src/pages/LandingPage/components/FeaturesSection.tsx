import { motion } from 'framer-motion'

const features = [
  { title: 'Unified View', desc: 'A single, calm dashboard tailored to your personal goals.' },
  { title: 'Smart Logging', desc: 'Record transactions with smart defaults and categories in seconds.' },
  { title: 'Privacy First', desc: 'Your data is encrypted and remains entirely yours. No ads, ever.' },
]

export const FeaturesSection = () => {
  return (
    <div className="mt-32 grid gap-8 md:grid-cols-3">
      {features.map((feature, i) => (
        <motion.div
          key={feature.title}
          whileHover={{ y: -8 }}
          className="rounded-[2rem] border border-[var(--border-glass)] bg-[var(--surface-glass-thick)] p-8 shadow-soft backdrop-blur-xl transition-shadow hover:shadow-card"
        >
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#3498db]/10 text-[#3498db] font-black">
            0{i + 1}
          </div>
          <h3 className="text-xl font-bold text-[var(--page-fg)]">{feature.title}</h3>
          <p className="mt-4 text-sm leading-relaxed text-[var(--text-muted)]">{feature.desc}</p>
        </motion.div>
      ))}
    </div>
  )
}
