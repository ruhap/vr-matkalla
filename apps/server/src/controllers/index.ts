import { addJourney, listJourneys } from "../use-cases";
import makeAddJourney from "./add-journey";
import makeGetJourneys from "./get-journeys";

const postJourney = makeAddJourney({ addJourney });
const getJourneys = makeGetJourneys({ listJourneys });

const journeyController = Object.freeze({
  postJourney,
  getJourneys,
});

export default journeyController;
export { postJourney, getJourneys };
