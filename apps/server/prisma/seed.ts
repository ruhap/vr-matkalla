import { db } from "../src/db";
import { randomUUID } from "node:crypto";

const main = async () => {
  console.log("seed started");

  const user = await db.user.create({
    data: {
      email: "test@test.fi",
    },
  });

  console.log(user);
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
