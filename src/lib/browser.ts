import debug from "debug";

export const input = async (page, name: string, value: string) => {
  debug(`input ${name}`);
  await page.waitForSelector(`input[name="${name}"]`);
  await page.type(`input[name="${name}"]`, value);
};

export const submit = async (page) => {
  debug(`click submit`);
  await page.waitForSelector('button[type="submit"]');
  await page.click('button[type="submit"]');
};

export const goToRoute = async (page) => {};
