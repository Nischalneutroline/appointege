import { prisma } from "../lib/prisma"

// get service by id
async function getResourceDetailById(id: string) {
  return await prisma.resource.findUnique({
    where: {
      id,
    },
  })
}

export { getResourceDetailById }
