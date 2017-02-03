// ==UserScript==
// @name         Course Scanner
// @namespace    https://github.com/redice44
// @supportURL   https://github.com/redice44/bb-util-scripts/issues
// @version      0.1.0
// @description  Detects old vivo links
// @author       Matt Thomson <red.cataclysm@gmail.com>
// @match        https://fiu.blackboard.com/webapps/blackboard/content/listContentEditable.jsp?*
// @resource     test https://github.com/redice44/bb-util-scripts/raw/master/src/resource/test.js
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

function finishScan() {
  var courseMap = getFromStorage(courseId);
  var elapsedSec = Math.floor((Date.now() - courseMap.startTime) / 1000);
  courseMap.elapsedTime = elapsedSec;
  setToStorage(courseId, courseMap);
  // showCourse();
  // Return to initial page and stop scanning
  window.location = courseMap.nodes[0].url;
}

function showCourse() {
  var courseMap = getFromStorage(courseId);
  if (courseMap) {
    var elapsedSec = courseMap.elapsedTime;
    var elapsedMin = Math.floor(elapsedSec / 60);
    elapsedSec = elapsedSec % 60;
    console.log('Total items scanned: ' + showLevel(courseMap, 0));
    console.log('Time Elapsed: ' + elapsedMin + 'm ' + elapsedSec + 's');
  } else {
    console.log('No course scan');
  }
}

function showLevel(parent, level) {
  var title = parent.title || 'Course';
  var spacing = ' '.repeat(level * 2);
  var total = parent.numItems;
  console.log(spacing + level + ': ' + title + ' (' + parent.numItems + ' items scanned)');
  if (parent.nodes) {
    parent.nodes.forEach(function(child, i) {
      total += showLevel(child, level + 1);
    });
  }

  return total;
}

function parseContent() {
  var contentItems = document.getElementById('content_listContainer');
  var folders = [];

  // Incase of an empty folder
  if (contentItems) {
    // So we only iterate over direct children
    contentItems = document.querySelectorAll('#content_listContainer > li');
  } else {
    contentItems = [];
  }

  contentItems.forEach(function(item) {
    var link = item.querySelector('div.item > h3 > a');
    if (link && link.href.includes(contentFolderController)) {
      folders.push(_makeLink(link));
    }
  });

  return {
    numItems: contentItems.length,
    folders: folders
  };
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
  window.location = step.url + '&scanning=true';
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

  if (step.nodes) {
    updatePath(courseMap);
  } else {
    // This page has not been scanned yet.
    var content = parseContent();
    step.nodes = content.folders;
    step.numItems = content.numItems;
    if (step.nodes.length > 0) {
      // has children
      courseMap.path.push(0); // add another layer of depth;
      courseMap.max.push(step.nodes.length - 1);
      console.log('new scan with children. go down a level');
    } else {
      updatePath(courseMap);
    }
  }

  if (courseMap.path.length > 0) {
    updateNode(step);
    takeStep(courseMap, step);
  } else {
    console.log('Course Completed');
    updateNode(step);
    setToStorage(courseId, courseMap);
    finishScan();
  }
}

function init() {
  var courseMap = getFromStorage(courseId);
  if (courseMap) {
    if (courseMap.path.length > 0) {
      // continue 'walk'
      nextStep(courseMap);
    } else {
      console.log('Course already scanned.');
      showCourse();
    }
  } else {
    // Build course entry
    console.log('Building new course entry.');
    var nodes = getRoot();
    courseMap = Object.assign({}, {
      path: [0],
      max: [nodes.length - 1],
      nodes: nodes,
      startTime: Date.now(),
      numItems: 0
    });
    setToStorage(courseId, courseMap);
    // initiate walk
    window.location = courseMap.nodes[0].url + '&scanning=true';
  }
}

function getFromStorage(key) {
  return JSON.parse(__storage__.getItem(key));
}

function setToStorage(key, value) {
  __storage__.setItem(key, JSON.stringify(value));
}

function delFromStorage(key) {
  __storage__.removeItem(key);  
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

function addResetButton() {
  const PRIMARY_BAR_ID = 'nav';
  const primaryActionBar = document.getElementById(PRIMARY_BAR_ID);
  let btn = document.createElement('li');
  let title = document.createElement('h2');
  let link = document.createElement('a');
  let text = document.createTextNode('Reset Scan Results');
  // Blackboard class
  btn.classList.add('mainButton');
  link.setAttribute('href', '#');

  link.appendChild(text);
  title.appendChild(link);
  btn.appendChild(title);

  btn.addEventListener('click', function(e) {
    console.log('Removed Course Scan');
    delFromStorage(courseId);
  });

  primaryActionBar.appendChild(btn);
}

function addResultsButton() {
  const PRIMARY_BAR_ID = 'nav';
  const primaryActionBar = document.getElementById(PRIMARY_BAR_ID);
  let btn = document.createElement('li');
  let title = document.createElement('h2');
  let link = document.createElement('a');
  let text = document.createTextNode('View Results');
  // Blackboard class
  btn.classList.add('mainButton');
  link.setAttribute('href', '#');

  link.appendChild(text);
  title.appendChild(link);
  btn.appendChild(title);

  btn.addEventListener('click', function(e) {
    var details = window.open('');
    if (details) {
      var html = details.document.body;
      var parser = new DOMParser();
      html.appendChild(parser.parseFromString(GM_getResourceText('test'), 'text/html'));
    }
    // showCourse();
  });

  primaryActionBar.appendChild(btn);
}

function addScanButton() {
  const PRIMARY_BAR_ID = 'nav';
  const primaryActionBar = document.getElementById(PRIMARY_BAR_ID);
  let btn = document.createElement('li');
  let title = document.createElement('h2');
  let link = document.createElement('a');
  let text = document.createTextNode('Scan Course');
  // Blackboard class
  btn.classList.add('mainButton');
  link.setAttribute('href', '#');

  link.appendChild(text);
  title.appendChild(link);
  btn.appendChild(title);

  btn.addEventListener('click', init);

  primaryActionBar.appendChild(btn);
}

function addButtons() {
  addScanButton();
  addResultsButton();
  addResetButton();
}

(function() {
  courseId = document.getElementById('course_id').value;
  contentId = document.getElementById('content_id').value;

  if (storageAvailable()) {
    if (window.location.href.includes('&scanning=true')) {
      init();
    } else {
      addButtons();
    }
  } else {
    alert('Please update your browser to Chrome 4 or Firefox 3.5 to use the Course Scanner Script.');
  }
})();
