export interface Task {
  _id: string
  title: string
  status: string
  userId: string
}

export interface User {
  _id: string
  username: string
  email: string
  password: string
  isPremium: boolean
  createdAt: Date
}

export interface Session {
  userId: string
  username: string
  email: string
  isPremium: boolean
}
