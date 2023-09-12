export function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

export function debug(log: string) {
  const now = new Date();
  console.debug(`[${now.toString()}][DEBUG] ${log}`);
}
