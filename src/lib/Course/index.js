import Page from 'Course/Page';

function Course (id, LMSinterface, plugins) {
  this.id = id;
  this.root = null;
  this.LMSinterface = LMSinterface;
  this.plugins = plugins;
}

/**
  Scans all top level pages
*/
Course.prototype.getCourse = function () {
  // get course dom
  var that = this;
  var menuLinks = this.LMSinterface.getMainPage(this.id);
  menuLinks
    .then(function (pages) {

      pages.forEach(function (page) {
        this.scanPage(page);
      }, that);
    })
    .catch(function (err) {
      console.log(err);
    });
};

/**
  Deep scan of the page.
*/
Course.prototype.scanPage = function (page) {
  var that = this;
  var parsedPage = this.LMSinterface.getPage(page);
  parsedPage
    .then(function (p) {
      console.log(p);
      // iterate over the items that are pages
      p.items.forEach(function (item) {
        // Run all plugins
        this.plugins.forEach(function (plugin) {
          item.addResult(plugin.parse(item.getDom()));
        });
        if (item instanceof Page) {
          // Page
          this.scanPage(item);
        } else {
          // Item
        }
      }, that);
    })
    .catch(function (err) {
      console.log(err);
    });
};

Course.prototype.run = function (plugin) {
  this.root.forEach(function (topPage) {
    topPage.items.forEach(function (item) {
      item.addResult(plugin.parse(item.getDom()));
    });
  });
};

export default Course;
