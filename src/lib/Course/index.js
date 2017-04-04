import Page from 'Course/Page';
import Item from 'Course/Item';

function Course (id, LMSInterface, plugins) {
  this.id = id;
  this.__root__ = null;
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
        that.__root__ = pages;
        resolve();
      })
      .catch(function (err) {
        reject(err);
      });
  });
};

Course.prototype.scan = function () {
  return Promise.all(this.__root__.map(this.scanPage.bind(this)));
};

Course.prototype.displayResults = function () {
  var results = this.LMSInterface.makeNode(`section#${this.id}.class`);
  
  this.__root__.forEach(function (page) {
    results.appendChild(this.displayPage(page));
  }, this);

  return results;
};

Course.prototype.displayPage = function (page) {
  var pageNode = this.buildPageDisplay(page.title);
  var parent = this.LMSInterface.getChild('article', 0, pageNode);
  // this.LMSInterface.addText(page.title,
  //   this.LMSInterface.getChild('header', 0, pageNode));

  page.getItems().forEach(function (item) {
    if (item instanceof Page) {
      parent.appendChild(this.displayPage(item));
    } else {
      parent.appendChild(this.displayItem(item));
    }
  }, this);

  var pageResults = page.getResults();

  this.plugins.forEach(function (plugin) {
    if (pageResults[plugin.getName()]) {
      this.LMSInterface.getChild('header', 0, pageNode).appendChild(plugin.getErrorIcon());
    }
  }, this);

  return pageNode;
};

Course.prototype.displayItem = function (item) {
  var itemNode = this.buildItemDisplay(item.title);
  var parent = this.LMSInterface.getChild('section', 0, itemNode);
  // this.LMSInterface.addText(item.title,
  //   this.LMSInterface.getChild('header', 0, itemNode));

  this.plugins.forEach(function (plugin) {
    if (plugin.hasResults(item)) {
      var icon = plugin.getErrorIcon();
      icon.addEventListener('click', plugin.toggleResult.bind(plugin));
      this.LMSInterface.getChild('header', 0, itemNode).appendChild(icon);

      parent.appendChild(plugin.getResults(item));
    }
  }, this);

  return itemNode;
};

Course.prototype.buildPageDisplay = function (title) {
  var scaffold = this.LMSInterface.makeNode(`section.folder > header.collapse {${title}} + article`);
  this.LMSInterface.getChild('header', 0, scaffold).addEventListener('click', this.toggleCollapse);
  return scaffold;
};

// clean up
Course.prototype.toggleCollapse = function (e) {
  var target = e.target;
  target.classList.toggle('collapse');
};

Course.prototype.buildItemDisplay = function (title) {
  return this.LMSInterface.makeNode(`section > header {${title}} + section`);
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
            var pageResults = p.getResults();
            // console.log(pageResults);
            if (plugin.hasResults(item)) {
              if (pageResults[plugin.getName()]) {
                var foo = {};
                foo[plugin.getName()] = pageResults[plugin.getName()]++;
                p.addResult(foo);
              } else {
                var foo = {};
                foo[plugin.getName()] = 1;
                p.addResult(foo);
              }
            }
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
  this.__root__.forEach(function (topPage) {
    topPage.items.forEach(function (item) {
      item.addResult(plugin.parse(item.getDom()));
    });
  });
};

Course.prototype.encode = function () {
  var encoding = {};
  encoding.id = this.id;
  encoding.__root__ = this.__root__.map(this.encodePage, this);

  return encoding;
};

Course.prototype.encodePage = function (page) {
  var p = {};
  p.isPage = true;
  p.title = page.title;
  p.courseId = page.courseId;
  p.id = page.id;
  p.results = page.getResults();
  p.items = page.getItems().map(function (item) {
    if (item instanceof Page) {
      return this.encodePage(item);
    } else {
      return this.encodeItem(item);
    }
  }, this);

  return p;
};

Course.prototype.encodeItem = function (item) {
  var i = {};
  i.isPage = false;
  i.title = item.title;
  i.courseId = item.courseId;
  i.id = item.id;
  i.result = item.getResults();

  return i;
};

/**
  Updates the course instance.
*/
Course.prototype.decode = function (encoding) {
  this.id = encoding.id;
  this.__root__ = encoding.__root__.map(this.decodePage, this);
};

Course.prototype.decodePage = function (page) {
  var p = new Page(page.courseId, page.id, page.title, null);

  page.items.forEach(function (item) {
    if (item.isPage) {
      p.addItem(this.decodePage(item));
    } else {
      p.addItem(this.decodeItem(item));
    }
  }, this);
  
  p.addResult(page.results);

  return p;
};

Course.prototype.decodeItem = function (item) {
  var i = new Item(item.courseId, item.id, item.title, null);

  for (var r in item.result) {
    var foo = {};
    foo[r] = item.result[r];
    i.addResult(foo);
  }

  return i;
};

export default Course;
