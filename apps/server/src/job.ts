import cron from "node-cron";
import { db } from "./db";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import { graphQLClient, searchJourneyQuery } from "./graphql";

export const job = cron.schedule("* * * * *", async () => {
  console.log("Running a task every minute");

  const journeys = await db.journey.findMany({ include: { prices: true } });

  for (const journey of journeys) {
    const variables = {
      departureStation: journey?.departureStation,
      arrivalStation: journey?.arrivalStation,
      departureDateTime: journey?.departureDateTime,
      passengers: [
        {
          key: randomUUID(),
          type: "ADULT",
          wheelchair: false,
          vehicles: [],
        },
      ],
      filters: [],
      placeTypes: ["SEAT", "CABIN_BED"],
    };

    const data = await z
      .object({
        searchJourney: z.array(
          z.object({
            departureTime: z.string(),
            arrivalTime: z.string(),
            totalPrice: z.number(),
          })
        ),
      })
      .parseAsync(await graphQLClient.request(searchJourneyQuery, variables));

    const lowestOffer = data.searchJourney.reduce((lowest, current) =>
      current.totalPrice < lowest.totalPrice ? current : lowest
    );

    console.log(lowestOffer);

    if (
      journey.prices.length === 0 ||
      lowestOffer.totalPrice < journey.prices[0].totalPrice
    ) {
      console.log("Got better offer");
      await db.journey.update({
        where: { id: journey?.id },
        data: {
          userId: journey?.userId,
          departureStation: journey?.departureStation,
          arrivalStation: journey?.arrivalStation,
          departureDateTime: lowestOffer.departureTime,
          prices: {
            create: { totalPrice: lowestOffer.totalPrice },
          },
        },
        include: { prices: true },
      });
    }
  }
});
