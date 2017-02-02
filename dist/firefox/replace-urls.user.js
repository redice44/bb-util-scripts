// ==UserScript==
// @name         Replace URLs
// @namespace    https://github.com/redice44
// @source       https://github.com/redice44/bb-util-scripts/raw/master/dist/firefox/replace-urls.user.js
// @updateURL    https://github.com/redice44/bb-util-scripts/raw/master/dist/firefox/replace-urls.user.js
// @supportURL   https://github.com/redice44/bb-util-scripts/issues
// @version      0.1.0
// @description  Replaces all matching URLs in TinyMCE HTML content and Web Link URL field (if present) with new URL.
// @author       Daniel Victoriano <victorianowebdesign@gmail.com>
// @author       Matt Thomson <red.cataclysm@gmail.com>
// @match        https://fiu.blackboard.com/webapps/blackboard/execute/manageCourseItem?*
// @match        https://fiu.blackboard.com/webapps/assessment/do/content/assessment?*
// @match        https://fiu.blackboard.com/webapps/assessment/do/authoring/modifyAssessment*
// @match        https://fiu.blackboard.com/webapps/assignment/execute/manageAssignment?*
// @grant        none
// ==/UserScript==

function updateUrl(target, oldUrl, newUrl) {
  return target.replace(new RegExp(oldUrl, 'g'), newUrl);
}

function getEditNodes() {
  var id = {
    'item': 'htmlData_text',                        // Items, weblinks, etc
    'weblink': 'url',                               // Weblinks
    'assignment': 'content_desc_text',              // Assignments
    'assessment': 'descriptiontext',                // Test Options
    'assessmentInstructions': 'instructionstext'    // Editing Test
  };

  var url = window.location.href;

  if (url.includes('/webapps/blackboard/execute/manageCourseItem?')) {
    // Item, weblink, etc.
    return [id.item, id.weblink];
  }

  if (url.includes('/webapps/assessment/do/')) {
    // Assessments: Edit Test or Edit Options
    return [id.assessment, id.assessmentInstructions];
  }

  if (url.includes('/webapps/assignment/execute/manageAssignment?')) {
    return [id.assignment];
  }

  return [];
}

(function() {
  'use strict';

  var oldUrl = "fiuonline.mediasite.com";
  var newUrl = "fiuolmediasite.fiu.edu";

  var nodes = getEditNodes();

  nodes = nodes.map(function(id) {
    return document.getElementById(id);
  });

  nodes.forEach(function(node) {
    if (node) {
      if (node.nodeName.toLowerCase() === 'input') {
        node.value = updateUrl(node.value, oldUrl, newUrl);
      } else if (node.nodeName.toLowerCase() === 'textarea') {
        node.innerHTML = updateUrl(node.innerHTML, oldUrl, newUrl);
      } else {
        console.log('Error: Unhandled node type.', node.nodeName);
      }
    }
  });
})();
