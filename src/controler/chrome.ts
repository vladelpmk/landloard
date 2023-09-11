import * as ChromeLauncher from "chrome-launcher";
import fetch from "node-fetch";
import { debug } from "../lib/utils.js";
import puppeteer from "puppeteer";

export const lunch = async () => {
  debug(`launch browser`);
  const chrome = await ChromeLauncher.launch({
    port: 9222,
    chromeFlags: [
      "--remote-debugging-port=9222",
      "--remote-debugging-address=127.0.0.1",
      "--no-first-run",
      "--no-default-browser-check",
    ],
  });

  const application: { webSocketDebuggerUrl: string } = (await (
    await fetch(`http://127.0.0.1:${chrome.port}/json/version`)
  ).json()) as { webSocketDebuggerUrl: string };

  return application.webSocketDebuggerUrl;
};

export const lunchConnectToBrowser = async () => {
  const webSocketDebuggerUrl = await lunch();

  debug(`connect to browser`);
  return await puppeteer.connect({
    browserWSEndpoint: webSocketDebuggerUrl,
  });
};

export const getOrAddPageByDomain = async (domain: string, browser) => {
  debug(`get or add page by domain ="${domain}"`);
  const pages = await browser.pages();

  for (let i in pages) {
    const url = await pages[i].url();
    if (url.includes(domain)) {
      return pages[i];
    }
  }

  debug(`not found open new page`);
  const page = await browser.newPage();
  await page.goto(domain);
  return page;
};
