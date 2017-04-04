export default function getFromStorage (key) {
  // return JSON.parse(__storage__.getItem(key));
  // console.log('get: ', key,GM_getValue(key, null));
  // return JSON.parse(GM_getValue(key, null));
  return GM_getValue(key, null);
}
