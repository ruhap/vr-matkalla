import cron from "node-cron";
import { db, getJourneys, updateJourney } from "./db";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import { fetchLowestOffer, graphQLClient, searchJourneyQuery } from "./graphql";
import { Journey, JourneyPrice } from "@prisma/client";

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

export const job = cron.schedule("*/15 * * * * *", async () => {
  console.log("Running a task every minute");

  const journeys = await getJourneys();

  const fetchLowestOffers = journeys.map(fetchLowestOffer);
  const lowestOffers = await Promise.all(fetchLowestOffers);

  const updateJourneys = journeys
    .filter((journey, index) => isPriceLower(journey, lowestOffers[index]))
    .map((journey, index) => updateJourney(journey, lowestOffers[index]));

  await Promise.all(updateJourneys);
  console.log("End of a task every minute");
});
