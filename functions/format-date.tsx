export const formatDate = (date?: string) => {
  let d = date ? new Date(date) : new Date(),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();
  let dayName = d.toLocaleDateString("EN", { weekday: "long" });
  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return dayName + ", " + [day, month, year].join("/");
};
export const formatDatePgn = (date?: string) => {
  let d = date ? new Date(date) : new Date(),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();
  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [day, month, year].join(".");
};
export const formatTimePgn = (date?: string) => {
  let d = date ? new Date(date) : new Date(),
    second = "" + (d.getSeconds()),
    minute = "" + d.getMinutes(),
    hour = d.getHours(); 
  if (minute.length < 2) minute = "0" + minute;
  if (second.length < 2) second = "0" + second;

  return  [hour, minute, second].join(":");
};
export const formatDateHistory = (date: string) => {
  let d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();
  let dayName = d.toLocaleDateString("EN", { weekday: "long" });
  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [day, month, year].join("/");
};
