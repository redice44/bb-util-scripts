var parsePage = function (plugins) {
  var contentItems = document.querySelectorAll('#content_listContainer > li');
  var page = {};
  plugins = plugins || [];

  contentItems.forEach(function(item) {
    plugins.forEach(function(plugin) {
      page = plugin(item, page);
    });
  });

  return page;
};
