// ==UserScript==
// @name         Replace URLs
// @namespace    https://github.com/redice44
// @source       https://github.com/redice44/bb-util-scripts/raw/master/dist/chrome/replace-urls.user.js
// @updateURL    https://github.com/redice44/bb-util-scripts/raw/master/dist/chrome/replace-urls.user.js
// @supportURL   https://github.com/redice44/bb-util-scripts/issues
// @version      0.1.0
// @description  Replaces all matching URLs in TinyMCE HTML content and Web Link URL field (if present) with new URL.
// @author       Daniel Victoriano <victorianowebdesign@gmail.com>
// @match        https://fiu.blackboard.com/*
// @grant        unsafeWindow
// ==/UserScript==

(function() {
    'use strict';

if (unsafeWindow.tinyMCE !== undefined && document.body.className == "ineditmode") {
  setTimeout(function() {

    var oldUrl, newUrl, tinyMCE, tinyMCEId, tinyMCEHtml, webUrl, regex;

    oldUrl = "fiuonline.mediasite.com";
    newUrl = "fiuolmediasite.fiu.edu";

    // Get Editor instance by ID
    // Editor ID varies so get ID first
    tinyMCEId = document.querySelector(".textboxtable textarea").id;
    tinyMCE = unsafeWindow.tinyMCE.getInstanceById(tinyMCEId);

    // Get TinyMCE HTML content
    tinyMCEHtml = tinyMCE.getContent({format: "html"});

    // Get URL field (if present)
    webUrl = document.getElementById("url");

    // Replace URLs
    regex = new RegExp(oldUrl, "g");

    if ( tinyMCEHtml.includes(oldUrl) ) {
      tinyMCEHtml = tinyMCEHtml.replace(regex, newUrl);
    }

    if (webUrl !== null) {
      if (webUrl.value.includes(oldUrl) ) {
        var url = webUrl.value.replace(regex, newUrl);
        webUrl.value = url;
      }
    }

    tinyMCE.setContent(tinyMCEHtml);
  }, 2100);
}
})();
