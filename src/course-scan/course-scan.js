// ==UserScript==
// @name         Course Scanner
// @namespace    https://github.com/redice44
// @supportURL   https://github.com/redice44/bb-util-scripts/issues
// @version      0.1.0
// @description  Detects old vivo links
// @author       Matt Thomson <red.cataclysm@gmail.com>
// @match        https://fiu.blackboard.com/webapps/blackboard/content/listContentEditable.jsp?*
// @require      https://raw.githubusercontent.com/redice44/bb-util-scripts/master/src/storage/storage.js
// @require      https://raw.githubusercontent.com/redice44/bb-util-scripts/master/src/dom/primary-menu-button.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// ==/UserScript==

var contentFolderController = '/webapps/blackboard/content/listContentEditable.jsp?';

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
  // Return to initial page and stop scanning
  window.location = courseMap.nodes[0].url;
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
      showCourse(courseId);
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

function addResetButton() {
  makePrimaryMenuButton('Reset Scan Results', function(e) {
    console.log('Removed Course Scan');
    delFromStorage(courseId);
  });
}

function addResultsButton() {
  makePrimaryMenuButton('View Results', function() {
    window.open('https://redice44.github.io/bb-util-scripts/results.html?course_id=' + course_id);
  });
}

function addScanButton() {
  var items = [
    {
      linkName: 'Scan Course',
      action: init
    },
    {
      linkName: 'View Results',
      action: function() {
        window.open('https://redice44.github.io/bb-util-scripts/results.html?course_id=' + course_id);
      }
    },
    {
      linkName: 'Reset Scan',
      action: function(e) {
        delFromStorage(courseId);
      }
    }
  ];
  makePrimarySubMenuButton('Scanner', items);
}

function addButtons() {
  addScanButton();
  // addResultsButton();
  // addResetButton();
}

function parseCourseId(url) {
  if (url.includes('course_id=')) {
    var params = url.split('?')[1];
    params = params.split('&');
    params = params.reduce(function(acc, val) {
      console.log(val);
      if (val.includes('course_id')) {
        console.log('course_id', val);
        return val.split('=')[1];
      }
      return acc;
    }, '');
    return params;
  }
}

(function() {
  courseId = document.getElementById('course_id').value;
  contentId = document.getElementById('content_id').value;
  if (window.location.href.includes('&scanning=true')) {
    init();
  } else {
    addButtons();
  }
})();
