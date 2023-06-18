import { Database } from "./index";

export default function makeJourneyDb({ database }: { database: Database }) {
  async function findAll({}) {
    const journeys = await database.journey.findMany({
      include: {
        prices: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    return journeys;
  }

  return Object.freeze({
    findAll,
  });
}

export type MakeJourneyDb = ReturnType<typeof makeJourneyDb>;
