import { db } from "../src/db";
import { randomUUID } from "node:crypto";

const main = async () => {
  await db.user.deleteMany({});
  await db.journey.deleteMany({});

  const user = await db.user.create({
    data: {
      email: "test@test.fi",
    },
  });

  const journey = await db.journey.create({
    data: {
      user: {
        connect: {
          id: user.id,
        },
      },
      departureStation: "HKI",
      arrivalStation: "TPE",
      departureDateTime: "2023-07-29",
    },
  });

  console.log(journey);
};

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
