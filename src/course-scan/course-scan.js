// ==UserScript==
// @name         Course Scanner
// @namespace    https://github.com/redice44
// @supportURL   https://github.com/redice44/bb-util-scripts/issues
// @version      0.1.0
// @description  Detects old vivo links
// @author       Matt Thomson <red.cataclysm@gmail.com>
// @match        https://fiu.blackboard.com/webapps/blackboard/content/listContentEditable.jsp?*
// ==/UserScript==

var contentFolderController = '/webapps/blackboard/content/listContentEditable.jsp?';

var __storage__;
var courseId;
var contentId;

/*
  Parses the Course Menu for content folders to parse through. 
*/
function getRoot() {
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

function showCourse() {
  var courseMap = getFromStorage(courseId);
  var elapsedSec = Math.floor((Date.now() - courseMap.startTime) / 1000);
  var elapsedMin = Math.floor(elapsedSec / 60);
  courseMap.elapsedTime = elapsedSec;
  setToStorage(courseMap);
  elapsedSec = elapsedSec % 60;
  showLevel(courseMap, 0);
  console.log('Time Elapsed: ' + elapsedMin + ':' + elapsedSec);
}

function showLevel(parent, level) {
  var title = parent.title || 'Root';
  var spacing = ' '.repeat(level * 2);
  console.log(spacing + level + ': ' + title);
  if (parent.nodes) {
    parent.nodes.forEach(function(child, i) {
      showLevel(child, level + 1);
    });
  }
}

function parseContent() {
  var contentItems = document.getElementById('content_listContainer');
  var folders = [];

  if (contentItems) {
    // Incase of an empty folder
    contentItems = contentItems.querySelectorAll('li');
  } else {
    contentItems = [];
  }

  contentItems.forEach(function(item) {
    var link = item.querySelector('div.item > h3 > a');
    if (link && link.href.includes(contentFolderController)) {
      folders.push(_makeLink(link));
    }
  });

  return folders;
}

function getStep(courseMap) {
  var step = courseMap;

  for (var i = 0; i < courseMap.path.length; i++) {
    step = step.nodes[courseMap.path[i]];
  }

  return step;
}

function updateNode(node) {
  node.scanned = true;
}

function takeStep(courseMap, step) {
  step = getStep(courseMap);
  setToStorage(courseId, courseMap);
  window.location = step.url;
}

function updatePath(courseMap) {
  if (courseMap.path[courseMap.path.length - 1] < courseMap.max[courseMap.path.length - 1]) {
    // continue scanning laterally
    courseMap.path[courseMap.path.length - 1]++;
    console.log('continue scanning laterally');
  } else if (courseMap.path.length > 0) {
    // Completed the depth scan at this level. Go to parent
    courseMap.path.pop();
    courseMap.max.pop();
    console.log('finished scanning page. go up a level');
  }
}

function nextStep(courseMap) {
  // Get current page's node.
  var step = getStep(courseMap);

  if (!step.nodes) 
} else {
    // This page has not been scanned yet.
    step.nodes = parseContent();
    if (step.nodes.length > 0) {
      // has children
      courseMap.path.push(0); // add another layer of depth;
      courseMap.max.push(step.nodes.length - 1);
      console.log('new scan with children. go down a level');
    }
  }

  
/*
  if (step.nodes) {
    // This page has been scanned already.
    if (courseMap.path[courseMap.path.length - 1] < courseMap.max[courseMap.path.length - 1]) {
      // continue scanning laterally
      courseMap.path[courseMap.path.length - 1]++;
      console.log('continue scanning laterally');
    } else if (courseMap.path.length > 0) {
      // Completed the depth scan at this level. Go to parent
      courseMap.path.pop();
      courseMap.max.pop();
      console.log('finished scanning page. go up a level');
    }
  } else {
    // This page has not been scanned yet.
    step.nodes = parseContent(); // currenly only scanning for new folders.
    if (step.nodes.length > 0) {
      // has children
      courseMap.path.push(0); // add another layer of depth;
      courseMap.max.push(step.nodes.length - 1);
      console.log('new scan with children. go down a level');
    } else {
      // leaf
      step.scanned = true;
      console.log('new scan but leaf.');
      if (courseMap.path[courseMap.path.length - 1] < courseMap.max[courseMap.path.length - 1]) {
        // continue scanning laterally
        courseMap.path[courseMap.path.length - 1]++;
        console.log('continue scanning laterally');
      } else {
        courseMap.path.pop();
        courseMap.max.pop();
        console.log('go up a level.');
      }
    }
  }
*/
  if (courseMap.path.length > 0) {
    updateNode(step);
    takeStep(courseMap, step);
  } else {
    console.log('Course Completed');
    updateNode(step);
    setToStorage(courseId, courseMap);
    showCourse();
  }
}

function init() {
  courseId = document.getElementById('course_id').value;
  contentId = document.getElementById('content_id').value;

  var courseMap = getFromStorage(courseId);
  if (courseMap) {
    if (courseMap.path.length > 0) {
      // continue 'walk'
      nextStep(courseMap);
    } else {
      console.log('Course already scanned.');
    }
  } else {
    // Build course entry
    console.log('Building new course entry.');
    var nodes = getRoot();
    courseMap = Object.assign({}, {
      path: [0],
      max: [nodes.length - 1],
      nodes: nodes,
      startTime: Date.now()
    });
    setToStorage(courseId, courseMap);
    // initiate walk
    window.location.href = courseMap.nodes[0].url;
  }
}

function getFromStorage(key) {
  return JSON.parse(__storage__.getItem(key));
}

function setToStorage(key, value) {
  __storage__.setItem(key, JSON.stringify(value));
}

/*
  Availability code from: 
  https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
*/
function storageAvailable() {
  try {
    __storage__ = window.localStorage;
    var x = '__storage_test__';
    __storage__.setItem(x, x);
    __storage__.removeItem(x);
    return true;
  } catch (e) {
    return false;
  }
}

(function() {
  if (storageAvailable()) {
    init();
  } else {
    alert('Please update your browser to Chrome 4 or Firefox 3.5 to use the Course Scanner Script.');
  }
})();
