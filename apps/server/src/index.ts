import { createApp } from "./app";

const main = async () => {
  const app = createApp();

  app.listen(3000, () => {
    console.info(`Server ready on port 3000`);
  });
};

main().catch((err) => {
  console.log(err.stack);
  process.exit(-1);
});
