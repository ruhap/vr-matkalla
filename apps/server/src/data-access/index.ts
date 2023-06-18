import { PrismaClient } from "@prisma/client";
import makeJourneyDb from "./journeys";

const database = new PrismaClient();
export type Database = PrismaClient;

const journeysDb = makeJourneyDb({ database });
export default journeysDb;
