import DOMInterface from 'dom';
import Page from 'Course/Page';
import Item from 'Course/Item';
import getParameters from 'Utility/getParameters';

var ids = {
  courseMenu: 'courseMenuPalette_contents'
}

var endpoints = {
  contentFolder: '/webapps/blackboard/content/listContentEditable.jsp?'
}

function BlackboardInterface() {
  DOMInterface.call(this);
}

// Inherit DOMInterface
BlackboardInterface.prototype = Object.create(DOMInterface.prototype);
BlackboardInterface.prototype.constructor = BlackboardInterface;

/**
  @param {string} id - Course's Id
  @return {DOM Node} - DOM of the course's main page.
*/
BlackboardInterface.prototype.getCourse = function (id) {
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
    .getChildren(this.getId(ids.courseMenu), 'li.clearfix > a')
    .filter(function (link) {
      return link.href.includes(endpoints.contentFolder);
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
