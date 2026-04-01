const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <footer className="relative z-10 border-t border-white/10 bg-slate-950/70">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-2 px-4 py-4 text-sm text-slate-400 sm:flex-row sm:items-center">
        <p>© {year} Smart Campus Hub</p>
        <p>All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
