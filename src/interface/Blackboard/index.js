import request from 'superagent';

import LMSInterface from 'LMSInterface';
import Page from 'Course/Page';
import Item from 'Course/Item';

function BlackboardInterface(domain) {
  LMSInterface.call(this, domain);
  this.ids = {
    courseMenu: 'courseMenuPalette_contents',
    contentItems: 'content_listContainer',
    menuButtons: 'nav'
  };

  this.q = {
    courseMenuLink: 'li.clearfix > a',    // Course Menu Link
    contentItems: 'li.liItem',            // Content Items
    itemLink: 'div.item > h3 > a',        // Content Item Link
    contentItemTitle: 'div.item > h3',    // Content Item Title
    contentItemId: 'div.item',            // Content Item Id
    nonceAjax: 'input[name="blackboard.platform.security.NonceUtil.nonce.ajax"]',
    nonce: 'input[name="blackboard.platform.security.NonceUtil.nonce"]'
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
          var links = that.getChildren(that.q.courseMenuLink, that.getId(that.ids.courseMenu, doc))
            .filter(function (link) {
              return that.getUrl(link).includes(that.endpoints.contentFolder);
            });
          var pages = links.map(function (link) {
            var p = that.getParameters(that.getUrl(link));
            return new Page(id, p.content_id, link.innerText);
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
          var items = that.getChildren(that.q.contentItems, that.getId(that.ids.contentItems, doc));
          if (items) {
            items.forEach(function (dom) {
              var contentId = that.getContentId(dom);
              var tempItem;
              // console.log(dom);
              if (that.isPage(dom)) {
                tempItem = new Page(page.courseId, contentId, that.getContentTitle(dom), dom);
              } else {
                tempItem = new Item(page.courseId, contentId, that.getContentTitle(dom), dom);
              }
              tempItem.addLink(that.__getActionLinks__(dom));
              tempItem.addLink(that.makeContentLink(tempItem));
              page.addItem(tempItem);
            });
          }

          resolve(page);
        }
      });
  });
};

/**
  @param {String} linkName - Name of the link for the button.
  @param {function} action - Event handler for 'click' event.
*/
BlackboardInterface.prototype.addPrimaryMenuButton = function (linkName, action) {
  var navNode = this.getId(this.ids.menuButtons, this.useDocument());
  var menuBtn = this.makeNode(`li.mainButton > h2 > a {${linkName}}`);
  this.setAttr({ href: '#' }, this.getChild('h2 > a', 0, menuBtn));
  menuBtn.addEventListener('click', action); 
  navNode.appendChild(menuBtn);
};

BlackboardInterface.prototype.addPrimarySubMenuButton = function (linkName, subItems) {
  var navNode = this.getId(this.ids.menuButtons, this.useDocument());
  var menuBtn = this.makeNode(`li.mainButton.sub > h2 > a {${linkName}} > span.chevron > img`);
  // var icon = this.makeNode('span.chevron > img');
  this.setAttr({ src: '/images/ci/ng/expand.gif' }, this.getChild('h2 > a > span > img', 0, menuBtn));
  var subMenu = this.makeNode(`ul > li.actionMenuItem * ${subItems.length}`);
  subItems.forEach(function (item, i) {
    var parent = this.getChild('li', i, subMenu);
    var itemNode = this.makeNode(`a {${item.linkName}}`);
    itemNode.addEventListener('click', item.action);
    parent.appendChild(itemNode);
  }, this);

  menuBtn.appendChild(subMenu);
  navNode.appendChild(menuBtn);
};

/**
  @param {Item} item - Item in which to find the content ID for.
  @return {String} - Item's content ID.
*/
BlackboardInterface.prototype.getContentId = function (item) {
  return this.getChild(this.q.contentItemId, 0, item).getAttribute('id');
};

/**
  @param {String} url - URL of the course to get the ID from. If empty: uses current page's url.
*/
BlackboardInterface.prototype.getCourseId = function (url) {
  var courseId = this.getParameters(url).course_id.split('#');

  return courseId[0];
};

/**
  @param {DOM Node} dom - DOM Node of the content item
  @return {String} - Title of the content item
*/
BlackboardInterface.prototype.getContentTitle = function (dom) {
  return this.getChild(this.q.contentItemTitle, 0, dom).innerText.trim();
};

/**
  @param {Item} item - Item to determine if it is a Page
  @return {boolean}
*/
BlackboardInterface.prototype.isPage = function (item) {
  var href = this.getUrl(this.getChild(this.q.itemLink, 0, item));

  if (href) {
    return href.includes(this.endpoints.contentFolder);
  }
  return false;
};

BlackboardInterface.prototype.__getActionLinks__ = function (dom) {
  var linkNodes = this.getChildren('li > a', this.getChild('div.cmdiv > ul', 0, dom));
  var actionLinks = {};

  linkNodes.forEach(function (link) {
    var foo = {};
    var name = this.getAttr('title', link);
    if (name) {
      var url = this.getUrl(link);
      if (url[0] === '/') {
        url = `${this.domain}${url}`;
      } else if (name === 'Delete') {
        url = url.split('(\'')[1];
        url = url.split('\'')[0];
        url = `${this.domain}${url}`;
      } else {
        console.log(`Unhandled Link type: ${name}`);
      }
      foo[name] = url;
      actionLinks = Object.assign({}, actionLinks, foo);
    }
  }, this);
  // console.log(actionLinks);

  return actionLinks;
};

BlackboardInterface.prototype.makeContentLink = function (item) {
  var courseId = item.courseId;
  var contentId = item.id;
  return {
    Content: `${domain}${this.endpoints.contentFolder}content_id=${contentId}&course_id=${courseId}#${contentId}`
  };
};

BlackboardInterface.prototype.getNonce = function (doc) {
  doc = doc || document;
  return this.getChild(this.q.nonce, 0, doc).value;
};

BlackboardInterface.prototype.getNonceAjax = function (doc) {
  doc = doc || document;
  return this.getChild(this.q.nonceAjax, 0, doc).value;
};

BlackboardInterface.prototype.editItem = function () {
  // var nonce = this.getNonce();
  var nonce = this.getNonce();
  var that = this;
  console.log('original nonce', nonce);
  request
    .get('https://fiu.blackboard.com/webapps/blackboard/execute/manageCourseItem?content_id=_5753040_1&course_id=_44712_1&dispatch=edit')
    .end(function (err, res) {
      if (err) {
        return console.log(err);
      }
      console.log('edit page response');
      console.log(res);
      var parser = new DOMParser();
      var doc = parser.parseFromString(res.text, "text/html");
      console.log(doc);
      // console.log(res.text);
      // nonce = that.getNonce(doc);
      nonce = doc.querySelector('#the_form input[name="blackboard.platform.security.NonceUtil.nonce"').value;

      console.log('nonce', nonce);

      request
        .post('https://fiu.blackboard.com/webapps/blackboard/execute/manageCourseItem?content_id=_5753040_1&btype=&course_id=_44712_1')
        .field('blackboard.platform.security.NonceUtil.nonce', nonce)
        .field('course_id', '_44712_1')
        .field('content_id', '_5753040_1')
        .field('type', 'item')
        .field('dispatch', 'save')
        .field('user_title', 'iAmNewest')
        // .field('htmlData_text_f', '/usr/local/blackboard/content/vi/BBLEARN/courses/1/Matthew_Thomson_SandBox/content/_5753040_1/embedded')
        // .field('htmlData_text_w', 'https://fiu.blackboard.com/courses/1/Matthew_Thomson_SandBox/content/_5753040_1/embedded/')
        // .field('htmlData_type', 'H')
        // .field('textbox_prefix', 'htmlData_text')
        // .field('htmlData_text', '<p>today is the day</p>')
        // .field('isAvailable', 'false')
        // .field('isTrack', 'false')
        // .field('top_Submit', 'Submit')
        // .field('title_color', '#000000')
        .end(function (err, res) {
          if (err) {
            console.log(err);
          }
          console.log('edit response');
          console.log(res);
          // console.log(res.text);
          var parser = new DOMParser();
          var doc = parser.parseFromString(res.text, "text/html");
          // var errText = that.getChild('#bbNG.receiptTag.content', 0, doc);
          var errText = doc.getElementById('bbNG.receiptTag.content');
          if (errText) {
            console.log(errText.innerText);
          } else {
            console.log('Saved');
            console.log(doc);
          }
        });
    });
};

export default BlackboardInterface;
