import { MakeJourneyDb } from "@/data-access/journeys";

export default function makeListJourneys({
  journeysDb,
}: {
  journeysDb: MakeJourneyDb;
}) {
  return async function listJourneys({}) {
    const journeys = await journeysDb.findAll({});
    return journeys;
  };
}
