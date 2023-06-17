import express, { Express } from "express";
import { randomUUID } from "node:crypto";
import { graphQLClient, searchJourneyQuery } from "./graphql";
import z from "zod";

export const createApp = (): Express => {
  const app = express();
  app.use(express.json());

  app.post("/api/search-journey", async (req, res) => {
    try {
      const { departureStation, arrivalStation, departureDateTime } = z
        .object({
          departureStation: z.string(),
          arrivalStation: z.string(),
          departureDateTime: z.string(),
        })
        .parse(req.body);

      const variables = {
        departureStation,
        arrivalStation,
        departureDateTime,
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
              id: z.string(),
              departureTime: z.string(),
              arrivalTime: z.string(),
              totalPrice: z.number(),
            })
          ),
        })
        .parseAsync(await graphQLClient.request(searchJourneyQuery, variables));

      res.json(data);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  return app;
};
