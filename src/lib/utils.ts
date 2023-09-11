export function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

export function debug(log: string) {
  console.debug(`[DEBUG] ${log}`);
}
