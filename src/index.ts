import { run as runVodovod } from "./adapters/vodovod.js";
import { run as runEvn } from "./adapters/evn.js";

import "./adapters/spreadsheets.js";
import { addOrUpdateRow } from "./adapters/spreadsheets.js";
import puppeteer from "puppeteer";
import { debug } from "./lib/utils.js";
import {
  lunch,
  getOrAddPageByDomain,
  lunchConnectToBrowser,
} from "./controler/chrome.js";
import { startAutoRefresh } from "./controler/page.js";

// (async () => {
//   const result = await runVodovod();
//   result.map((invoice) => {
//     addOrUpdateRow(invoice, "Vodovod");
//   });
// })();

//
const browser = await lunchConnectToBrowser();
const page = await getOrAddPageByDomain("https://www.evnonline.mk/", browser);

startAutoRefresh(page);
