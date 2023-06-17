import cron from "node-cron";
import { db } from "./db";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import { graphQLClient, searchJourneyQuery } from "./graphql";

export const job = cron.schedule("* * * * *", async () => {
  console.log("Running a task every minute");
  const journey = await db.journey.findFirst();

  if (!journey) return;

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
    journey.totalPrice === null ||
    lowestOffer.totalPrice < journey.totalPrice
  ) {
    console.log("Got better offer");
    const result = await db.journey.update({
      where: { id: journey?.id },
      data: {
        userId: journey?.userId,
        totalPrice: lowestOffer.totalPrice,
        departureStation: journey?.departureStation,
        arrivalStation: journey?.arrivalStation,
        departureDateTime: lowestOffer.departureTime,
      },
    });

    console.log(result);
  }
});
