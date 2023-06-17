import { createApp } from "./app";
import { job } from "./job";

const main = async () => {
  const app = createApp();

  app.listen(3000, () => {
    console.info(`Server ready on port 3000`);
    job.start();
  });
};

main().catch((err) => {
  console.log(err.stack);
  process.exit(-1);
});
