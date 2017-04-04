export default function setToStorage (key, value) {
  // __storage__.setItem(key, JSON.stringify(value));
  GM_setValue(key, value);
}
