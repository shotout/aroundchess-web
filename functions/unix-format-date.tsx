export const unixFormatDate = (unix_timestamp: number, format: string) => {
  const date = new Date(unix_timestamp * 1000);
  const dateObject: { [key: string]: string | number } = {
    Y: date.getFullYear(),
    m: String(date.getMonth()).padStart(2, "0"),
    d: String(date.getDate()).padStart(2, "0"),
    H: String(date.getHours()).padStart(2, "0"),
    i: String(date.getMinutes()).padStart(2, "0"),
    s: String(date.getSeconds()).padStart(2, "0"),
  };
  var dateString = "";
  for (let char of format) {
    if (char in dateObject) {
      dateString += dateObject[char as keyof typeof dateObject];
    } else {
      dateString += char;
    }
  }
  return dateString;
};
