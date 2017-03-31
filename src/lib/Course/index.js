import Page from 'Course/Page';

function Course (id, LMSInterface, plugins) {
  this.id = id;
  this.root = null;
  this.LMSInterface = LMSInterface;
  this.plugins = plugins;
}

/**
  Scans all top level pages
*/
Course.prototype.getCourse = function () {
  // get course dom
  var that = this;
  return new Promise(function (resolve, reject) {
    var menuLinks = that.LMSInterface.getMainPage(that.id);
    menuLinks
      .then(function (pages) {
        that.root = pages;
        resolve();
      })
      .catch(function (err) {
        reject(err);
      });
  });
};

Course.prototype.scan = function () {
  return Promise.all(this.root.map(this.scanPage.bind(this)));
};

Course.prototype.displayResults = function () {
  var results = this.LMSInterface.makeNode('div');
  
  this.root.forEach(function (page) {
    results.appendChild(this.displayPage(page));
  }, this);

  return results;
};

Course.prototype.displayPage = function (page) {
  var pageNode = this.buildPageDisplay();
  var parent = this.LMSInterface.getChild('article', 0, pageNode);
  this.LMSInterface.addText(page.title,
    this.LMSInterface.getChild('header', 0, pageNode));

  page.getItems().forEach(function (item) {
    if (item instanceof Page) {
      parent.appendChild(this.displayPage(item));
    } else {
      parent.appendChild(this.displayItem(item));
    }
  }, this);

  return pageNode;
};

Course.prototype.displayItem = function (item) {
  var itemNode = this.buildItemDisplay();
  var parent = this.LMSInterface.getChild('section', 0, itemNode);
  this.LMSInterface.addText(item.title,
    this.LMSInterface.getChild('header', 0, itemNode));

  this.plugins.forEach(function (plugin) {
    parent.appendChild(plugin.getResults(item));
  });

  return itemNode;
};

Course.prototype.buildPageDisplay = function () {
  return this.LMSInterface.makeNode('section > header + article');
};

Course.prototype.buildItemDisplay = function () {
  return this.LMSInterface.makeNode('section > header + section');
};

/**
  Deep scan of the page.
*/
Course.prototype.scanPage = function (page) {
  var that = this;
  return new Promise(function (resolve, reject) {
    var parsedPage = that.LMSInterface.getPage(page);
    parsedPage
      .then(function (p) {
        // console.log(p);
        var pages = []; // Array of pages on current page.
        // iterate over the items that are pages
        p.getItems().forEach(function (item) {
          // Run all plugins
          that.plugins.forEach(function (plugin) {
            item.addResult(plugin.parse(item.getDom()));
          });
          if (item instanceof Page) {
            // Page
            // that.scanPage(item);
            pages.push(that.scanPage(item));
          } else {
            // Item
          }
        });
        Promise.all(pages)
          .then(function (value) {
            // console.log('Done holding');
            resolve(p);
          }).catch(function (err) {
            reject(err);
          });
      })
      .catch(function (err) {
        reject(err);
      });
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
