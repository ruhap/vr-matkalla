import cron from "node-cron";
import { db } from "./db";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import { graphQLClient, searchJourneyQuery } from "./graphql";

export const job = cron.schedule("* * * * *", async () => {
  console.log("running a task every minute");
  const journey = await db.journey.findFirst();

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
  console.log("data", data);

  // Update the search journey data in the database
  // await db.searchJourney.update({
  //   where: { id: journey.id },
  //   data: { data: JSON.stringify(data) },
  // });
});
