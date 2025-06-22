import { prisma } from '../lib/prisma'

// get service by id
async function getTicketById(id: string) {
  return await prisma.ticket.findUnique({
    where: {
      id,
    },
  })
}

export { getTicketById }
