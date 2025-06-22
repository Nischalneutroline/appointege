import { prisma } from "../lib/prisma";

// get service by id
async function getAnnouncementOrOfferById(id: string) {
  return await prisma.announcementOrOffer.findUnique({
    where: {
      id,
    },
  });
}

export { getAnnouncementOrOfferById };
