import { intlFormatDistance } from "date-fns";

export function intlFormatDistanceNow(date: Date) {
  const formattedDate = intlFormatDistance(date, new Date(), {
    locale: "es-ES",
  });
  return formattedDate;
}
