export const Footer = () => {
    return (
        <footer className="mt-auto w-full border-t border-[var(--border-glass)] bg-[var(--surface-glass)] py-8 text-center backdrop-blur-md">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-2 px-6 text-sm text-[var(--text-muted)] sm:flex-row sm:justify-between">
                <span>© 2026 Blipzo. All rights reserved.</span>
                <span className="font-medium text-[var(--text-subtle)]">v1.1.0</span>
            </div>
        </footer>
    )
}
