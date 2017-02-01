// ==UserScript==
// @name         Old ViVo Notification
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  Alerts on old vivo links
// @author       Matt Thomson <red.cataclysm@gmail.com>
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-core/5.6.15/browser-polyfill.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-core/5.6.15/browser.min.js
// @match        https://fiu.blackboard.com/webapps/blackboard/content/listContentEditable.jsp?*
// ==/UserScript==

/* jshint ignore:start */
var inline_src = (<><![CDATA[
/* jshint ignore:end */
/* jshint esnext: true */

// Your code here...
let links = document.querySelectorAll('#content_listContainer a');
let items = [];
let linkFlag = 'vivoId=';

for (let l of links) {
  if (l.href.includes(linkFlag)) {
    items.push(l.innerText);
    l.setAttribute('style', 'background-color: #FF0000');
  }
}
if (items.length > 0) {
  alert (`There are ${items.length} old link(s) on this page highlighted in red.`);
  // List out items in console
  console.log(items);
}

/* jshint ignore:start */
]]></>).toString();
var c = babel.transform(inline_src);
eval(c.code);
/* jshint ignore:end */