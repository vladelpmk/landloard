export function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

function getFullTimestamp() {
  const pad = (n, s = 2) => `${new Array(s).fill(0)}${n}`.slice(-s);
  const d = new Date();

  return `${pad(d.getFullYear(), 4)}-${pad(d.getMonth() + 1)}-${pad(
    d.getDate(),
  )} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}.${pad(
    d.getMilliseconds(),
    3,
  )}`;
}

export function debug(log: string) {
  console.debug(`[${getFullTimestamp()}][DEBUG] ${log}`);
}
