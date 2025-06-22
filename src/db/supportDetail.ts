import { prisma } from "../lib/prisma"

// get service by id
async function getSupportDetailById(id: string) {
  return await prisma.supportBusinessDetail.findUnique({
    where: {
      id,
    },
  })
}
async function getSupportDetailByEmail(email: string) {
  return await prisma.supportBusinessDetail.findUnique({
    where: {
      supportEmail: email,
    },
  })
}
async function getSupportDetailByBusinessId(businessId: string) {
  return await prisma.supportBusinessDetail.findUnique({
    where: {
      businessId,
    },
  })
}

export {
  getSupportDetailById,
  getSupportDetailByEmail,
  getSupportDetailByBusinessId,
}
