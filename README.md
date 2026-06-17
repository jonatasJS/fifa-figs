# FIFA Figs - Plataforma de Compra e Troca de Figurinhas

Plataforma SaaS para comprar, vender e trocar figurinhas da FIFA. Contato direto via WhatsApp sem intermediários, com sistema de engajamento de anúncios similar ao Instagram.

## 🚀 Tecnologias

- **Frontend**: Next.js 16, React 19, TailwindCSS 4
- **Backend**: Next.js API Routes
- **Banco de Dados**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Autenticação**: JWT
- **Pagamentos**: Mercado Pago (PIX, Cartão de Crédito/Débito)
- **Upload de Imagens**: Cloudinary
- **Validação**: Zod
- **Formulários**: React Hook Form

## 📋 Funcionalidades

### ✅ Implementadas

- **Autenticação**: Registro e login de usuários com JWT
- **Anúncios**: 
  - Criar, editar, excluir e pausar anúncios
  - Upload múltiplo de imagens
  - Busca e filtros por condition
  - Sistema de métricas (visualizações, cliques no WhatsApp)
- **Engajamento**: 
  - Planos de engajamento (Starter, Pro, Premium)
  - Pagamento via Mercado Pago
  - Webhook para confirmação de pagamento
  - Sistema de engajamento por período determinado
- **Perfil do Usuário**:
  - Editar dados pessoais
  - Ver histórico de compras
- **Dashboard**:
  - Visão geral dos anúncios
  - Métricas de performance
  - Gerenciamento de anúncios
- **Upload de Imagens**: Integração com Cloudinary

## 🛠️ Setup do Projeto

### 1. Instalar Dependências

```bash
pnpm install
```

Ou caso precise instalar as dependências manualmente:

```bash
pnpm add prisma @prisma/client bcryptjs jsonwebtoken axios cloudinary mercadopago zod date-fns react-hook-form lucide-react @types/bcryptjs @types/jsonwebtoken
```

### 2. Configurar Variáveis de Ambiente

O arquivo `.env` já está configurado com suas credenciais. Verifique se está correto:

```env
DATABASE_URL=postgresql://{user}:{pass}@{server}/{db}?sslmode=require&channel_binding=require
JWT_SECRET=94cf3a67ed5...
FRONTEND_URL=http://localhost:3000
MERCADO_PAGO_ACCESS_TOKEN=APP_USR-5455633...
MERCADO_PAGO_PUBLIC_KEY=APP_USR-Aae...
WEBHOOK_URL=/api/checkout/webhook
VAPID_PUBLIC_KEY=BHvFhuv8Wj...
VAPID_PRIVATE_KEY=xcFQ4Wxu...
VAPID_EMAIL=mailto:email@email.com
CLOUDINARY_CLOUD_NAME=name646j...
CLOUDINARY_API_KEY=4582372...
CLOUDINARY_API_SECRET=rsz2c...
```

### 3. Configurar Banco de Dados

```bash
# Gerar o cliente Prisma
npx prisma generate

# Criar as tabelas no banco de dados
npx prisma db push

# (Opcional) Criar planos iniciais
curl -X POST http://localhost:3000/api/seed
```

### 4. Executar o Projeto

```bash
pnpm dev
```

Acesse `http://localhost:3000` no seu navegador.

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── api/
│   │   ├── auth/          # Rotas de autenticação
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── ads/           # Rotas de anúncios
│   │   ├── checkout/      # Rotas de checkout e webhook
│   │   ├── dashboard/     # Rota do dashboard
│   │   ├── plans/         # Rotas de planos
│   │   ├── upload/        # Rota de upload de imagens
│   │   ├── user/          # Rotas de perfil
│   │   └── seed/          # Rota para criar planos iniciais
│   ├── ads/               # Páginas de anúncios
│   │   ├── [id]/
│   │   │   ├── engage/    # Página de engajamento
│   │   │   └── page.tsx   # Detalhes do anúncio
│   │   ├── create/        # Criar anúncio
│   │   └── page.tsx       # Listagem de anúncios
│   ├── dashboard/         # Página do dashboard
│   ├── login/             # Página de login
│   ├── profile/           # Página de perfil
│   ├── register/          # Página de registro
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Página inicial
│   └── globals.css        # Estilos globais
├── components/
│   └── Header.tsx         # Componente de header
├── contexts/
│   └── AuthContext.tsx    # Contexto de autenticação
├── lib/
│   ├── auth.ts            # Funções de autenticação
│   ├── cloudinary.ts      # Integração com Cloudinary
│   ├── mercadopago.ts     # Integração com Mercado Pago
│   └── prisma.ts          # Cliente Prisma
├── types/
│   └── index.ts           # Tipos TypeScript
prisma/
└── schema.prisma          # Schema do banco de dados
```

## 🎯 Fluxo de Uso

### Para Usuários

1. **Cadastro**: Acesse `/register` e crie uma conta
2. **Criar Anúncio**: No dashboard, clique em "Novo Anúncio"
3. **Adicionar Imagens**: Faça upload das fotos das figurinhas
4. **Preencher Detalhes**: Título, descrição, preço, condition, etc.
5. **Engajar (Opcional)**: Escolha um plano para destacar o anúncio
6. **Contato**: Interessados entram em contato via WhatsApp

### Sistema de Engajamento

- **Starter**: R$ 9,90 - 7 dias
- **Pro**: R$ 19,90 - 15 dias  
- **Premium**: R$ 39,90 - 30 dias

O usuário pode escolher a duração do engajamento e o método de pagamento (PIX ou cartão).

## 📊 Modelo de Dados

### Principais Entidades

- **User**: Usuários do sistema
- **Ad**: Anúncios de figurinhas
- **AdMetrics**: Métricas dos anúncios
- **Plan**: Planos de engajamento
- **Purchase**: Compras de planos
- **AdEngagement**: Engajamento de anúncios
- **Payment**: Pagamentos Mercado Pago

## 🔧 API Endpoints

### Autenticação
- `POST /api/auth/register` - Registrar usuário
- `POST /api/auth/login` - Fazer login

### Anúncios
- `GET /api/ads` - Listar anúncios
- `POST /api/ads` - Criar anúncio
- `GET /api/ads/[id]` - Buscar anúncio
- `PUT /api/ads/[id]` - Atualizar anúncio
- `DELETE /api/ads/[id]` - Deletar anúncio
- `POST /api/ads/[id]/whatsapp` - Registrar clique no WhatsApp

### Planos
- `GET /api/plans` - Listar planos
- `POST /api/seed` - Criar planos iniciais

### Checkout
- `POST /api/checkout/create` - Criar pagamento
- `POST /api/checkout/webhook` - Webhook Mercado Pago

### Upload
- `POST /api/upload` - Upload de imagens

### Dashboard
- `GET /api/dashboard` - Dados do dashboard

### Perfil
- `GET /api/user/profile` - Buscar perfil
- `PUT /api/user/profile` - Atualizar perfil

## 🔐 Segurança

- Senhas hash com bcryptjs
- Tokens JWT para autenticação
- Validação de dados com Zod
- Proteção de rotas por autenticação

## 🚀 Deploy

### Vercel

1. Conecte o repositório no Vercel
2. Configure as variáveis de ambiente
3. Execute `npx prisma generate` no build
4. Configure o webhook do Mercado Pago para produção

## 📝 Próximos Passos

- [ ] Chat interno entre usuários
- [ ] Sistema de avaliações
- [ ] Notificações push com VAPID
- [ ] Filtros avançados de busca
- [ ] Sistema de favoritos
- [ ] Integração com Google Maps para localização

## 📄 Licença

Este projeto é privado e propriedade do dono.

---

Desenvolvido com ❤️ para colecionadores de figurinhas FIFA
