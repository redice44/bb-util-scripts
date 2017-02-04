// ==UserScript==
// @name         Replace URLs 2.0
// @namespace    http://tampermonkey.net/
//@updateURL     https://github.com/efranco5788/Replace_Old_URLs_2.0/blob/master/replaceURLs.user.js
// @version      0.1.0
// @description  Replaces all matching URLs in TinyMCE HTML content and Web Link URL field (if present) with new URL.
// @author       Emmanuel Franco
// @match        https://fiu.blackboard.com/webapps/blackboard/content/listContentEditable.jsp?*
// @match        https://fiu.blackboard.com/webapps/blackboard/execute/manageCourseItem?*
// @match        https://fiu.blackboard.com/webapps/assessment/do/content/assessment?*
// @match        https://fiu.blackboard.com/webapps/assessment/do/authoring/modifyAssessment*
// @match        https://fiu.blackboard.com/webapps/assignment/execute/manageAssignment?*
// @grant        none
// ==/UserScript==

function updateUrl(target, oldUrl, newUrl) {
  return target.replace(new RegExp(oldUrl, 'g'), newUrl);
}

function saveURLInfo(){
  console.log('here');
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

  // Grab the title div
  var header = document.getElementById("pageTitleDiv");
  var oldURLDefaultValue = "Old URL";
  var newURLDefaultValue = "New URL";
  header.insertAdjacentHTML('beforeend', '<input id="oldUrlValue" type="text" name="oldURL" value=oldURLDefaultValue>');
  header.insertAdjacentHTML('beforeend', '<input id="newUrlValue" type="text" name="newURL" value=oldURLDefaultValue>');
  header.insertAdjacentHTML('beforeend', '<button id="save_settings" class="button-1" onClick="saveURLInfo()" style="width: 120px; height: 30px; font-size: 14px; right 10px; padding: 0px; margin-right: 15px;">Save</button>');

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
