import { prisma } from "../lib/prisma"

// get service by id
async function getFAQSById(id: string) {
  return await prisma.fAQ.findUnique({
    where: {
      id: id,
    },
  })
}

export { getFAQSById }
