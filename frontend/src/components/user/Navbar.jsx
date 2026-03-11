export default function Navbar() {
  return (
    <header className="flex items-center justify-between">
      <div>
        <p className="text-emerald-300 text-sm font-medium">Bank Policy Assistant</p>
        <h1 className="text-xl md:text-2xl font-bold mt-1">Customer Website</h1>
      </div>
      <nav className="hidden md:flex items-center gap-6 text-sm text-slate-200">
        <a href="#services" className="hover:text-white">
          Services
        </a>
        <a href="#assistant" className="hover:text-white">
          AI Assistant
        </a>
        <a href="#help" className="hover:text-white">
          Help
        </a>
      </nav>
      <a href="/admin/login" className="text-xs md:text-sm px-3 py-2 rounded-xl border border-white/20 bg-white/10">
        Admin
      </a>
    </header>
  );
}

