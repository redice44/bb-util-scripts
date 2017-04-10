import Course from 'Course';
import Page from 'Course/Page';
import editIcon from 'Icons/edit';
import copyIcon from 'Icons/copy';
import moveIcon from 'Icons/move';

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

  this.course.getMenu().forEach(function (page) {
    this.formatPage(page);
  }, this);


  this.updateContent(this.course.getPage(contentId));
};

SPA.prototype.formatPage = function (page) {
  var items = page.getItems();

  items.forEach(function (item) {
    this.addActionIcons(item);
  }, this);
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

  items = page.getItems();
  items.forEach(function (item) {
    var dom = item.getDom();

    if (item instanceof Page) {
      this.updateContentFolderLinks(dom, item.id);
    }

    contentItemsNode.appendChild(dom);
  }, this);

  window.scrollTo(0, 0);
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

SPA.prototype.addActionIcons = function (item) {
  var dom = item.getDom();
  var wrapper = this.lmsi.makeNode('div');
  var linkUrls = item.getLinks();
  var actions = [
    {
      type: 'Edit',
      icon: editIcon
    },
    {
      type: 'Copy',
      icon: copyIcon
    },
    {
      type: 'Move',
      icon: moveIcon
    }
  ];
  var icon;

  actions.forEach(function (action) {
    if (linkUrls[action.type]) {
      icon = this.lmsi.makeNode('a');
      this.lmsi.setAttr({ href: linkUrls[action.type], target: '_blank' }, icon);
      icon.appendChild(action.icon());
      wrapper.appendChild(icon);
    }
  }, this);

  var title = this.lmsi.getChild(this.lmsi.q.contentItemId, 0, dom);
  title.insertBefore(wrapper, title.firstChild);
  item.setDom(dom);
};

function genPromiseErr (err) {
  console.log(err);
}

export default SPA;
