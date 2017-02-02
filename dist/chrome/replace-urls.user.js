// ==UserScript==
// @name         Replace URLs
// @namespace    https://github.com/redice44
// @source       https://github.com/redice44/bb-util-scripts/raw/master/dist/chrome/replace-urls.user.js
// @updateURL    https://github.com/redice44/bb-util-scripts/raw/master/dist/chrome/replace-urls.user.js
// @supportURL   https://github.com/redice44/bb-util-scripts/issues
// @version      0.1.0
// @description  Replaces all matching URLs in TinyMCE HTML content and Web Link URL field (if present) with new URL.
// @author       Daniel Victoriano <victorianowebdesign@gmail.com>
// @author       Matt Thomson <red.cataclysm@gmail.com>
// @match        https://fiu.blackboard.com/webapps/blackboard/execute/manageCourseItem?*
// ==/UserScript==

function updateUrl(target, oldUrl, newUrl) {
  return target.replace(new RegExp(oldUrl, 'g'), newUrl);
}

(function() {
  'use strict';

  var oldUrl = "fiuonline.mediasite.com";
  var newUrl = "fiuolmediasite.fiu.edu";

  var descriptionNode = document.getElementById('htmlData_text');
  var urlNode = document.getElementById('url');

  if (descriptionNode) {
    descriptionNode.innerHTML = updateUrl(descriptionNode.innerHTML, oldUrl, newUrl);
  }

  if (urlNode) {
    urlNode.value = updateUrl(urlNode.value, oldUrl, newUrl);
  }
})();
