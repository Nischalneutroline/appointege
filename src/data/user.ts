import { prisma } from '@/lib/prisma'
import { User, BusinessDetail } from '@prisma/client'

// Define a type for serialized BusinessDetail to ensure string dates
type SerializedBusinessDetail = Omit<
  BusinessDetail,
  'createdAt' | 'updatedAt'
> & {
  createdAt: string
  updatedAt: string
}

// Define a type for the returned user with serialized ownedBusinesses
type SerializedUser = Omit<User, 'ownedBusinesses'> & {
  ownedBusinesses: SerializedBusinessDetail[] | null
}

export const getUserByEmail = async (
  email: string,
): Promise<SerializedUser | null> => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { ownedBusinesses: true },
    })

    if (!user) {
      return null
    }

    // Serialize Date fields in ownedBusinesses
    const serializedUser: SerializedUser = {
      ...user,
      ownedBusinesses: user.ownedBusinesses
        ? user.ownedBusinesses.map((business) => ({
            ...business,
            createdAt: business.createdAt.toISOString(),
            updatedAt: business.updatedAt.toISOString(),
          }))
        : null,
    }

    return serializedUser
  } catch (error) {
    console.log('Error while getting user by Email', error)
    return null
  }
}

export const getUserById = async (
  id: string,
): Promise<SerializedUser | null> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { ownedBusinesses: true },
    })

    if (!user) {
      return null
    }

    // Serialize Date fields in ownedBusinesses
    const serializedUser: SerializedUser = {
      ...user,
      ownedBusinesses: user.ownedBusinesses
        ? user.ownedBusinesses.map((business) => ({
            ...business,
            createdAt: business.createdAt.toISOString(),
            updatedAt: business.updatedAt.toISOString(),
          }))
        : null,
    }

    return serializedUser
  } catch (error) {
    console.log('Error while getting user by Id', error)
    return null
  }
}

export const getAccountByUserId = async (userId: string) => {
  try {
    const accountUser = await prisma.account.findFirst({ where: { userId } })
    return accountUser
  } catch (error) {
    console.log('Error while getting account by userId', error)
    return null
  }
}
