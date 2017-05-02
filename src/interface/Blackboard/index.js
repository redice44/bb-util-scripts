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
          var doc = that.stringToDom(res.text);
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
          var doc = that.stringToDom(res.text);
          page.addItems(that.parsePage(doc, page.courseId));

          resolve(page);
        }
      });
  });
};

BlackboardInterface.prototype.parsePage = function (doc, courseId) {
  var items = this.getChildren(this.q.contentItems, this.getId(this.ids.contentItems, doc));
  var results = [];
  if (items) {
    items.forEach(function (dom) {
      var contentId = this.getContentId(dom);
      var tempItem;
      // console.log(dom);
      if (this.isPage(dom)) {
        tempItem = new Page(courseId, contentId, this.getContentTitle(dom), dom);
      } else {
        tempItem = new Item(courseId, contentId, this.getContentTitle(dom), dom);
      }
      tempItem.addLink(this.__getActionLinks__(dom));
      tempItem.addLink(this.makeContentLink(tempItem));
      results.push(tempItem);
    }, this);
  }

  return results;
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


/*
  Current known list of values for items
  key - query

  nonce - input[name="blackboard.platform.security.NonceUtil.nonce"]
  contentId - input[name="content_id"]
  courseId - input[name="course_id"]
  type - input[name="type"]
  ??? - input[name="do"]
  dispatch - input[name="dispatch"]
  ???- input[name="remove_file_id"]
  ??? - input[name="modify_file_id"]
  ??? - input[name="tab_id"]
  ??? - input[name="area"]
  ??? - input[name="btype"]

  item title - input[name="user_title"]
  title color - input[name="title_color"]
  item body - textarea[name="htmlData_text"]

  stuff to handle attachments...omit for now

  availability
    yes - input#isAvailable_true
    no - input#isAvailable_false

  tracking
    yes - input#isTrack_true
    no - input#isTrack_false

  date availability
    start - input#bbDateTimePickerstart.value format: YYYY-M-D HH:MM:SS Only double digits if needed
    end - input#bbDateTimePickerend.value
*/



BlackboardInterface.prototype.startEdit = function (item) {
  var that = this;
  return new Promise(function (resolve, reject) {
    request
      .get(item.getLinks().Edit)
      .end(function (err, res) {
        if (err) {
          reject(err);
        }
        var doc = that.stringToDom(res.text);
        var scriptDates = that.getChildren('script', doc);
        scriptDates = scriptDates[scriptDates.length - 3].innerText.split(';');

        scriptDates = scriptDates.filter(function (d) {
          return d.includes('new calendar.DatePicker');
        });

        scriptDates = scriptDates.map(function (d) {
          return d.trim().split(',')[1];
        });

        scriptDates = scriptDates.map(function (d) {
          return d.substr(1, d.length-2);
        });



        doc = that.getId('the_form', doc);
        var results = {};

        results.contentId = item.id;
        results.courseId = item.courseId;

        results.nonce = that.getChild('input[name="blackboard.platform.security.NonceUtil.nonce"]', 0, doc);
        if (results.nonce) {
          results.nonce = results.nonce.value;
        }

        results.type = that.getChild('input[name="type"]', 0, doc);
        if (results.type) {
          results.type = results.type.value;
        }

        results.title = that.getChild('input[name="user_title"]', 0, doc);
        if (results.title) {
            results.title = results.title.value;
        }

        results.titleColor = that.getChild('input[name="title_color"]', 0, doc);
        if (results.titleColor) {
          results.titleColor = results.titleColor.value;
        }

        results.body = that.getChild('textarea[name="htmlData_text"]', 0, doc);
        if (results.body) {
          results.body = results.body.getValue();
        }

        results.isVisible = that.getChild('#isAvailable_true', 0, doc);
        if (results.isVisible) {
          results.isVisible = results.isVisible.checked;
        }

        results.isTracking = that.getChild('#isTrack_true', 0, doc);
        if(results.isTracking) {
          results.isTracking = results.isTracking.checked;
        }

        results.dateStart = scriptDates[0];

        // results.dateStart = that.getChild('#bbDateTimePickerstart', 0, doc);
        // if (results.dateStart) {
        //   results.dateStart = results.dateStart.value;
        // }

        results.dateEnd = scriptDates[1];

        // results.dateEnd = that.getChild('#bbDateTimePickerend', 0, doc);
        // if (results.dateEnd) {
        //   results.dateEnd = results.dateEnd.value;
        // }

        resolve(results);
      });
    });
};


/* Content Folder
content_id:_6030145_1
course_id:_44712_1
blackboard.platform.security.NonceUtil.nonce:f1d1b86a-b887-4003-8e5c-0835ad8db0c7
user_title:depth lv 1
title_color:#000000
htmlData_text:<p>sadfasdfasfdsadf</p>
contentView:T


do:
area:
top_Submit:Submit
htmlData_text_f:/usr/local/blackboard/content/vi/BBLEARN/courses/1/Matthew_Thomson_SandBox/content/_6030145_1/embedded
htmlData_text_w:https://fiu.blackboard.com/courses/1/Matthew_Thomson_SandBox/content/_6030145_1/embedded/
htmlData_type:H
textbox_prefix:htmlData_text
isAvailable:true
isTrack:false
bbDateTimePicker_start_date:
bbDateTimePicker_start_datetime:
pickdate:
pickname:
bbDateTimePicker_start_time:
bbDateTimePicker_end_date:
bbDateTimePicker_end_datetime:
pickdate:
pickname:
bbDateTimePicker_end_time:
*/


BlackboardInterface.prototype.startEditFolder = function (item) {
  return new Promise(function (resolve, reject) {
    request
      .get(item.getLinks().Edit)
      .end(function (err, res) {
        if (err) {
          reject(err);
        }
        var doc = that.stringToDom(res.text);
        doc = that.getId('the_form', doc);
        var results = {};
        results.contentId = item.id;
        results.courseId = item.courseId;

        results.nonce = that.getChild('input[name="blackboard.platform.security.NonceUtil.nonce"]', 0, doc);
        if (results.nonce) {
          results.nonce = results.nonce.value;
        }

        results.title = that.getChild('input[name="user_title"]', 0, doc);
        if (results.title) {
          results.title = results.title.value;
        }

        results.titleColor = that.getChild('input[name="title_color"]', 0, doc);
        if (results.titleColor) {
          results.titleColor = results.titleColor.value;
        }

        results.body = that.getChild('textarea[name="htmlData_text"]', 0, doc);
        if (results.body) {
          results.body = results.body.getValue();
        }

        results.contentView = that.getChild('#iconOnlyView', 0, doc);
        if (results.contentView && results.contentView.checked) {
          // I
          results.contentView = results.contentView.value;
        }

        results.contentView = that.getChild('#textOnlyView', 0, doc);
        if (results.contentView && results.contentView.checked) {
          // T
          results.contentView = results.contentView.value;
        }

        results.contentView = that.getChild('#iconAndTextView', 0, doc);
        if (results.contentView && results.contentView.checked) {
          // X
          results.contentView = results.contentView.value;
        }

        results.isVisible = that.getChild('#availableYes', 0, doc);
        if (results.isVisible) {
          results.isVisible = results.isVisible.checked;
        }

        results.isTracking = that.getChild('#trackYes', 0, doc);
        if(results.isTracking) {
          results.isTracking = results.isTracking.checked;
        }

        resolve(results);
      });
  });
};

/**
  @param {Item} item - Item being sent.
  @return {Promise.<DOM Node>} - DOM Node of the resulting page. 
    The content page that the item is located in.
*/
BlackboardInterface.prototype.editItem = function (item) {
  var that = this;
  return new Promise (function (resolve, reject) {
    var content = item.getEditContent();
    console.log('sending content', content);
    request
      .post(`https://fiu.blackboard.com/webapps/blackboard/execute/manageCourseItem?content_id=${item.id}&btype=&course_id=${item.courseId}`)
      .field('blackboard.platform.security.NonceUtil.nonce', content.nonce)
      .field('course_id', item.courseId)
      .field('content_id', item.id)
      .field('type', 'item')
      .field('dispatch', 'save')
      .field('user_title', content.title)
      .field('htmlData_text', content.body)
      .field('isAvailable', content.isVisible)
      .field('isTrack', content.isTracking)
      .field('title_color', content.titleColor)
      .field('bbDateTimePicker_start_datetime', content.dateStart)
      .field('bbDateTimePicker_end_datetime', content.dateEnd)
      // .field('bbDateTimePicker_start_date', content.startDate)
      // .field('bbDateTimePicker_start_time', content.startTime)
      .field('bbDateTimePicker_start_checkbox', content.startCheck)
      // .field('bbDateTimePicker_end_date', content.endDate)
      // .field('bbDateTimePicker_end_time', content.endTime)
      .field('bbDateTimePicker_end_checkbox', content.endCheck)
      .end(function (err, res) {
        console.log('edit response');
        // console.log(res);
        var doc = that.stringToDom(res.text);
        // DOMInterface doesn't handle the . in the ID.
        var errText = doc.getElementById('bbNG.receiptTag.content');
        if (errText) {
          // console.log(errText.innerText);
          console.log('Error in saving edit');
          reject(errText.innerText);
        } else {
          console.log('Saved');
          var items = that.parsePage(doc, item.courseId);
          items = items.filter(function (i) {
            return i.id === item.id;
          });
          console.log('Returning ', items[0]);
          resolve(items[0].getDom());
        }
      });
  });
};

export default BlackboardInterface;

