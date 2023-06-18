import { Request, Response } from "express";

export default function makeGetJourneys({ listJourneys }: { listJourneys }) {
  return async function getJourneys(req: Request, res: Response) {};
}
