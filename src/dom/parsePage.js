var parsePage = function (plugins) {
  var contentItems = document.querySelectorAll('#content_listContainer > li');
  var page = {};
  plugins = plugins || [];

  contentItems.forEach(function(item) {
    plugins.forEach(function(plugin) {
      page = plugin.parser(item, page);
    });
  });

  return page;
};
