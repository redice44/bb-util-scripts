import request from 'superagent';

import DOMInterface from 'dom';
import Page from 'Course/Page';
import Item from 'Course/Item';
import getParameters from 'Utility/getParameters';

function BlackboardInterface(domain) {
  DOMInterface.call(this);
  this.domain = domain;
  this.ids = {
    courseMenu: 'courseMenuPalette_contents',
    contentItems: 'content_listContainer'
  };
  this.endpoints = {
    courseLauncher: '/webapps/blackboard/execute/launcher?',
    contentFolder: '/webapps/blackboard/content/listContentEditable.jsp?'
  };
}

// Inherit DOMInterface
BlackboardInterface.prototype = Object.create(DOMInterface.prototype);
BlackboardInterface.prototype.constructor = BlackboardInterface;

/**
  @param {string} id - Course's Id
  @return {DOM Node} - DOM of the course's main page.
*/
BlackboardInterface.prototype.getCourse = function (id) {
  var that = this;
  request
    .get(`${domain}${this.endpoints.courseLauncher}type=Course&id=${id}&url=`)
    .end(function (err, res) {
      var parser = new DOMParser();
      var doc = parser.parseFromString(res.text, "text/html");
      var items = that.getChildren(that.getId(doc, that.ids.contentItems), 'li.liItem');
      console.log(items);
      // dump dom into 'return'
    });
  // request page
  // parse doc
  // return doc
};

/**  
  @param {string} id - Course Id
  @return {Page[]} List of top level pages.
*/
BlackboardInterface.prototype.getTopLevel = function (id) {
  var doc = this.getCourse(id);
  this.updateDoc(doc);
  var menuItems = this
    .getChildren(this.getId(this.ids.courseMenu), 'li.clearfix > a')
    .filter(function (link) {
      return link.href.includes(this.endpoints.contentFolder);
    });

  menuItems = menuItems.map(function (item) {
    var p = getParameters(item);
    return new Page(p.content_id);
  });

  return menuItems;
};

/**
  @param {Page} page - Page to parse
  @return: {Page} Contains items on page (shallow)
*/
BlackboardInterface.prototype.getPage = function (page) {
  // request page from bb
  // parse out items
  // return page (shallow)
};

/**
  @param {Item} item - Item to determine if it is a Page
  @return {boolean}
*/
BlackboardInterface.prototype.isPage = function (item) {
  // validation
};

export default BlackboardInterface;
