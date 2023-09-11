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

// (async () => {
//   const result = await runVodovod();
//   result.map((invoice) => {
//     addOrUpdateRow(invoice, "Vodovod");
//   });
// })();

//
const browser = await lunchConnectToBrowser();

setInterval(async () => {
  const page = await getOrAddPageByDomain("https://www.evnonline.mk", browser);
  page.reload();
}, 15 * 60 * 1000);
