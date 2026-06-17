# FIFA Figs - Informações de Desenvolvimento

## 🚀 Comandos Úteis

### Desenvolvimento
```bash
pnpm dev              # Iniciar servidor de desenvolvimento
pnpm build            # Build para produção
pnpm start            # Iniciar servidor de produção
```

### Banco de Dados
```bash
pnpm prisma:generate  # Gerar cliente Prisma
pnpm prisma:push      # Aplicar schema ao banco
pnpm prisma:studio    # Abrir Prisma Studio (UI do banco)
pnpm prisma:seed      # Criar planos iniciais
```

### Prisma direto
```bash
npx prisma generate
npx prisma db push
npx prisma studio
```

## 📋 Próximas Melhorias

### Prioritárias
- [ ] Chat interno entre usuários
- [ ] Sistema de avaliações/reviews
- [ ] Filtros avançados de busca (preço, localização, etc.)
- [ ] Sistema de favoritos

### Secundárias
- [ ] Notificações push (VAPID já configurado)
- [ ] Integração com Google Maps para localização
- [ ] Sistema de denúncias
- [ ] Verificação de telefone
- [ ] Upload de avatar do usuário

## 🔧 Configurações Importantes

### Mercado Pago
- Webhook configurado em: `/api/checkout/webhook`
- Suporta: PIX, Cartão de Crédito, Cartão de Débito
- Necessita configurar URL de webhook no painel do Mercado Pago em produção

### Cloudinary
- Pasta: `fifa-figs`
- Upload automático com compressão
- Formatos suportados: todas as imagens

### PostgreSQL
- Provider: Neon
- SSL habilitado
- Channel binding habilitado

## 🎨 Design System

### Cores
- Primary: Blue (#2563eb)
- Secondary: Purple (#7c3aed)
- Success: Green (#22c55e)
- Warning: Yellow (#eab308)
- Error: Red (#ef4444)

### Componentes
- Botões: Gradient blue to purple
- Cards: White with shadow-md
- Inputs: Border-gray-300 with focus ring

## 📊 Estrutura de Dados

### User
- id, name, email, phone, whatsapp, password, avatar, createdAt, updatedAt

### Ad
- id, title, description, price, location, condition, images[], whatsapp, status, userId

### AdMetrics
- id, adId, views, whatsappClicks, favorites, shares

### Plan
- id, name, description, price, duration, features[]

### Purchase
- id, userId, planId, status, paymentId, paymentMethod, approvedAt, expiresAt

### AdEngagement
- id, adId, purchaseId, startDate, endDate, isActive

### Payment
- id, paymentId, status, amount, paymentMethod, approvedAt

## 🔐 Autenticação

- JWT com expiração de 7 dias
- Token armazenado em localStorage
- Header: `Authorization: Bearer <token>`
- Refresh: necessário fazer login novamente após expiração

## 🌐 Rotas Importantes

### Públicas
- `/` - Página inicial
- `/login` - Login
- `/register` - Registro
- `/ads` - Listagem de anúncios
- `/ads/[id]` - Detalhes do anúncio

### Privadas (requer autenticação)
- `/dashboard` - Dashboard do usuário
- `/profile` - Perfil do usuário
- `/ads/create` - Criar anúncio
- `/ads/[id]/edit` - Editar anúncio
- `/ads/[id]/engage` - Engajar anúncio

### API
- `/api/auth/*` - Autenticação
- `/api/ads/*` - Anúncios
- `/api/checkout/*` - Checkout e webhook
- `/api/plans` - Planos
- `/api/upload` - Upload
- `/api/dashboard` - Dashboard
- `/api/user/profile` - Perfil

## 🐛 Troubleshooting

### Erros comuns

1. **Erro de conexão com banco de dados**
   - Verifique DATABASE_URL no .env
   - Execute `npx prisma db push`

2. **Erro no upload de imagem**
   - Verifique credenciais do Cloudinary
   - Verifique se o arquivo é uma imagem

3. **Erro no Mercado Pago**
   - Verifique MERCADO_PAGO_ACCESS_TOKEN
   - Verifique se o webhook está configurado corretamente

4. **Erro de autenticação**
   - Verifique JWT_SECRET no .env
   - Limpe localStorage e faça login novamente

## 📱 Testes Manuais

### Fluxo completo de teste:
1. Acesse `/register` e crie uma conta
2. Acesse `/dashboard` e clique em "Novo Anúncio"
3. Preencha os dados e faça upload de imagens
4. Acesse `/ads` e veja seu anúncio
5. Clique no anúncio e teste o contato via WhatsApp
6. Acesse `/ads/[id]/engage` e teste o fluxo de pagamento
7. Verifique o webhook do Mercado Pago (simulado)

## 🚀 Deploy

### Variáveis de ambiente necessárias em produção:
- DATABASE_URL
- JWT_SECRET
- FRONTEND_URL (URL da aplicação em produção)
- MERCADO_PAGO_ACCESS_TOKEN
- MERCADO_PAGO_PUBLIC_KEY
- WEBHOOK_URL
- CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET

### Webhook Mercado Pago em produção:
Configure a URL: `https://seu-dominio.com/api/checkout/webhook`