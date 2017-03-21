// ==UserScript==
// @name         Old Mediasites Link Detector
// @namespace    https://github.com/redice44
// @supportURL   https://github.com/redice44/bb-util-scripts/issues
// @version      0.1.0
// @description  Detects old Mediasites links
// @author       Matt Thomson <red.cataclysm@gmail.com>
// @match        https://fiu.blackboard.com/webapps/blackboard/content/listContentEditable.jsp?*
// ==/UserScript==

(function() {
  var links = document.querySelectorAll('#content_listContainer a');
  var items = [];
  var linkFlag = 'fiuonline.mediasite.com';

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
