export default function PrivacidadePage() {
  return (
    <div className="pt-24 pb-20 max-w-4xl mx-auto w-full">
      <div className="glass-panel p-8 md:p-12">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-[var(--secondary-wc)] to-[var(--tertiary-wc)] bg-clip-text text-transparent">
          Política de Privacidade
        </h1>
        
        <div className="space-y-6 text-gray-300 leading-relaxed">
          <p>
            Última atualização: 17 de Junho de 2026.
          </p>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">1. Coleta de Dados</h2>
            <p>
              Para fornecer nossos serviços, coletamos as seguintes informações:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Dados de registro: Nome, E-mail e número de WhatsApp.</li>
              <li>Dados de acesso: IP, tipo de navegador, sistema operacional.</li>
              <li>Dados de navegação: Páginas visitadas, interações com anúncios.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">2. Uso das Informações</h2>
            <p>
              Suas informações são utilizadas para:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Facilitar a conexão com outros colecionadores através do WhatsApp fornecido nos anúncios.</li>
              <li>Autenticação de acesso e segurança da conta.</li>
              <li>Melhorar a experiência do usuário na plataforma.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">3. Compartilhamento de Dados</h2>
            <p>
              O seu nome e número de WhatsApp ficarão **públicos** nos anúncios que você criar, para que outros usuários possam entrar em contato com você.
              Nós não vendemos seus dados para terceiros. Informações de pagamento são processadas integralmente pelo Mercado Pago, não armazenamos dados de cartão de crédito em nossos servidores.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">4. Cookies</h2>
            <p>
              Utilizamos cookies estritamente necessários para manter a sua sessão ativa (autenticação JWT via localStorage) e métricas básicas de visualização de anúncios.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">5. Seus Direitos</h2>
            <p>
              Você pode a qualquer momento:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Excluir seus anúncios.</li>
              <li>Atualizar suas informações de perfil.</li>
              <li>Solicitar a exclusão completa da sua conta entrando em contato conosco.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
