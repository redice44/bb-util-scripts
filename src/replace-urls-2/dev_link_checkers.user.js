// ==UserScript==
// @name         DEV Link Checkers
// @namespace    http://tampermonkey.net/
// @updateURL    https://github.com/efranco5788/Replace_Old_URLs_2.0/blob/master/replaceURLs.user.js
// @version      0.1.0
// @description  Replaces all matching URLs in TinyMCE HTML content and Web Link URL field (if present) with new URL.
// @author       Matt Thomson <red.cataclysm@gmail.com>
// @author       Daniel Victoriano <victorianowebdesign@gmail.com>
// @author       Emmanuel Franco <efranco5788@gmail.com>
// @match        https://fiu.blackboard.com/webapps/blackboard/content/listContentEditable.jsp?*
// @match        https://fiu.blackboard.com/webapps/blackboard/execute/manageCourseItem?*
// @match        https://fiu.blackboard.com/webapps/assessment/do/content/assessment?*
// @match        https://fiu.blackboard.com/webapps/assessment/do/authoring/modifyAssessment*
// @match        https://fiu.blackboard.com/webapps/assignment/execute/manageAssignment?*
// @match        http://cpbucket.fiu.edu/*
// @require      https://github.com/redice44/bb-util-scripts/tree/check-new-tab-plugin/src/replace-urls-2/plugins/newTabPlugin.js
// @require      https://github.com/redice44/bb-util-scripts/tree/check-new-tab-plugin/src/replace-urls-2/plugins/nonContextualPlugin.js
// @require      https://github.com/redice44/bb-util-scripts/tree/check-new-tab-plugin/src/replace-urls-2/plugins/nonContextualList.js
// @require      https://github.com/redice44/bb-util-scripts/tree/check-new-tab-plugin/src/replace-urls-2/plugins/brokenLinkPlugin.js
// @require      https://github.com/redice44/bb-util-scripts/tree/check-new-tab-plugin/src/replace-urls-2/plugins/svgGeneratorPlugin.js
// @grant        none
// ==/UserScript==

function setToOpenNewTab(node){
    var newTabProperty = 'target="_blank"';
    var replaceString = '<a target="_blank"';
    var links = [];
    if(node.length > 0){
        links = node.match(/<a(.*?)a>/ig);
        if(links.length > -1){
            for(var i = 0; i < links.length; i++){
                if(links[i].includes(newTabProperty) === false){
                    var updatedLink = links[i].replace(new RegExp('<a', 'g'), replaceString);
                    node = node.replace(links[i], updatedLink);
                    console.log('Append target to link: ', updatedLink);
                }
            }
        }
    }
    return node;
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

  if (url.includes('cpbucket.fiu.edu')) {
    return [id.item];
  }
  return [];
}

(function() {
  'use strict';
  var currentPage = window.location.href; // Current page that was loaded
  if(currentPage.includes("/webapps/blackboard/execute/manageCourseItem")){
      var nodes = getEditNodes();
      console.log(nodes);
      nodes = nodes.map(function(id) {
        return document.getElementById(id);
      });
      console.log(nodes);
      /*
      nodes.forEach(function(node) {
        if (node) {
            setTimeout(function(){
                var a = tinyMCE.getInstanceById("htmlData_text");
                if(!checkLinks(node.value)){
                    window.alert("All links cleared");
                }
                //var txtEditorRow2 = document.getElementById("htmlData_text_toolbar3");
            }, 3000);
            //setToOpenNewTab(node.value);
        }

      });
      */
  }
  else if(currentPage.includes("http://cpbucket.fiu.edu")){
      var nodeValues = getEditNodes();
      var cpLinks = document.links;
      for(var count = 0; count < cpLinks.length; count++){
          if(cpLinks[count] != 'undefined'){
              brokenLinkPlugin.fetchStatus(cpLinks[count], "#cd0000");
              newTabPlugin.checkLinks(cpLinks[count], "#fef65b");
              nonContextualPlugin.checkLinks(cpLinks[count], nonContextualList.getList(), "#4286f4");
          }
      }
  }
  else { // Non-edit item mode
      var divList = document.getElementsByClassName("vtbegenerated");
      for(var i = 0; i < divList.length; i++){
          var links = divList[i].getElementsByTagName("a");
          if(links){
              for(var l = 0; l < links.length; l++){
                  var link = links[l];
                  if(links[l]){
                      brokenLinkPlugin.fetchStatus(links[i], "#cd0000");
                      newTabPlugin.checkLinks(links[l], "#fef65b");
                      nonContextualPlugin.checkLinks(links[l], nonContextualList.getList(), "#4286f4");
                  }
              }
          }

      }
  }
})();
