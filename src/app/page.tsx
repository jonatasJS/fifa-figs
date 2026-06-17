'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ShoppingCart, 
  ArrowLeftRight, 
  TrendingUp, 
  Shield,
  Smartphone,
  Zap,
  Globe,
  Trophy
} from 'lucide-react'

// Variáveis de animação para stagger
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
}

export default function Home() {
  return (
    <div className="min-h-screen w-full overflow-hidden text-[var(--foreground)] pt-16">
      
      {/* Hero Section */}
      <section className="relative w-full py-20 flex flex-col items-center justify-center min-h-[80vh]">
        {/* Background Image da Copa */}
        <div className="absolute inset-0 z-[-1] opacity-30">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--background)] z-10" />
          <img 
            src="https://images.unsplash.com/photo-1518605368461-1e1e38ce8058?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
            alt="Estádio de Futebol Copa" 
            className="w-full h-full object-cover"
          />
        </div>

        <motion.div 
          className="text-center max-w-5xl mx-auto px-4 relative z-10"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 border-[var(--primary-wc)] border-opacity-50">
            <Trophy className="w-5 h-5 text-[var(--primary-wc)]" />
            <span className="text-sm font-semibold tracking-wider text-[var(--secondary-wc)]">A CAMINHO DA COPA 2026</span>
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-5xl md:text-8xl font-black mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-[var(--primary-wc)] via-white to-[var(--secondary-wc)] bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(255,0,85,0.5)]">
              Complete Seu Álbum
            </span>
            <br />
            da FIFA
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto font-light">
            O marketplace definitivo para colecionadores. Negocie diretamente, sem taxas ocultas, e prepare-se para o maior evento do mundo.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/ads"
              className="group relative px-8 py-4 bg-gradient-to-r from-[var(--primary-wc)] to-[var(--tertiary-wc)] text-white text-lg font-bold rounded-xl overflow-hidden shadow-[0_0_30px_rgba(204,0,255,0.4)] hover:shadow-[0_0_40px_rgba(255,0,85,0.6)] transition-all duration-300"
            >
              <span className="relative z-10 flex items-center gap-2">
                Ver Anúncios <Globe className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
              </span>
              <div className="absolute inset-0 h-full w-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
            </Link>
            <Link
              href="/register"
              className="px-8 py-4 glass text-[var(--foreground)] hover:text-[var(--secondary-wc)] hover:border-[var(--secondary-wc)] text-lg font-bold rounded-xl transition-all duration-300"
            >
              Começar Agora
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative z-10">
        <motion.div 
          className="container mx-auto px-4 max-w-6xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold text-center mb-16 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
            Como Funciona
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<ShoppingCart className="w-10 h-10" />}
              title="Compre e Venda"
              description="Encontre figurinhas raras ou venda suas repetidas com lucro. O mercado em suas mãos."
              color="var(--primary-wc)"
            />
            <FeatureCard
              icon={<ArrowLeftRight className="w-10 h-10" />}
              title="Trocas Diretas"
              description="A magia de colecionar: troque 1x1 com pessoas da sua região de forma segura."
              color="var(--secondary-wc)"
            />
            <FeatureCard
              icon={<Smartphone className="w-10 h-10" />}
              title="Via WhatsApp"
              description="Negociações instantâneas direto no zap. Agilidade máxima sem intermediários."
              color="var(--tertiary-wc)"
            />
          </div>
        </motion.div>
      </section>

      {/* Showcase Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-[var(--background)] skew-y-3 z-[-1] border-y border-[rgba(255,255,255,0.05)] shadow-[0_0_50px_rgba(0,255,204,0.1)]" />
        
        <motion.div 
          className="container mx-auto px-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold text-center mb-16 text-white">
            Por que usar o FIFA Figs?
          </motion.h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <BenefitCard icon={<Zap />} title="Velocidade" desc="Crie anúncios num piscar de olhos." />
            <BenefitCard icon={<Shield />} title="Segurança" desc="Perfis verificados e comunidade engajada." />
            <BenefitCard icon={<TrendingUp />} title="Destaque" desc="Impulsione seus anúncios para o topo." />
            <BenefitCard icon={<Globe />} title="Global" desc="Acesso a colecionadores do Brasil inteiro." />
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 z-[-1]">
           <div className="absolute inset-0 bg-black/60 z-10 backdrop-blur-sm" />
           <img 
             src="https://images.unsplash.com/photo-1522778119026-d647f0596c20?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
             alt="Celebração Futebol" 
             className="w-full h-full object-cover"
           />
        </div>
        <motion.div 
          className="container mx-auto px-4 text-center glass-panel max-w-4xl py-16"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            O Apito Inicial Vai Soar!
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Junte-se à maior comunidade de colecionadores do Brasil e não fique com espaços vazios no seu álbum.
          </p>
          <Link
            href="/register"
            className="inline-block px-10 py-5 bg-gradient-to-r from-[var(--secondary-wc)] to-blue-500 text-black text-xl font-bold rounded-xl hover:shadow-[0_0_30px_rgba(0,255,204,0.6)] hover:scale-105 transition-all duration-300"
          >
            Criar Conta Grátis
          </Link>
        </motion.div>
      </section>
    </div>
  )
}

function FeatureCard({ icon, title, description, color }: { icon: React.ReactNode, title: string, description: string, color: string }) {
  return (
    <motion.div 
      variants={itemVariants}
      whileHover={{ y: -10, scale: 1.02 }}
      className="glass-panel p-8 text-center relative overflow-hidden group"
    >
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500" 
        style={{ background: `radial-gradient(circle at center, ${color} 0%, transparent 70%)` }}
      />
      <div 
        className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] transition-transform duration-500 group-hover:rotate-12"
        style={{ color: color, textShadow: `0 0 10px ${color}` }}
      >
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-transparent group-hover:bg-clip-text transition-colors duration-300" style={{ backgroundImage: `linear-gradient(to right, white, ${color})` }}>
        {title}
      </h3>
      <p className="text-gray-400 font-light leading-relaxed">{description}</p>
    </motion.div>
  )
}

function BenefitCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <motion.div 
      variants={itemVariants}
      className="p-6 text-center glass rounded-2xl hover:bg-[rgba(255,255,255,0.1)] transition-colors cursor-default"
    >
      <div className="text-[var(--primary-wc)] mb-4 flex justify-center drop-shadow-[0_0_5px_rgba(255,0,85,0.5)]">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
      <p className="text-sm text-gray-400">{desc}</p>
    </motion.div>
  )
}