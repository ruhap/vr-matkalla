import { db } from "../src/db";

const main = async () => {
  await db.user.deleteMany({});
  await db.journey.deleteMany({});

  const user = await db.user.create({
    data: {
      email: "test@test.fi",
    },
  });

  const user2 = await db.user.create({
    data: {
      email: "test2@test2.fi",
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

  const journey2 = await db.journey.create({
    data: {
      user: {
        connect: {
          id: user2.id,
        },
      },
      departureStation: "TPE",
      arrivalStation: "HKI",
      departureDateTime: "2023-08-22",
    },
  });

  console.log({ journey, journey2 });
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
