export function setPersistedCookie(
  name: string,
  value: any,
  daysToExpire: any
) {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + daysToExpire);

  document.cookie = `${name}=${value}; path=/; expires=${expirationDate.toUTCString()};`;
}
