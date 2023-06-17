import { Journey, JourneyPrice } from "@prisma/client";
import { GraphQLClient, gql } from "graphql-request";
import { randomUUID } from "node:crypto";
import { z } from "zod";

export const graphQLClient = new GraphQLClient("https://www.vr.fi/api/v6", {});

export const searchJourneyQuery = gql`
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
      departureTime
      arrivalTime
      totalPrice
    }
  }
`;

export const fetchLowestOffer = async (
  journey: Journey & { prices: JourneyPrice[] }
) => {
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

  const response = await graphQLClient.request(searchJourneyQuery, variables);

  const data = z
    .object({
      searchJourney: z.array(
        z.object({
          departureTime: z.string(),
          arrivalTime: z.string(),
          totalPrice: z.number(),
        })
      ),
    })
    .parse(response);

  const lowestOffer = data.searchJourney.reduce((lowest, current) =>
    current.totalPrice < lowest.totalPrice ? current : lowest
  );

  return lowestOffer;
};
