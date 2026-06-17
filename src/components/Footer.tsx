import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full mt-auto py-8 glass border-t-0 rounded-t-3xl relative z-10">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-xl font-bold bg-gradient-to-r from-[var(--primary-wc)] to-[var(--secondary-wc)] bg-clip-text text-transparent">
            FIFA Figs 2026
          </h3>
          <p className="text-sm text-gray-400 mt-1">
            &copy; {new Date().getFullYear()} FIFA Figs. Todos os direitos reservados.
          </p>
        </div>
        
        <nav className="flex items-center gap-6 text-sm text-gray-300">
          <Link href="/termos" className="hover:text-[var(--secondary-wc)] transition-colors">
            Termos de Uso
          </Link>
          <Link href="/privacidade" className="hover:text-[var(--tertiary-wc)] transition-colors">
            Privacidade
          </Link>
          <a href="#" className="hover:text-[var(--primary-wc)] transition-colors">
            Contato
          </a>
        </nav>
      </div>
    </footer>
  );
}
