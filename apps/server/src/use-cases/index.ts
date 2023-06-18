import makeAddJourney from "./add-journey";
import journeysDb from "@/data-access";
import makeListJourneys from "./list-journeys";

const addJourney = makeAddJourney({ journeysDb });
const listJourneys = makeListJourneys({ journeysDb });

const journeyService = Object.freeze({
  addJourney,
  listJourneys,
});

export default journeyService;
export { addJourney, listJourneys };
