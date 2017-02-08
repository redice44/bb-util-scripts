var linkNewWindowPlugin = {
  parser: function (item, page) {
    var links = item.querySelectorAll('a');

    if (!page.hasOwnProperty('newWindow')) {
      page = Object.assign({}, { newWindow: [] }, page);
    }

    links.forEach(function(link) {
      var target = link.getAttribute('target');
      var href = link.getAttribute('href');

      if (!href.match(/^#/) &&
          !href.match(/^javascript/) &&
          !href.match(/fiu\.blackboard\.com/) &&
          !href.match(/^\/webapps\//)) {
        if (!target || target && target.trim().toLowerCase() !== '_blank') {
          console.log('title', link.innerText);
          console.log('target ', target);
          console.log('href', href);
          console.log('valid no target=_blank');
          page.newWindow.push({
            title: link.innerText,
            url: link.href
          });
        }
      }
    }, this);

    return page;
  }
};