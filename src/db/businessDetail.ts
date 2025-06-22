import { prisma } from "../lib/prisma"

// get service by id
async function getBusinessDetailById(id: string) {
  return await prisma.businessDetail.findUnique({
    where: {
      id,
    },
    include: {
      address: true, // Include the address relation
      holiday: true, // Include the holiday relation
      businessAvailability: {
        include: {
          timeSlots: true,
        },
      },
    },
  })
}

export { getBusinessDetailById }
