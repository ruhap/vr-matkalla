import express, { Express } from "express";
import { request, gql } from "graphql-request";
import { randomUUID } from "node:crypto";

export const createApp = (): Express => {
  const app = express();
  app.use(express.json());

  app.post("/api/search-journey", async (req, res) => {
    try {
      const { departureStation, arrivalStation, departureDateTime } = req.body;

      const endpoint = "https://www.vr.fi/api/v6";

      const graphqlQuery = gql`
        query searchJourney(
          $departureStation: String!
          $arrivalStation: String!
          $departureDateTime: DateTime!
          $passengers: [PassengerInput!]!
          $filters: [ConnectionFilter]!
          $placeTypes: [PlaceType!]!
        ) {
          searchJourney(
            departureStation: $departureStation
            arrivalStation: $arrivalStation
            departureDateTime: $departureDateTime
            passengers: $passengers
            filters: $filters
            placeTypes: $placeTypes
          ) {
            id
            departureTime
            arrivalTime
            totalPrice
          }
        }
      `;

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

      const response = (await request(endpoint, graphqlQuery, variables)) as {
        searchJourney: {
          id: string;
          departureTime: string;
          arrivalTime: string;
          totalPrice: number;
        }[];
      };

      const data = response.searchJourney;

      res.json(data);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  return app;
};
