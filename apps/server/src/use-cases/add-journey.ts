import { MakeJourneyDb } from "@/data-access/journeys";
import makeJourney from "@/entities";

export default function makeAddJourney({
  journeysDb,
}: {
  journeysDb: MakeJourneyDb;
}) {
  return async function addJourney({ journeyInfo }) {
    const journey = makeJourney(journeyInfo);
    const exists = await journeysDb.findAll({});

    if (exists) {
      return exists;
    }
  };
}
