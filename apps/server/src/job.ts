import cron from "node-cron";
import { db, getJourneys, updateJourney } from "./db";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import { fetchLowestOffer, graphQLClient, searchJourneyQuery } from "./graphql";
import { Journey, JourneyPrice } from "@prisma/client";
import { performance } from "node:perf_hooks";

const isPriceLower = (
  journey: Journey & { prices: JourneyPrice[] },
  lowestOffer: {
    departureTime: string;
    totalPrice: number;
    arrivalTime: string;
  }
) => {
  return (
    journey.prices.length === 0 ||
    lowestOffer.totalPrice < journey.prices[0].totalPrice
  );
};

export const job = cron.schedule("* * * * *", async () => {
  console.log("Start");
  const journeys = await getJourneys();
  const lowestOffers = await Promise.all(journeys.map(fetchLowestOffer));
  const updateJourneys = journeys
    .filter((journey, index) => isPriceLower(journey, lowestOffers[index]))
    .map((journey, index) => updateJourney(journey, lowestOffers[index]));

  const updated = await Promise.all(updateJourneys);
  console.log(`End, updated ${updated.length} items!`);
});
