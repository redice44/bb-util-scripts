// ==UserScript==
// @name         Course Scanner
// @namespace    https://github.com/redice44
// @supportURL   https://github.com/redice44/bb-util-scripts/issues
// @version      0.1.0
// @description  Detects old vivo links
// @author       Matt Thomson <red.cataclysm@gmail.com>
// @match        https://fiu.blackboard.com/webapps/blackboard/content/listContentEditable.jsp?*
// ==/UserScript==

function getRoot() {
  var contentFolderController = '/webapps/blackboard/content/listContentEditable.jsp?';
  var _root = [];
  var menuItems = document.getElementById('courseMenuPalette_contents');
  menuItems = menuItems.querySelectorAll('li.clearfix > a');
  menuItems.forEach(function(link) {
    if (link.href.includes(contentFolderController)) {
      _root.push(_makeLink(link));
    }
  });

  return _root;
}

function _makeLink(link) {
  var contentId = 'Error: Content ID not parsed';
  var courseId = 'Error: Course ID not parsed';
  var params = {};
  var parseParams = link.href.split('?')[1];
  parseParams = parseParams.split('&');
  parseParams = parseParams.forEach(function(pair) {
    var temp = {};
    var splitPair = pair.split('=');
    temp[splitPair[0]] = splitPair[1];
    params = Object.assign({}, temp, params);
  });

  if (params.hasOwnProperty('content_id')) {
    contentId = params.content_id;
  }
  if (params.hasOwnProperty('course_id')) {
    courseId = params.course_id;
  }

  return {
    url: link.href,
    title: link.innerText,
    contentId: contentId,
    courseId: courseId
  };
}

(function() {
  var _root = getRoot();

  _root.forEach(function(link) {
    console.log(link.title);
  });


})();
