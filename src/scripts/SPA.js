import LMSInterface from 'Blackboard';
import Course from 'Course';
import Page from 'Course/Page';

var lmsi =  new LMSInterface('https://fiu.blackboard.com');
var course;

function init () {
  buildStartBtn();
}

function buildStartBtn () {
  lmsi.addPrimaryMenuButton('Start SPA', initSPA);
}

function initSPA () {
  course = new Course(lmsi.getCourseId(), lmsi, []);
  console.log('Building Course');
  course.getCourse()
    .then(getWholeCourse)
    .catch(catchError);


}

function getWholeCourse () {
  course.scan()
    .then(updateLinks)
    .catch(catchError);
}

function updateLinks () {
  // window.location = lmsi.makeContentLink(course.getMenu()[0]);
  updateMenu();
  replaceContent(course.getMenu()[0]);
}

function updateMenu () {
  console.log('Updating Menu');
  lmsi.getChildren(lmsi.q.courseMenuLink, lmsi.getId(lmsi.ids.courseMenu, document))
    .forEach(function (link) {
      if (lmsi.getUrl(link).includes(lmsi.endpoints.contentFolder)) {
        var params = lmsi.getParameters(lmsi.getUrl(link));
        lmsi.setAttr({ href: `#${params.content_id}` }, link);
        link.addEventListener('click', function (e) {
          e.preventDefault();
          console.log(`Menu Clicked`, e.target);
          var target = e.target;
          var contentId;
          if (target.tagName.toLowerCase() === 'a') {
            contentId = lmsi.getUrl(target).substr(1);
          } else {
            contentId = lmsi.getUrl(target.parentElement).substr(1);
          }

          replaceContent(course.getPage(contentId));
        });
      }
    });
}

function replaceContent (page) {
  console.log(`Updating page to ${page.title}`);
  var contentItemsNode = lmsi.getId(lmsi.ids.contentItems, document);
  lmsi.getChildren('li', contentItemsNode).forEach(function (node) {
    node.remove();
  });
  var items = page.getItems();
  items.forEach(function (item) {
    var dom = item.getDom();

    if (item instanceof Page) {
      var link = lmsi.getChild(lmsi.q.itemLink, 0, dom);
      lmsi.setAttr({ href: `#${item.id}` }, link);
      link.addEventListener('click', function (e) {
        e.preventDefault();
        console.log('Content Folder Clicked', e.target, e.target.parentElement);
        var target = e.target;
        var contentId;

        if (target.tagName.toLowerCase() === 'a') {
          contentId = lmsi.getUrl(target).substr(1);
        } else {
          contentId = lmsi.getUrl(target.parentElement).substr(1);
        }

        console.log('content id', contentId);

        replaceContent(course.getPage(contentId));
      });
    }

    console.log('Item dom', dom);

    contentItemsNode.appendChild(dom);
  });

  window.scrollTo(0, 0);
}






function clearBB () {
  lmsi.getId('globalNavPageContentArea', document).remove();
  lmsi.getId('renameSubHeaderForm', document).remove();
  lmsi.getChild('span.hideoff', 0, lmsi.getId('My Blackboard', document)).remove();
  console.log('hehehe');
}

function makeGUI () {
  clearBB();

  // document.body.appendChild(lmsi.makeNode('section#main-content > section#nav + section#content'));
  var wrapperNode = lmsi.makeNode('section#main-content');
  wrapperNode.appendChild(makeNavGUI());
  wrapperNode.appendChild(makeContentGUI());
  document.body.appendChild(wrapperNode);
}

function makeNavGUI () {
  var menu = course.getMenu();
  var nav = lmsi.makeNode(`nav > ul`);
  menu.forEach(function (page, i) {
    var menuItem = lmsi.makeNode(`li > a {${page.title}}`);
    menuItem.appendChild(makeMenuItem(page));
    lmsi.getChild('ul', 0, nav).appendChild(menuItem);
  });
  return nav;
}

function makeMenuItem (page) {
  var menuItem = lmsi.makeNode('ul.collapse');

  page.getItems().forEach(function (item) {
    if (item instanceof Page) {
      var menuSubItem = lmsi.makeNode(`li > a {${item.title}}`);
      var link = lmsi.getChild('a', 0, menuSubItem);
      // set link stuff or handlers 
      menuSubItem.appendChild(makeMenuItem(item));
      menuItem.appendChild(menuSubItem);
    }
  });

  return menuItem;
}

function makeContentGUI () {
  return makeContentPage(course.getMenu()[0]);
}

function makeContentPage (page) {
  var section = lmsi.makeNode('section#content');
  var parser = new DOMParser();
  var items = page.getItems();
  items.forEach(function (item) {
    var node = lmsi.makeNode('article');
    // var itemNode = parser.parseFromString(item.getDom(), "text/html");
    // console.log('dom', item.getDom());
    // console.log('parsed', itemNode.body);
    node.appendChild(item.getDom());
    section.appendChild(node);    
  });
  return section;
}

function catchError (err) {
  console.log(err);
}

init();
