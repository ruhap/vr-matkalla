import { Journey, JourneyPrice, PrismaClient } from "@prisma/client";

export const db = new PrismaClient();

export const getJourneys = async () => {
  const journeys = await db.journey.findMany({
    include: {
      prices: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
    },
  });

  return journeys;
};

export const updateJourney = async (
  journey: Journey & { prices: JourneyPrice[] },
  lowestOffer: {
    departureTime: string;
    totalPrice: number;
    arrivalTime: string;
  }
) => {
  const updatedJourney = await db.journey.update({
    where: { id: journey.id },
    data: {
      userId: journey.userId,
      departureStation: journey.departureStation,
      arrivalStation: journey.arrivalStation,
      departureDateTime: lowestOffer.departureTime,
      prices: {
        create: { totalPrice: lowestOffer.totalPrice },
      },
    },
    include: {
      prices: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
    },
  });

  return updatedJourney;
};
