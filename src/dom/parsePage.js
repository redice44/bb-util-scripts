var parsePage = function (plugins) {
  var contentItems = document.querySelectorAll('#content_listContainer > li');
  var page = {};
  plugins = plugins || [];

  contentItems.forEach(function(item) {
    page = __buildDirectory__(item, page);
    page = __updateItemCount__(item, page);
    plugins.forEach(function(plugin) {
      page = plugin(item, page);
    });
  });

  return page;
};

function __updateItemCount__(item, page) {
  if (!page.hasOwnProperty('numItems')) {
    page = Object.assign({}, { numItems: 0 }, page);
  }

  page.numItems++;
  return page;
}

function __buildDirectory__(item, page) {
  var contentFolderController = '/webapps/blackboard/content/listContentEditable.jsp?';
  var link = item.querySelector('div.item > h3 > a');

  if (!page.hasOwnProperty('dir')) {
    page = Object.assign({}, { dir: [] }, page);
  }

  if (link && link.href.includes(contentFolderController)) {
    page.dir.push(__makeLink__(link));
  }

  return page;
}


function __makeLink__(link) {
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