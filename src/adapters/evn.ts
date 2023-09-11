import puppeteer from "puppeteer";
import { Invoice } from "./types.js";
import { input } from "../lib/browser.js";
import { delay, debug } from "../lib/utils.js";

//puppeteer.use(StealthPlugin());

const loginUrl = "https://www.evnonline.mk/auth/login";
const loggedInUrl = "https://www.evnonline.mk/authorized/home";
const invoicedUrl = "https://www.evnonline.mk/authorized/downloadInvoices";

export const run = async (browser): Promise<Invoice[]> => {
  debug(`open new page`);
  const page = await browser.newPage();

  debug(`go to page ${loginUrl}`);
  await page.goto(loginUrl);

  await input(page, "UsernameEmail", process.env.EVN_USER);
  await input(page, "password", process.env.EVN_PASS);
  debug(`Click login`);
  await page.click("button.buttonNext");
  await delay(10000);

  if ((await page.url()) !== loggedInUrl) {
    let bodyHTML = await page.evaluate(() => document.body.innerHTML);
    console.log(bodyHTML);
    throw new Error(`Login failed ${await page.url()}`);
  }

  debug(`go to page ${invoicedUrl}`);
  await page.goto(invoicedUrl);
  await delay(1000);

  browser.disconnect();
  const result = [];
  return result;
};
