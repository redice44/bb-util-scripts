function getFromStorage(key) {
  // return JSON.parse(__storage__.getItem(key));
  // console.log('get: ', key,GM_getValue(key, null));
  // return JSON.parse(GM_getValue(key, null));
  return GM_getValue(key, null);
}

function setToStorage(key, value) {
  // __storage__.setItem(key, JSON.stringify(value));
  GM_setValue(key, value);
}

function delFromStorage(key) {
  GM_deleteValue(key);
  // __storage__.removeItem(key);  
}