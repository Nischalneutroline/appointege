'use server'

import { prisma } from '../lib/prisma'

export const createBusinessAPI = async () => {}
export const updateBusinessAPI = async () => {}

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
      supportBusinessDetail: {
        include: {
          supportAvailability: {
            include: {
              timeSlots: true,
            },
          },
          supportHoliday: true,
        },
      },
    },
  })
}
// get service by owner id
async function getBusinessDetailByOwnerId(id: string) {
  const businessDetails = await prisma.businessDetail.findMany({
    where: {
      businessOwner: id,
    },
    include: {
      address: true, // Include the address relation
      holiday: true, // Include the holiday relation
      businessAvailability: {
        include: {
          timeSlots: true,
        },
      },
      serviceAvailability: {
        include: {
          timeSlots: true,
        },
      },
      supportBusinessDetail: {
        include: {
          supportAvailability: {
            include: {
              timeSlots: true,
            },
          },
          supportHoliday: true,
        },
      },
    },
  })

  console.log(businessDetails, 'businessDetails')
  return businessDetails
}

export { getBusinessDetailById, getBusinessDetailByOwnerId }
