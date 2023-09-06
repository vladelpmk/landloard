import { run as runVodovod } from "./adapters/vodovod.js";

(async () => {
  const result = await runVodovod();
  console.log(result);
})();
