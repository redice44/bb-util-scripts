import Course from 'Course';
import Page from 'Course/Page';
import editIcon from 'Icons/edit';
import copyIcon from 'Icons/copy';
import moveIcon from 'Icons/move';
import saveIcon from 'Icons/save';
import cancelIcon from 'Icons/cancel';
import visibleIcon from 'Icons/visible';
import hiddenIcon from 'Icons/hidden';

function SPA (LMSInterface) {
  this.course = new Course(LMSInterface.getCourseId(), LMSInterface, []);
  this.lmsi = LMSInterface;
}

SPA.prototype.start = function () {
  console.log('Getting Course');
  var that = this;
  return new Promise(function (resolve, reject) {
    that.course.getCourse()
      .then(function () {
        console.log('scanning course', that);
        that.course.scan()
          .then(function () {
            that.makeSPA();
            console.log('done', that);
            resolve();
        }).catch(function (err) {
          reject(err);
        });
      })
      .catch(function (err) {
        reject(err);
      });
  });
};

SPA.prototype.makeSPA = function () {
  this.updateMenu();
  var contentId = this.lmsi.getParameters(document.location.href).content_id;
  
  window.addEventListener('popstate', function (e) {
    if (e.state) {
      this.updateContent(this.course.getPage(e.state.contentId));
    }
  }.bind(this));

  // Store initial location
  history.replaceState({
    contentId: contentId
  }, contentId, document.location.href);

  this.updateContent(this.course.getPage(contentId));
};

SPA.prototype.updateMenu = function () {
  console.log('Updating Menu');
  this.lmsi.getChildren(this.lmsi.q.courseMenuLink, this.lmsi.getId(this.lmsi.ids.courseMenu, document))
    .forEach(function (link) {
      if (this.lmsi.getUrl(link).includes(this.lmsi.endpoints.contentFolder)) {
        var params = this.lmsi.getParameters(this.lmsi.getUrl(link));
        this.lmsi.setAttr({ href: `#${params.content_id}` }, link);
        link.addEventListener('click', function (e) {
          e.preventDefault();
          console.log(`Menu Clicked`);
          var target = e.target;
          var contentId;
          if (target.tagName.toLowerCase() === 'a') {
            contentId = this.lmsi.getUrl(target).substr(1);
          } else {
            contentId = this.lmsi.getUrl(target.parentElement).substr(1);
          }
          var page = this.course.getPage(contentId);
          history.pushState({
            contentId: contentId
          }, contentId, this.lmsi.makeContentLink(page).Content);

          this.updateContent(page);
        }.bind(this));
      }
    }, this);
};

SPA.prototype.updateContent = function (page) {
  console.log(`Updating page to ${page.title}`);
  var contentItemsNode = this.lmsi.getId(this.lmsi.ids.contentItems, document);
  var items = [];
  if (contentItemsNode) {
    items = this.lmsi.getChildren('li', contentItemsNode);
    
    if (items) {
      items.forEach(function (node) {
        node.remove();
      });
    }
  } else {
    this.lmsi.getChild('.noItems.container-empty', 0, document).remove();
    contentItemsNode = this.lmsi.makeNode('ul#content_listContainer.contentListPlain');
    this.lmsi.getChild('form#content', 0, document).appendChild(contentItemsNode);
  }

  // Update the title and breadcrumbs
  this.updateContentTitle(page);
  this.updateBreadCrumbs(page);

  items = page.getItems();
  items.forEach(function (item) {
    var dom = item.getDom();
    this.addActionIcons(item, dom);
    this.addEditAreas(item, dom);
    if (item instanceof Page) {
      this.updateContentFolderLinks(dom, item.id);
    }

    contentItemsNode.appendChild(dom);
  }, this);

  window.scrollTo(0, 0);
};

SPA.prototype.updateContentTitle = function (page) {
  var titleBar = this.lmsi.getChild('#pageTitleBar', 0, document);
  var title = this.lmsi.getChild('h1 > span > span', 0, titleBar);
  // this.lmsi.replaceText(page.title, title);
  title.innerText = page.title;
  var actionMenu = this.lmsi.getChild('span.contextMenuContainer', 0, titleBar);

  if (actionMenu) {
    actionMenu.remove();
  }
};

SPA.prototype.updateBreadCrumbs = function (page) {
  var breadcrumbBar = this.lmsi.getChild('#breadcrumbs', 0, document);
  var breadcrumbs = this.lmsi.getChildren('div.path > ol > li', breadcrumbBar);

  while (breadcrumbs.length > 1) {
    breadcrumbs[breadcrumbs.length - 1].remove();
    breadcrumbs.pop();
  }

};

SPA.prototype.updateContentFolderLinks = function (dom, contentId) {
  // var dom = item.getDom();
  var link = this.lmsi.getChild(this.lmsi.q.itemLink, 0, dom);
  this.lmsi.setAttr({ href: `#${contentId}` }, link);
  link.addEventListener('click', function (e) {
    console.log('Content Folder Clicked');
    e.preventDefault();
    var target = e.target;
    var contentId;

    if (target.tagName.toLowerCase() === 'a') {
      contentId = this.lmsi.getUrl(target).substr(1);
    } else {
      contentId = this.lmsi.getUrl(target.parentElement).substr(1);
    }

    var page = this.course.getPage(contentId);
    history.pushState({
      contentId: contentId
    }, contentId, this.lmsi.makeContentLink(page).Content);

    this.updateContent(page);
  }.bind(this));
  // item.setDom(dom);
};

SPA.prototype.addActionIcons = function (item, dom) {
  // var dom = item.getDom();
  var wrapper = this.lmsi.makeNode('div');
  var linkUrls = item.getLinks();
  if (linkUrls.Edit) {
    var icon = editIcon();
    this.lmsi.setAttr({ name: item.id }, icon);
    icon.addEventListener('click', this.initEdit.bind(this));
    wrapper.appendChild(icon);
  }

  var title = this.lmsi.getChild(this.lmsi.q.contentItemId, 0, dom);
  title.insertBefore(wrapper, title.firstChild);
  // item.setDom(dom);
};

SPA.prototype.initEdit = function (event) {
  var item = this.getItemFromTarget(event.target);

  // Gets the edit page
  this.lmsi.startEdit(item)
    .then(this.editing.bind(this))
    .catch(function (err) {
      console.log(err);
    });
};

SPA.prototype.editing = function (results) {
  console.log('edit page results', results);
  var item = this.course.getItem(results.contentId);
  item.setEditContent(results);

  // Find and display the input box
  var titleEdit = this.lmsi.getId(`${results.contentId}_user_title`, document);
  this.lmsi.setStyle({ display: 'block' }, titleEdit);
  this.lmsi.setAttr({ value: results.title }, titleEdit);

  // Find and display the textarea box
  var bodyEdit = this.lmsi.getId(`${results.contentId}_body`, document);
  this.lmsi.setStyle({ display: 'block' }, bodyEdit);
  // this.lmsi.setAttr({ innerText: results.body }, bodyEdit);
  bodyEdit.setValue(results.body);

  // Visibility Icons
  var visibleToggle = this.lmsi.getId(`${results.contentId}_visibility`, document);
  this.lmsi.setStyle({ display: 'block' }, visibleToggle);
  var visibleIcon = this.lmsi.getChild('svg', 0, visibleToggle);
  var hiddenIcon = this.lmsi.getChild('svg', 1, visibleToggle);

  this.lmsi.toggleClasses('hidden', !results.isVisible, visibleIcon);
  visibleIcon.addEventListener('click', this.toggleVisibilityIcons.bind(this));
  this.lmsi.setAttr({ name: results.contentId }, visibleIcon);

  this.lmsi.toggleClasses('hidden', results.isVisible, hiddenIcon);
  hiddenIcon.addEventListener('click', this.toggleVisibilityIcons.bind(this));
  this.lmsi.setAttr({ name: results.contentId }, hiddenIcon);

  // Find and hide the old title
  var plainTitle = this.lmsi.getChild(`#${results.contentId} > h3 > span`, 1, document);
  this.lmsi.setStyle({ display: 'none' }, plainTitle);

  // Find and hide old body
  var plainBody = this.lmsi.getChild(`#${results.contentId}`, 0, document);
  plainBody = this.lmsi.getChild(`.details`, 0, plainBody.parentElement);
  this.lmsi.setStyle({ display: 'none' }, plainBody);  
  
  // Add the save button
  var save = saveIcon();
  this.lmsi.setAttr({ name: results.contentId }, save);
  save.addEventListener('click', this.saveEdit.bind(this));
  titleEdit.parentElement.appendChild(save);

  // Add cancel button
  var cancel = cancelIcon();
  this.lmsi.setAttr({ name: results.contentId }, cancel);
  cancel.addEventListener('click', this.cancelEdit.bind(this));
  titleEdit.parentElement.appendChild(cancel);
};

SPA.prototype.toggleVisibilityIcons = function (event) {
  var item = this.getItemFromTarget(event.target);
  var visibleToggle = this.lmsi.getId(`${item.id}_visibility`, document);

  var results = item.getEditContent();
  results.isVisible = !results.isVisible;
  item.setEditContent(results);

  var visibleIcon = this.lmsi.getChild('svg', 0, visibleToggle);
  var hiddenIcon = this.lmsi.getChild('svg', 1, visibleToggle);
  this.lmsi.toggleClasses('hidden', null, visibleIcon);
  this.lmsi.toggleClasses('hidden', null, hiddenIcon);
};

SPA.prototype.saveEdit = function (event) {
  console.log('Saving');
  var that = this;
  var item = this.getItemFromTarget(event.target);
  var results = item.getEditContent();

  // update the content with the editted content
  // title
  results.title = this.lmsi.getId(`${item.id}_user_title`, document).value;
  // body
  results.body = this.lmsi.getId(`${item.id}_body`, document).getValue();
  // etc

  item.setEditContent(results);

  this.lmsi.editItem(item)
    .then(function (dom) {
      // should update the item's dom with this one.
      item.setDom(dom);
      that.updateContent(that.course.getItemsPage(item.id));
    }).catch(genPromiseErr);
  // update item/page. probably for now just fast reload the page.
};

SPA.prototype.cancelEdit = function (event) {
  console.log('Canceling Edit');
  var item = this.getItemFromTarget(event.target);
  item.clearEditContent();
  this.updateContent(this.course.getItemsPage(item.id));
};

SPA.prototype.addEditAreas = function (item, dom) {
  var editArea = this.lmsi.makeNode(`div#${item.id}_edit_area.edit-area`);
  var titleEdit = this.lmsi.makeNode(`input#${item.id}_user_title`);
  this.lmsi.setAttr({ type: 'text' }, titleEdit);
  this.lmsi.setStyle({ display: 'none' }, titleEdit);
  editArea.appendChild(titleEdit);

  var bodyEdit = this.lmsi.makeNode(`textarea#${item.id}_body`);
  this.lmsi.setStyle({ display: 'none' }, bodyEdit);
  this.lmsi.setAttr({ rows: '20', cols: '100' }, bodyEdit);
  editArea.appendChild(bodyEdit);

  var visibilityToggle = this.lmsi.makeNode(`div#${item.id}_visibility`);
  this.lmsi.setStyle({ display: 'none' }, visibilityToggle);
  var visIcon = visibleIcon();
  var hidIcon = hiddenIcon();
  // this.lmsi.addClasses('hidden', hidIcon);
  visibilityToggle.appendChild(visIcon);
  visibilityToggle.appendChild(hidIcon);
  editArea.appendChild(visibilityToggle);



  // dom doesn't have a .getElementById() for some reason
  this.lmsi.getChild(`#${item.id}`, 0, dom).appendChild(editArea);
};

SPA.prototype.getItemFromTarget = function (target) {
  if (target.tagName === 'path') {
    target = target.parentElement;
  }

  var id = this.lmsi.getAttr('name', target);

  return this.course.getItem(id);
};

function genPromiseErr (err) {
  console.log(err);
}

export default SPA;
