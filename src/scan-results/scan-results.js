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
var scanResults = {
  // Global DOM Nodes
  submitBtn: null,
  courseIdNode: null,
  resultsNode: null,
  plugins: [],
  init: function(plugins) {
    this.plugins = plugins;
    this.submitBtn = document.getElementById('see_results');
    this.courseIdNode = document.getElementById('course_id');
    this.resultsNode = document.getElementById('results');

    var url = window.location.href;

    try {
      this.courseIdNode.value = this.parseCourseId(url);
      this.showCourse(this.courseIdNode.value);
    } catch (e) {
      // It's fine to not have an initial query parameter.
      this.courseIdNode.focus();
    }

    this.submitBtn.addEventListener('click', function(e) {
      console.log(this.courseIdNode.value);
      try {
        this.showCourse(this.parseCourseId(this.courseIdNode.value));
      } catch (e) {
        this.showCourse(this.courseIdNode.value);
      }
    });
  },
  showCourse: function (courseId) {
    var courseMap = getFromStorage(courseId);

    if (courseMap) {
      var domNode = document.createElement('div');
      this.resultsNode.innerHTML = '';
      domNode.appendChild(this.showLevel(courseMap));
      this.resultsNode.appendChild(domNode);
    } else {
      this.courseNotFound();
    }
  },
  showLevel: function (parent) {
    var title = parent.title || 'Course';
    var ul = document.createElement('ul');
    var li = document.createElement('li');
    var a = document.createElement('a');
    var numItems = parent.numItems ? parent.numItems : 0;
    var newWindowItems = parent.newWindow || [];
    newWindowItems = newWindowItems.length;
    a.appendChild(document.createTextNode(title + ' (' + numItems + ' items scanned) (Not in new window: ' + newWindowItems + ')'));
    a.setAttribute('target', '_blank');
    if (parent.title) {
      // Not root node
      a.setAttribute('href', parent.url);
    }
    li.appendChild(a);
    ul.appendChild(li);
    if (parent.nodes) {
      parent.nodes.forEach(function(child) {
        ul.appendChild(this.showLevel(child));
      });
    }

    return ul;
  },
  parseCourseId: function (url) {
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
  },
  courseNotFound: function () {
    console.log('Course Not Found');
    this.resultsNode.innerHTML = 'Course Not Found';
  }
};
