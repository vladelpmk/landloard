import  cron  from "node-cron";
import { lunchConnectToBrowser, getOrAddPageByDomain } from "../controler/chrome.js";
import { startAutoRefresh } from "../controler/page.js";
import { debug } from "../lib/utils.js";
import puppeteer from "puppeteer";
import { addOrUpdateRow } from "./spreadsheets.js";

const domain = "https://www.evnonline.mk/";

const getData = async (page: puppeteer.Page) => {
  debug("Get EVN data START");

  const tableArray = await page.$eval("table.table-bordered tbody", (tbody) => {
    const trs = Array.from(tbody.querySelectorAll("tr"));
    return trs.map((tr) => {
      let tds = Array.from(tr.querySelectorAll("td"));
      return tds.map((td) => td.innerText);
    });
  });

  let result = []

  for (let i = 0; i < tableArray.length; i++) {
    result.push({
      amount: parseFloat(tableArray[i][5].replace(".", "").replace(",", ".")),
      month: parseInt(tableArray[i][3].split("-")[1]).toString(),
      year: parseInt(tableArray[i][3].split("-")[2]).toString(),
      paid: tableArray[i][7] === "Платена",
    });
  }

  for (let i = 0; i < result.length; i++) {
    await addOrUpdateRow(result[i], "EVN");
  }

  debug("Get EVN data END");
};


 

var task = cron.schedule(
  "0 0 * * *",
  (page) => {
    debug("Run chon")
    getData(page)
  },
  {
    scheduled: false,
  },
);


export const run = async () => {
  try {
    const browser = await lunchConnectToBrowser();
    const page = await getOrAddPageByDomain(domain, browser);
    startAutoRefresh(page);
    task.start(page);
  } catch (e) {
    console.error(e);
  }
};


  // debug(`open new page`);
  // const page = await browser.newPage();

  // debug(`go to page ${loginUrl}`);
  // await page.goto(loginUrl);

  // await input(page, "UsernameEmail", process.env.EVN_USER);
  // await input(page, "password", process.env.EVN_PASS);
  // debug(`Click login`);
  // await page.click("button.buttonNext");
  // await delay(10000);

  // if ((await page.url()) !== loggedInUrl) {
  //   let bodyHTML = await page.evaluate(() => document.body.innerHTML);
  //   console.log(bodyHTML);
  //   throw new Error(`Login failed ${await page.url()}`);
  // }

  // debug(`go to page ${invoicedUrl}`);
  // await page.goto(invoicedUrl);
  // await delay(1000);

  // browser.disconnect();
  // const result = [];
  // return result;