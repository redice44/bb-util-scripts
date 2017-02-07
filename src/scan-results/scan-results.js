// ==UserScript==
// @name         Course Scanner Results
// @namespace    https://github.com/redice44
// @supportURL   https://github.com/redice44/bb-util-scripts/issues
// @version      0.1.0
// @description  Detects old vivo links
// @author       Matt Thomson <red.cataclysm@gmail.com>
// @match        file:///*/results.html*
// @match        https://redice44.github.io/bb-util-scripts/results.html*
// @require      https://raw.githubusercontent.com/redice44/bb-util-scripts/master/src/storage/storage.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// ==/UserScript==

// Global DOM Nodes
var submitBtn = document.getElementById('see_results');
var courseIdNode = document.getElementById('course_id');
var resultsNode = document.getElementById('results');

function showCourse(courseId) {
  console.log(GM_listValues());
  var courseMap = getFromStorage(courseId);
  console.log(courseMap);
  if (courseMap) {
    resultsNode.innerHTML = '';
    var domNode = document.createElement('div');
    domNode.appendChild(showLevel(courseMap));
    resultsNode.appendChild(domNode);
  } else {
    courseNotFound();
  }
}

function showLevel(parent) {
  var title = parent.title || 'Course';
  var ul = document.createElement('ul');
  var li = document.createElement('li');
  var a = document.createElement('a');
  a.appendChild(document.createTextNode(title + ' (' + parent.numItems + ' items scanned)'));
  a.setAttribute('target', '_blank');
  if (parent.title) {
    // Not root node
    a.setAttribute('href', parent.url);
  }
  li.appendChild(a);
  ul.appendChild(li);
  if (parent.nodes) {
    parent.nodes.forEach(function(child) {
      ul.appendChild(showLevel(child));
    });
  }

  return ul;
}

function parseCourseId(url) {
  if (url.includes('course_id=')) {
    var params = url.split('?')[1];
    params = params.split('&');
    params = params.reduce(function(acc, val) {
      if (val.includes('course_id')) {
        return val.split('=')[1];
      }
      return acc;
    }, '');

    return params;
  }
  throw new Error('Does not contain a course_id');
}

function courseNotFound() {
  console.log('Course Not Found');
  resultsNode.innerHTML = 'Course Not Found';
}

var initResults = function() {
  var url = window.location.href;

  try {
    courseIdNode.value = parseCourseId(url);
    showCourse(courseIdNode.value);
  } catch (e) {
    // It's fine to not have an initial query parameter.
    courseIdNode.focus();
  }

  submitBtn.addEventListener('click', function(e) {
    console.log(courseIdNode.value);
    try {
      showCourse(parseCourseId(courseIdNode.value));
    } catch (e) {
      showCourse(courseIdNode.value);
    }
  });
};
