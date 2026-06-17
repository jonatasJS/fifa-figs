const { PrismaClient } = require('@prisma/client')
process.env.DATABASE_URL = "postgresql://neondb_owner:b9nN1fVXZQlh@ep-dark-lab-acazk7g7-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require"
const prisma = new PrismaClient({ url: process.env.DATABASE_URL })

async function main() {
  const plans = await prisma.plan.createMany({
    data: [
      {
        name: 'Starter',
        description: 'Ideal para começar',
        price: 9.90,
        duration: 7,
        features: [
          'Destaque por 7 dias',
          'Aparece nos primeiros resultados',
          'Suporte por email',
        ],
        isActive: true,
      },
      {
        name: 'Pro',
        description: 'Para quem vende mais',
        price: 19.90,
        duration: 15,
        features: [
          'Destaque por 15 dias',
          'Aparece nos primeiros resultados',
          'Badge de destaque',
          'Suporte prioritário',
        ],
        isActive: true,
      },
      {
        name: 'Premium',
        description: 'Máxima visibilidade',
        price: 39.90,
        duration: 30,
        features: [
          'Destaque por 30 dias',
          'Aparece sempre no topo',
          'Badge premium',
          'Suporte 24/7',
          'Análises avançadas',
        ],
        isActive: true,
      },
    ],
    skipDuplicates: true,
  })
  console.log('Planos criados', plans)
}

main().catch(console.error).finally(() => prisma.$disconnect())
