import { run as runVodovod } from "./adapters/vodovod.js";

import "./adapters/spreadsheets.js";
import { addOrUpdateRow } from "./adapters/spreadsheets.js";

(async () => {
  const result = await runVodovod();
  result.map((invoice) => {
    addOrUpdateRow(invoice, "Vodovod");
  });
})();
