import { prisma } from "../lib/prisma"

// get user by email from prisma
async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: {
      email: email,
    },
  })
}

// get user by id
async function getUserById(id: string) {
  return await prisma.user.findUnique({
    where: {
      id: id,
    },
  })
}

export { getUserByEmail, getUserById }
