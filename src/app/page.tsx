import Link from 'next/link'
import { 
  ShoppingCart, 
  ArrowLeftRight, 
  TrendingUp, 
  Shield,
  Smartphone,
  Zap
} from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Complete Seu Álbum da FIFA
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            Compre, venda e troque figurinhas com colecionadores de todo o Brasil. 
            Contato direto via WhatsApp, sem intermediários.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/ads"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl"
            >
              Ver Anúncios
            </Link>
            <Link
              href="/register"
              className="px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-xl border-2 border-blue-600 hover:bg-blue-50 transition-colors"
            >
              Começar Agora
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="como-funciona" className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
          Como Funciona
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <FeatureCard
            icon={<ShoppingCart className="w-12 h-12" />}
            title="Compre e Venda"
            description="Encontre as figurinhas que falta no seu álbum ou venda as repetidas. 
            Negocie diretamente com outros colecionadores."
          />
          <FeatureCard
            icon={<ArrowLeftRight className="w-12 h-12" />}
            title="Troque Figurinhas"
            description="Prefere trocar? Encontre pessoas com as figurinhas que você precisa 
            e faça trocas justas."
          />
          <FeatureCard
            icon={<Smartphone className="w-12 h-12" />}
            title="Contato via WhatsApp"
            description="Toda negociação é feita diretamente pelo WhatsApp. 
            Rápido, fácil e seguro."
          />
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            Por que usar o FIFA Figs?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <BenefitCard
              icon={<Zap className="w-8 h-8" />}
              title="Rápido e Fácil"
              description="Crie anúncios em segundos e conecte-se com compradores instantaneamente."
            />
            <BenefitCard
              icon={<Shield className="w-8 h-8" />}
              title="Sem Intermediários"
              description="Negocie direto com o vendedor. Taxas menores para ambos."
            />
            <BenefitCard
              icon={<TrendingUp className="w-8 h-8" />}
              title="Engaje seus Anúncios"
              description="Planos acessíveis para destacar seus anúncios e vender mais rápido."
            />
            <BenefitCard
              icon={<Smartphone className="w-8 h-8" />}
              title="100% Mobile"
              description="Use no seu celular, tablet ou computador. Onde estiver."
            />
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section id="planos" className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-4 text-gray-800">
          Planos de Engajamento
        </h2>
        <p className="text-center text-gray-600 mb-12 text-lg">
          Destaque seus anúncios e venda mais rápido
        </p>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <PlanCard
            name="Starter"
            price="R$ 9,90"
            duration="7 dias"
            features={[
              'Destaque por 7 dias',
              'Primeiros resultados',
              'Suporte por email',
            ]}
            popular={false}
          />
          <PlanCard
            name="Pro"
            price="R$ 19,90"
            duration="15 dias"
            features={[
              'Destaque por 15 dias',
              'Badge de destaque',
              'Suporte prioritário',
              'Aparece no topo',
            ]}
            popular={true}
          />
          <PlanCard
            name="Premium"
            price="R$ 39,90"
            duration="30 dias"
            features={[
              'Destaque por 30 dias',
              'Badge premium',
              'Suporte 24/7',
              'Análises avançadas',
              'Sempre no topo',
            ]}
            popular={false}
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Pronto para Começar?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Cadastre-se agora e comece a comprar, vender e trocar suas figurinhas da FIFA.
          </p>
          <Link
            href="/register"
            className="px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-xl hover:bg-gray-100 transition-colors shadow-lg"
          >
            Criar Conta Grátis
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">F</span>
                </div>
                <span className="text-xl font-bold">FIFA Figs</span>
              </div>
              <p className="text-gray-400">
                A melhor plataforma para comprar, vender e trocar figurinhas da FIFA.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/ads" className="hover:text-white transition-colors">Anúncios</Link></li>
                <li><Link href="#planos" className="hover:text-white transition-colors">Planos</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Entrar</Link></li>
                <li><Link href="/register" className="hover:text-white transition-colors">Cadastrar</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/terms" className="hover:text-white transition-colors">Termos de Uso</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacidade</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2026 FIFA Figs. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
      <div className="text-blue-600 mb-4">{icon}</div>
      <h3 className="text-2xl font-bold mb-3 text-gray-800">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

function BenefitCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="text-center p-6">
      <div className="text-purple-600 mb-4 flex justify-center">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

function PlanCard({ name, price, duration, features, popular }: { 
  name: string, 
  price: string, 
  duration: string,
  features: string[],
  popular: boolean
}) {
  return (
    <div className={`bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border-2 ${
      popular ? 'border-purple-500 relative' : 'border-gray-100'
    }`}>
      {popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
            Popular
          </span>
        </div>
      )}
      <h3 className="text-2xl font-bold text-gray-800 mb-2">{name}</h3>
      <div className="text-4xl font-bold text-blue-600 mb-2">{price}</div>
      <p className="text-gray-500 mb-6">{duration}</p>
      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2 text-gray-600">
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {feature}
          </li>
        ))}
      </ul>
      <Link
        href="/register"
        className="block w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center font-semibold rounded-lg hover:opacity-90 transition-opacity"
      >
        Começar Agora
      </Link>
    </div>
  )
}