interface HeroSectionProps {
  onRegister: () => void
}

export const HeroSection = ({ onRegister }: HeroSectionProps) => {
  return (
    <section className="flex flex-col items-center px-2 text-center sm:items-start sm:px-4 sm:text-left">
      <span className="inline-flex rounded-full bg-[#3498db]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#3498db]">
        Finance, refined
      </span>

      <h1 className="mt-5 text-[2.35rem] font-extrabold leading-[1.08] tracking-tight text-[var(--page-fg)] sm:mt-6 sm:text-7xl">
        Everything you earn & spend, <br />
        <span className="bg-gradient-to-r from-[#3498db] to-[#5dade2] bg-clip-text text-transparent">
          beautifully organized.
        </span>
      </h1>

      <p className="mt-6 max-w-lg text-base leading-7 text-[var(--text-muted)] sm:mt-8 sm:text-lg sm:leading-relaxed">
        Blipzo pairs intuitive tracking with calm visuals so you can review income, expenses, and balance within a single,
        distraction-free workspace.
      </p>

      <div className="mt-7 flex w-full flex-col gap-4 sm:mt-8 sm:w-auto sm:flex-row">
        <button
          type="button"
          onClick={onRegister}
          className="w-full rounded-full bg-[#3498db] px-10 py-4 text-base font-bold text-white shadow-lg shadow-blue-500/20 transition hover:bg-[#2F89C9] sm:w-auto"
        >
          Get started for free
        </button>
      </div>
    </section>
  )
}
