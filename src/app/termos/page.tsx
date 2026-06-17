export default function TermosPage() {
  return (
    <div className="pt-24 pb-20 max-w-4xl mx-auto w-full">
      <div className="glass-panel p-8 md:p-12">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-[var(--primary-wc)] to-[var(--secondary-wc)] bg-clip-text text-transparent">
          Termos de Uso
        </h1>
        
        <div className="space-y-6 text-gray-300 leading-relaxed">
          <p>
            Última atualização: 17 de Junho de 2026.
          </p>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">1. Aceitação dos Termos</h2>
            <p>
              Ao acessar e usar a plataforma FIFA Figs ("Plataforma"), você concorda em cumprir e ser regido 
              por estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não deve usar 
              nossos serviços.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">2. Descrição do Serviço</h2>
            <p>
              O FIFA Figs atua como um classificado online ("marketplace") conectando colecionadores interessados 
              em comprar, vender ou trocar figurinhas. Nós não intermediamos as transações financeiras das 
              figurinhas, as quais ocorrem de forma direta entre as partes, tipicamente via WhatsApp.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">3. Regras de Conduta</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Fornecer informações precisas sobre as figurinhas anunciadas.</li>
              <li>Não publicar conteúdo ofensivo, ilegal ou enganoso.</li>
              <li>Manter o respeito durante as negociações com outros usuários.</li>
              <li>É proibida a venda de itens falsificados ou não oficiais da FIFA.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">4. Planos de Engajamento</h2>
            <p>
              Oferecemos planos opcionais para destacar seus anúncios. O pagamento destes planos é processado 
              via Mercado Pago. O período de destaque começa a contar a partir da confirmação do pagamento e não é 
              reembolsável após o início do uso do serviço.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">5. Limitação de Responsabilidade</h2>
            <p>
              O FIFA Figs não se responsabiliza por:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Negociações frustradas ou fraudes cometidas por terceiros fora da plataforma.</li>
              <li>A qualidade ou autenticidade das figurinhas negociadas.</li>
              <li>Danos diretos ou indiretos decorrentes do uso da plataforma.</li>
            </ul>
            <p className="mt-2 text-[var(--primary-wc)] text-sm">
              Recomendamos cautela em trocas presenciais. Encontre-se em locais públicos e seguros.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
