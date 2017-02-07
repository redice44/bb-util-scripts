var linkNewWindowPlugin = {
  parser: function (item, page) {
    var links = item.querySelectorAll('a');

    if (!page.hasOwnProperty('newWindow')) {
      page = Object.assign({}, { newWindow: [] }, page);
    }

    links.forEach(function(link) {
      var temp = link.getAttribute('target');
      if (temp && temp !== '_blank') {
        page.newWindow.push({
          title: link.innerText,
          url: link.href
        });
      }
    });

    return page;
  }
};
