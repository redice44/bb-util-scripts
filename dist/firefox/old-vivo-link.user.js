// ==UserScript==
// @name         Old ViVo Link Detector
// @namespace    https://github.com/redice44
// @source       https://github.com/redice44/bb-util-scripts/dist/chrome/old-vivo-link.user.js
// @updateURL    https://github.com/redice44/bb-util-scripts/dist/chrome/old-vivo-link.user.js
// @supportURL   https://github.com/redice44/bb-util-scripts/issues
// @version      0.1.0
// @description  Detects old vivo links
// @author       Matt Thomson <red.cataclysm@gmail.com>
// @match        https://fiu.blackboard.com/webapps/blackboard/content/listContentEditable.jsp?*
// @grant        none
// ==/UserScript==

(function() {
// Your code here...
var links = document.querySelectorAll('#content_listContainer a');
var items = [];
var linkFlag = 'vivoId=';

for (var l of links) {
  if (l.href.includes(linkFlag)) {
    items.push(l.innerText);
    l.setAttribute('style', 'background-color: #FF0000');
  }
}
if (items.length > 0) {
  alert ('There are ' + items.length + ' old link(s) on this page highlighted in red.');
  // List out items in console
  console.log(items);
}

})();
