import Course from 'Course';
import Page from 'Course/Page';

function SPA (LMSInterface) {
  this.course = new Course(LMSInterface.getCourseId(), LMSInterface, []);
  this.lmsi = LMSInterface;
}

SPA.prototype.start = function () {
  console.log('Getting Course');
  var that = this;
  this.course.getCourse()
    .then(function () {
      that.course.scan()
        .then(that.makeSPA.bind(that))
        .catch(genPromisErr);
    })
    .catch(genPromisErr);
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

  items = page.getItems();
  items.forEach(function (item) {
    var dom = item.getDom();

    if (item instanceof Page) {
      var link = this.lmsi.getChild(this.lmsi.q.itemLink, 0, dom);
      this.lmsi.setAttr({ href: `#${item.id}` }, link);
      link.addEventListener('click', function (e) {
        e.preventDefault();
        console.log('Content Folder Clicked');
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

    contentItemsNode.appendChild(dom);
  }, this);

  window.scrollTo(0, 0);
};

function genPromisErr (err) {
  console.log(err);
}

export default SPA;
