export interface User {
  id: string
  name: string | null
  email: string
  phone: string | null
  whatsapp: string | null
  avatar: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Ad {
  id: string
  title: string
  description: string
  price: number | null
  location: string | null
  condition: string
  images: string[]
  whatsapp: string
  status: string
  userId: string
  createdAt: Date
  updatedAt: Date
  metrics?: AdMetrics
}

export interface AdMetrics {
  id: string
  adId: string
  views: number
  whatsappClicks: number
  favorites: number
  shares: number
  createdAt: Date
  updatedAt: Date
}

export interface Plan {
  id: string
  name: string
  description: string | null
  price: number
  duration: number
  features: string[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Purchase {
  id: string
  userId: string
  planId: string
  status: string
  paymentId: string | null
  paymentMethod: string | null
  approvedAt: Date | null
  expiresAt: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface AdEngagement {
  id: string
  adId: string
  purchaseId: string
  startDate: Date
  endDate: Date
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Payment {
  id: string
  paymentId: string
  status: string
  amount: number
  paymentMethod: string | null
  approvedAt: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface JwtPayload {
  userId: string
  email: string
}