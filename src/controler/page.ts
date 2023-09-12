import { debug } from "../lib/utils.js";

let interval;

export const startAutoRefresh = (page, seconds = 10 * 60) => {
  debug(`starting auto refresh ${seconds} seconds`);
  interval = setInterval(async () => {
    debug(`Refresh`);
    page.reload();
  }, seconds * 1000);
};

export const stopAutoRefresh = () => {
  clearInterval(interval);
};
