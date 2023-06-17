import { GraphQLClient, gql } from "graphql-request";

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
      id
      departureTime
      arrivalTime
      totalPrice
    }
  }
`;
