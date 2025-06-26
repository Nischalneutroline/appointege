import { Appointment, Service, User } from '@prisma/client'

export type ReturnType = {
  message: string
  data: User | User[] | Appointment | Appointment[] | Service | Service[] | null
  status: number
  success: boolean
  errorDetail: any | null
}
