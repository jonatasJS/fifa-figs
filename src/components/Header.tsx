'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { User, LogOut, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'py-2' : 'py-6'}`}>
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="glass rounded-2xl px-6 py-3 flex justify-between items-center shadow-lg border border-[rgba(255,255,255,0.05)] bg-[rgba(15,15,20,0.6)]">
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div 
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.4 }}
              className="w-10 h-10 bg-gradient-to-br from-[var(--primary-wc)] to-[var(--secondary-wc)] rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(255,0,85,0.5)]"
            >
              <span className="text-white font-bold text-xl">F</span>
            </motion.div>
            <span className="text-2xl font-bold bg-gradient-to-r from-[var(--foreground)] to-[var(--secondary-wc)] bg-clip-text text-transparent group-hover:from-[var(--primary-wc)] transition-all duration-500">
              FIFA Figs
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/ads" className="text-gray-300 hover:text-[var(--secondary-wc)] hover:drop-shadow-[0_0_8px_rgba(0,255,204,0.8)] transition-all">
              Anúncios
            </Link>
            <Link href="/dashboard" className="text-gray-300 hover:text-[var(--secondary-wc)] hover:drop-shadow-[0_0_8px_rgba(0,255,204,0.8)] transition-all">
              Dashboard
            </Link>
            <Link href="/profile" className="text-gray-300 hover:text-[var(--secondary-wc)] hover:drop-shadow-[0_0_8px_rgba(0,255,204,0.8)] transition-all">
              Perfil
            </Link>
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white glass rounded-lg hover:bg-[rgba(255,255,255,0.1)] transition-colors"
                >
                  <User className="w-4 h-4 text-[var(--secondary-wc)]" />
                  <span className="font-medium">{user?.name || 'Usuário'}</span>
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2 text-red-400 hover:text-red-300 glass hover:bg-[rgba(255,0,0,0.1)] rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sair</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-gray-300 font-semibold hover:text-[var(--secondary-wc)] transition-colors"
                >
                  Entrar
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2 bg-gradient-to-r from-[var(--primary-wc)] to-[var(--tertiary-wc)] text-white font-semibold rounded-lg hover:shadow-[0_0_20px_rgba(255,0,85,0.6)] transition-shadow"
                >
                  Cadastrar
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-300 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden mt-4 glass rounded-2xl p-4 border border-[rgba(255,255,255,0.05)] bg-[rgba(15,15,20,0.9)]"
            >
              <nav className="flex flex-col gap-4">
                <Link href="/ads" className="text-gray-300 hover:text-[var(--secondary-wc)] transition-colors">
                  Anúncios
                </Link>
                {isAuthenticated ? (
                  <>
                    <Link href="/dashboard" className="text-gray-300 hover:text-[var(--secondary-wc)] transition-colors">
                      Dashboard
                    </Link>
                    <Link href="/profile" className="text-gray-300 hover:text-[var(--secondary-wc)] transition-colors">
                      Perfil
                    </Link>
                    <div className="border-t border-[rgba(255,255,255,0.1)] pt-4 mt-2">
                      <div className="flex items-center gap-2 text-gray-300 mb-4">
                        <User className="w-4 h-4 text-[var(--secondary-wc)]" />
                        <span>{user?.name || 'Usuário'}</span>
                      </div>
                      <button
                        onClick={logout}
                        className="flex items-center gap-2 text-red-400 hover:text-red-300 w-full"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sair</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="text-gray-300 hover:text-[var(--secondary-wc)] transition-colors">
                      Entrar
                    </Link>
                    <Link href="/register" className="text-[var(--primary-wc)] font-semibold transition-colors">
                      Cadastrar
                    </Link>
                  </>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}