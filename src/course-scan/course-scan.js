// ==UserScript==
// @name         Course Scanner
// @namespace    https://github.com/redice44
// @supportURL   https://github.com/redice44/bb-util-scripts/issues
// @version      0.1.0
// @description  Detects old vivo links
// @author       Matt Thomson <red.cataclysm@gmail.com>
// @match        https://fiu.blackboard.com/webapps/blackboard/content/listContentEditable.jsp?*
// @match        https://redice44.github.io/bb-util-scripts/results.html*
// @require      https://raw.githubusercontent.com/redice44/bb-util-scripts/master/src/common/getParameters.js
// @require      https://raw.githubusercontent.com/redice44/bb-util-scripts/master/src/storage/storage.js
// @require      https://raw.githubusercontent.com/redice44/bb-util-scripts/master/src/dom/primary-menu-button.js
// @require      https://raw.githubusercontent.com/redice44/bb-util-scripts/master/src/dom/parsePage.js
// @require      https://raw.githubusercontent.com/redice44/bb-util-scripts/master/src/course-scan/directory-plugin.js
// @require      https://raw.githubusercontent.com/redice44/bb-util-scripts/master/src/course-scan/item-count-plugin.js
// @require      https://raw.githubusercontent.com/redice44/bb-util-scripts/master/src/course-scan/log-item-plugin.js
// @require      https://raw.githubusercontent.com/redice44/bb-util-scripts/master/src/scan-results/scan-results.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// ==/UserScript==

var contentFolderController = '/webapps/blackboard/content/listContentEditable.jsp?';

var courseId;
var contentId;
var scannerPlugins = [
  directoryPlugin,
  itemCountPlugin,
  logItemPlugin
];

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
  var params =getParameters(link.href);

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
    var content = parsePage(scannerPlugins);
    console.log(content);
    step.nodes = content.dir;
    step.numItems = content.numItems;
    if (step.nodes && step.nodes.length > 0) {
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
      // continue walk
      nextStep(courseMap);
    } else {
      console.log('Course already scanned.');
      viewResults();
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

function viewResults() {
  window.open('https://redice44.github.io/bb-util-scripts/results.html?course_id=' + course_id);
}

function resetScan() {
  console.log('Resetting Scan', courseId);
  console.log(getFromStorage(courseId));
  console.log(GM_listValues());
  delFromStorage(courseId);
}

function addButtons() {
  var items = [
    {
      linkName: 'Scan Course',
      action: init
    },
    {
      linkName: 'View Results',
      action: viewResults
    },
    {
      linkName: 'Reset Scan',
      action: resetScan
    }
  ];

  makePrimarySubMenuButton('Scanner', items);
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
  var url = window.location.href;
  if (url.includes(contentFolderController)) {
    courseId = document.getElementById('course_id').value;
    contentId = document.getElementById('content_id').value;
    if (window.location.href.includes('&scanning=true')) {
      init();
    } else {
      addButtons();
    }
  } else {
    initResults();
  }
})();
