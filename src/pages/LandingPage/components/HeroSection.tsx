interface HeroSectionProps {
  onRegister: () => void
}

export const HeroSection = ({ onRegister }: HeroSectionProps) => {
  return (
    <div className="flex flex-col items-center text-center px-4 sm:items-start sm:text-left">
      <span className="inline-flex rounded-full bg-[#3498db]/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[#3498db]">
        Finance, refined
      </span>
      <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-[var(--page-fg)] sm:text-7xl">
        Everything you earn & spend, <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3498db] to-[#5dade2]">
          beautifully organized.
        </span>
      </h1>
      <p className="mt-8 max-w-lg text-base leading-relaxed text-[var(--text-muted)] sm:text-lg">
        Blipzo pairs intuitive tracking with calm visuals so you can review income, expenses, and balance within a single,
        distraction-free workspace.
      </p>
      <div className="mt-10 flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
        <button
          onClick={onRegister}
          className="w-full rounded-full bg-[#3498db] px-10 py-4 text-base font-bold text-white shadow-[0_20px_40px_-10px_rgba(52,152,219,0.4)] transition hover:bg-[#2F89C9] sm:w-auto"
        >
          Get started for free
        </button>
      </div>
    </div>
  )
}
