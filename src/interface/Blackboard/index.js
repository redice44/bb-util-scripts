import request from 'superagent';

import LMSInterface from 'LMSInterface';
import Page from 'Course/Page';
import Item from 'Course/Item';
import getParameters from 'Utility/getParameters';

function BlackboardInterface(domain) {
  LMSInterface.call(this, domain);
  this.ids = {
    courseMenu: 'courseMenuPalette_contents',
    contentItems: 'content_listContainer'
  };

  this.q = {
    courseMenuLink: 'li.clearfix > a',    // Course Menu Link
    contentItems: 'li.liItem',            // Content Items
    itemLink: 'div.item > h3 > a'         // Content Item Link
  };

  this.endpoints = {
    courseLauncher: '/webapps/blackboard/execute/launcher?',
    contentFolder: '/webapps/blackboard/content/listContentEditable.jsp?'
  };
}

// Inherit LMSInterface
BlackboardInterface.prototype = Object.create(LMSInterface.prototype);
BlackboardInterface.prototype.constructor = BlackboardInterface;

/**
  @param {String} courseId - The ID of the course.
  @return {Promise.<Page[]>} - Array of Pages that are at the top level of the course.
*/
BlackboardInterface.prototype.getMainPage = function (id) {
  var that = this;
  return new Promise(function (resolve, reject) {
    request
      .get(`${that.domain}${that.endpoints.courseLauncher}type=Course&id=${id}&url=`)
      .end(function (err, res) {
        if (err) {
          reject(err);
        } else {
          var parser = new DOMParser();
          var doc = parser.parseFromString(res.text, "text/html");
          var links = that.getChildren(that.getId(doc, that.ids.courseMenu), that.q.courseMenuLink)
            .filter(function (link) {
              return that.getUrl(link).includes(that.endpoints.contentFolder);
            });
          var pages = links.map(function (link) {
            var p = getParameters(that.getUrl(link));
            return new Page(id, p.content_id);
          });

          resolve(pages);
        }
      });
  });
};

/**
  @param {Page} page - Page to get content for.
  @return {Promise.<Item[]>} - Array of Items found on the page.
*/
BlackboardInterface.prototype.getPage = function (page) {
  var that = this;
  return new Promise(function (resolve, reject) {
    request
      .get(`${that.domain}${that.endpoints.contentFolder}content_id=${page.id}&course_id=${page.courseId}`)
      .end(function (err, res) {
        if (err) {
          reject(err);
        } else {
          var parser = new DOMParser();
          var doc = parser.parseFromString(res.text, "text/html");
          var items = that.getChildren(that.getId(doc, that.ids.contentItems), that.q.contentItems);
          if (items) {
            items.forEach(function (item) {
              var contentId = that.getContentId(item);
              if (that.isPage(item)) {
                page.addItem(new Page(page.courseId, contentId, item));
              } else {
                page.addItem(new Item(page.courseId, contentId, item));
              }
            });
          }

          resolve(page);
        }
      });
  });
};

/**
  @param {Item} item - Item in which to find the content ID for.
  @return {String} - Item's content ID.
*/
BlackboardInterface.prototype.getContentId = function (item) {
  return this.getChild(item, 'div.item').getAttribute('id');
};

/**
  @param {Item} item - Item to determine if it is a Page
  @return {boolean}
*/
BlackboardInterface.prototype.isPage = function (item) {
  var href = this.getUrl(this.getChild(item, this.q.itemLink));

  if (href) {
    return href.includes(this.endpoints.contentFolder);
  }
  return false;
};



export default BlackboardInterface;
