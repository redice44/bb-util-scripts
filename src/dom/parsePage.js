var parsePage = function (plugins, courseId) {
  var contentItems = document.querySelectorAll('#content_listContainer > li');
  var page = {};
  plugins = plugins || [];
  page.courseId = courseId;

  contentItems.forEach(function(item) {
    page = directoryPlugin.parser(item, page);
    page = logItemPlugin.parser(item, page);
    plugins.forEach(function(plugin) {
      page = plugin.parser(item, page);
    });
  });

  return page;
};


var logItemPlugin = {
  parser: function (item, page) {
    if (!page.hasOwnProperty('items')) {
      page = Object.assign({}, { items: [] }, page);
    }
    page.items.push(this.__makeItem__(item, page.courseId));
    return page;
  },
  getDom: function(item) {
    if (item.items && item.items.length > 0) {
      var list = document.createElement('ol');
      item.items.forEach(function(i) {
        var domNode = document.createElement('li');
        var title = i.title;
        domNode.appendChild(document.createTextNode(title));
        list.appendChild(domNode);
      });

      return list;
    }

    var domNode = document.createElement('p');
    domNode.appendChild(document.createTextNode('Empty'));

    return domNode;
  },
  __makeItem__: function(item, courseId) {
    var contentFolderController = '/webapps/blackboard/content/listContentEditable.jsp?';

    var itemResult = {};
    var link = item.querySelector('div.item > h3 > a');


    if (link && link.href.includes(contentFolderController)) {
      itemResult = Object.assign({}, this.__getLink__(link));
    } else {
      // Not a folder
      itemResult.title = item.querySelector('div.item > h3').innerText;
    }

    itemResult.contentId = item.id.split(':')[1];
    itemResult.courseId = courseId;

    return itemResult;
  },
  __getLink__: function (link) {
    var contentId = 'Error: Content ID not parsed';
    var courseId = 'Error: Course ID not parsed';
    var params = getParameters(link.href);

    if (params.hasOwnProperty('content_id')) {
      contentId = params.content_id;
    }
    if (params.hasOwnProperty('course_id')) {
      courseId = params.course_id;
    }

    return {
      url: link.href,
      title: link.innerText,
      contentId: contentId,
      courseId: courseId
    };
  }
};

var directoryPlugin = {
  parser: function (item, page) {
    var contentFolderController = '/webapps/blackboard/content/listContentEditable.jsp?';
    var link = item.querySelector('div.item > h3 > a');

    if (!page.hasOwnProperty('nodes')) {
      page = Object.assign({}, { nodes: [] }, page);
    }

    if (link && link.href.includes(contentFolderController)) {
      page.nodes.push(this.__makeLink__(link));
    }

    return page;
  },
  __makeLink__: function (link) {
    var contentId = 'Error: Content ID not parsed';
    var courseId = 'Error: Course ID not parsed';
    var params = getParameters(link.href);

    if (params.hasOwnProperty('content_id')) {
      contentId = params.content_id;
    }
    if (params.hasOwnProperty('course_id')) {
      courseId = params.course_id;
    }

    return {
      url: link.href,
      title: link.innerText,
      contentId: contentId,
      courseId: courseId
    };
  }
};