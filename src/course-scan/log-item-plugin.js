var logItemPlugin = {
  parser: function (item, page) {
    if (!page.hasOwnProperty('items')) {
      page = Object.assign({}, { items: [] }, page);
    }

    page.items.push(this.__makeItem__(item));
    return page;
  },
  __makeItem__: function(item) {
    var contentFolderController = '/webapps/blackboard/content/listContentEditable.jsp?';

    var itemResult = {};
    var link = item.querySelector('div.item > h3 > a');


    if (link && link.href.includes(contentFolderController)) {
      itemResult = Object.assign({}, this.__getLink__(link));
    } else {
      // Not a folder
      itemResult.title = item.querySelector('div.item > h3').innerText;
    }

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
