import { db } from "../src/db";

const main = async () => {
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
      arrivalStation: "HNV",
      departureDateTime: "2023-06-30",
      departureStation: "EPO",
    },
  });

  const journey3 = await db.journey.create({
    data: {
      user: {
        connect: {
          id: user2.id,
        },
      },
      arrivalStation: "HNK",
      departureDateTime: "2023-06-30",
      departureStation: "HNV",
    },
  });

  console.log({ journey, journey2, journey3 });
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
