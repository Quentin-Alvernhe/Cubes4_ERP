export const useFormatDate = (date: string): string => {
  const [day, hours] = date.split("T");
  const hoursWithoutSeconds = hours.split(":").slice(0, 2);
  hoursWithoutSeconds[0] = `${Number(hoursWithoutSeconds[0]) + 1}`;
  const orderedDay = day.split("-").reverse().join("/");
  return `${orderedDay.replaceAll("-", "/")} ${hoursWithoutSeconds.join("h")}`;
};
