import translate from "@iamtraction/google-translate";
import "dotenv/config";
import puppeteer from "puppeteer";
import { input, submit } from "../lib/browser.js";

const loginUrl = "https://e.vodovod-skopje.com.mk/Login";
const unpaidUrl = "https://e.vodovod-skopje.com.mk/Invoices/Unpaid";
const loggedInUrl = "https://e.vodovod-skopje.com.mk/Default.aspx";

const userInfo = {
  UserName: process.env.VODOVOD_USER,
  Password: process.env.VODOVOD_PASS,
};

export const run = async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  await page.goto(loginUrl);
  await input(page, "UserName", userInfo.UserName);
  await input(page, "Password", userInfo.Password);
  await submit(page);
  await page.waitForNavigation();
  if ((await page.url()) !== loggedInUrl) {
    console.log(await page.$eval("body", (body) => body));
    throw new Error(`Login failed ${await page.url()}`);
  }
  await page.goto(unpaidUrl);

  const tableArray = await page.$eval(".bills-table tbody", (tbody) => {
    const trs = Array.from(tbody.querySelectorAll("tr"));
    return trs.map((tr) => {
      let tds = Array.from(tr.querySelectorAll("td"));
      if (tds.length === 0) {
        tds = Array.from(tr.querySelectorAll("th"));
      }
      return tds.map((td) => td.innerText);
    });
  });

  const result = [];

  for (let i = 1; i < tableArray.length; i++) {
    result.push({
      pay: tableArray[i][0],
      description: (await translate(tableArray[i][1])).text,
      status: (await translate(tableArray[i][2])).text,
      folioNumber: tableArray[i][3],
      month: tableArray[i][4],
      year: tableArray[i][5],
      amountOfGarbage: parseFloat(tableArray[i][6].replace(",", ".")),
      amountOfWater: parseFloat(tableArray[i][7].replace(",", ".")),
      totalSum: parseFloat(tableArray[i][8].replace(",", ".")),
      partPaid: parseFloat(tableArray[i][9].replace(",", ".")),
      owes: parseFloat(tableArray[i][10].replace(",", ".")),
    });
  }

  await browser.close();

  return result;
};
