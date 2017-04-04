export default function delFromStorage (key) {
  GM_deleteValue(key);
  // __storage__.removeItem(key);  
}
