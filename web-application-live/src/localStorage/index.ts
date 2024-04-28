export function setInLocalStorage(key: string, value: any) {
  const stringToSave =
    typeof value === "object" ? JSON.stringify(value) : value + "";

  return localStorage.setItem(key, stringToSave);
}

export function getFromLocalStorage(key: string): any {
  return localStorage.getItem(key);
}

export function clearFromLocalStorage() {
  return localStorage.clear();
}
