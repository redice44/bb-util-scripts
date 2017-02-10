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
    console.log('results');
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
      console.log('rendering results', courseMap);
      var domNode = document.createElement('div');
      var header = document.createElement('header');
      header.appendChild(document.createTextNode(courseMap.title));
      domNode.appendChild(header);
      domNode.id = courseMap.courseId;
      domNode.classList.add('course');
      this.resultsNode.innerHTML = '';
      courseMap.nodes.forEach(function(items) {
        domNode.appendChild(this.showLevel(items));
      }, this);
      this.resultsNode.appendChild(domNode);
    } else {
      this.courseNotFound();
    }
  },
  toggleDisplay: function(e) {
    var target = e.target;
    // console.log('clicked', e);
    target.classList.toggle('collapse');
  },
  __buildItem__: function(item) {
    var itemDom = document.createElement('article');
    var title = document.createElement('header');
    title.appendChild(document.createTextNode(item.title));
    itemDom.appendChild(title);
    // plugin doms
    this.plugins.forEach(function(plugin) {
      var pluginDom = plugin.getDom(item);
      // if (plugin.hasIssue(pluginDom)) {
      //   pluginDom.appendChild(this.addSlice(plugin.getLegendColor()));
      // }
      if (plugin.hasIssue(pluginDom)) {
        plugin.addIssue(title);
      }
      itemDom.appendChild(pluginDom);
    }, this);
    return itemDom;
  },
  showLevel: function (item) {
    var itemDom = document.createElement('section');
    var title = document.createElement('header');
    var childrenList = document.createElement('article');


    title.appendChild(document.createTextNode(item.title));
    title.addEventListener('click', this.toggleDisplay);
    title.classList.add('collapse');
    itemDom.appendChild(title);


    if (item.items) {
      item.items.forEach(function (i) {
        if (i.url) {
          // Is a folder
          var folder;
          // Get correct folder node
          item.nodes.forEach(function (node) {
            if (node.url === i.url) {
              folder = node;
            }
          }, this);
          itemDom.appendChild(this.showLevel(folder));
        } else {
          var iDom = this.__buildItem__(i);
          this.plugins.forEach(function (plugin) {
            if (plugin.hasIssue(iDom.querySelector('header'))) {
              plugin.addIssue(title);
            }
          }, this);
          itemDom.appendChild(iDom);
        }
      }, this);

      // itemDom.appendChild(childrenList);
    }

    itemDom.classList.add('folder');
    return itemDom;
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
