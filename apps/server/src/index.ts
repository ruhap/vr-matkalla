import express from "express";
import { getJourneys } from "./controllers";

const app = express();
app.use(express.json());

app.get("/journeys", getJourneys);

app.listen(3000, () => {
  console.info(`Server ready on port 3000`);
});
