export const formatDate = (date: string) => {
  let d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();
  let dayName = d.toLocaleDateString("EN", { weekday: "long" });
  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return dayName + ", " + [day, month, year].join("/");
};
