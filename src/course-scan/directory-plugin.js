var directoryPlugin = {
  parser: function (item, page) {
    var contentFolderController = '/webapps/blackboard/content/listContentEditable.jsp?';
    var link = item.querySelector('div.item > h3 > a');

    if (!page.hasOwnProperty('dir')) {
      page = Object.assign({}, { dir: [] }, page);
    }

    if (link && link.href.includes(contentFolderController)) {
      page.dir.push(this.__makeLink__(link));
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
