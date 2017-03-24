// ==UserScript==
// @name         DEV Course Scanner
// @namespace    https://github.com/redice44
// @supportURL   https://github.com/redice44/bb-util-scripts/issues
// @version      0.1.1
// @description  Scans a course
// @author       Matt Thomson <red.cataclysm@gmail.com>
// @match        https://fiu.blackboard.com/webapps/blackboard/content/listContentEditable.jsp?*
// @match        https://redice44.github.io/bb-util-scripts/results.html*
// @require      https://raw.githubusercontent.com/redice44/bb-util-scripts/master/src/common/getParameters.js
// @require      https://raw.githubusercontent.com/redice44/bb-util-scripts/master/src/storage/storage.js
// @require      https://raw.githubusercontent.com/redice44/bb-util-scripts/master/src/dom/primary-menu-button.js
// @require      https://raw.githubusercontent.com/redice44/bb-util-scripts/master/src/course-scan/plugins/newWindowPlugin.js
// @require      https://raw.githubusercontent.com/redice44/bb-util-scripts/master/src/course-scan/plugins/oldVivoPlugin.js
// @require      https://raw.githubusercontent.com/redice44/bb-util-scripts/master/src/course-scan/plugins/oldMediaSitesPlugin.js
// @require      https://raw.githubusercontent.com/redice44/bb-util-scripts/master/src/course-scan/plugins/imageTextPlugin.js
// @require      https://raw.githubusercontent.com/redice44/bb-util-scripts/master/src/dom/parsePage.js
// @require      https://raw.githubusercontent.com/redice44/bb-util-scripts/master/src/course-scan/scanner.js
// @require      https://raw.githubusercontent.com/redice44/bb-util-scripts/master/src/scan-results/scan-results.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// ==/UserScript==

var scannerPlugins = [
  linkNewWindowPlugin,
  mediaSitesOldLinkPlugin,
  vivoOldLinkPlugin,
  imageAltText
];

var contentFolderController = '/webapps/blackboard/content/listContentEditable.jsp?';

(function() {
  var url = window.location.href;
  if (url.includes(contentFolderController)) {
    scanner.init(scannerPlugins);
  } else {
    scanResults.init(scannerPlugins);
  }
})();
