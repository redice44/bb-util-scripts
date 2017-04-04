import Page from 'Course/Page';
import Item from 'Course/Item';

import itemIcon from 'Icons/itemIcon';
import folderClosedIcon from 'Icons/folderClosedIcon';
import folderOpenIcon from 'Icons/folderOpenIcon';

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
  var pageNode = this.buildPageDisplay();
  var heading = this.LMSInterface.getChild('header', 0, pageNode);
  var parent = this.LMSInterface.getChild('article', 0, pageNode);
  var folderOpen = folderOpenIcon();
  var folderClosed = folderClosedIcon();
  this.LMSInterface.addClasses('open-folder', folderOpen);
  this.LMSInterface.addClasses('close-folder', folderClosed);
  heading.appendChild(folderOpen);
  heading.appendChild(folderClosed);
  this.LMSInterface.addText(page.title, heading);

  page.getItems().forEach(function (item) {
    if (item instanceof Page) {
      parent.appendChild(this.displayPage(item));
    } else {
      parent.appendChild(this.displayItem(item));
    }
  }, this);

  var pageResults = page.getResults();

  this.plugins.forEach(function (plugin) {
    // console.log(page.getResults());
    if (plugin.hasResults(page)) {
      this.LMSInterface.getChild('header', 0, pageNode).appendChild(plugin.getErrorIcon());
    }
  }, this);

  return pageNode;
};

Course.prototype.displayItem = function (item) {
  var itemNode = this.buildItemDisplay();
  var heading = this.LMSInterface.getChild('header', 0, itemNode);
  var parent = this.LMSInterface.getChild('section', 0, itemNode);
  heading.appendChild(itemIcon());
  this.LMSInterface.addText(item.title, heading);

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

Course.prototype.buildPageDisplay = function () {
  var scaffold = this.LMSInterface.makeNode(`section.folder > header.collapse + article`);
  this.LMSInterface.getChild('header', 0, scaffold).addEventListener('click', this.toggleCollapse);
  return scaffold;
};

Course.prototype.buildItemDisplay = function () {
  return this.LMSInterface.makeNode(`section > header + section`);
};

// clean up
Course.prototype.toggleCollapse = function (e) {
  var target = e.target;
  target.classList.toggle('collapse');
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
        var pageResults = p.getResults();
        console.log('start of page depth parsing');
        console.log(pageResults);
        // iterate over the items that are pages
        p.getItems().forEach(function (item) {
          // Run all plugins
          that.plugins.forEach(function (plugin) {
            item.addResult(plugin.parse(item.getDom()));
            var pluginName = plugin.getName();
            if (plugin.hasResults(item)) {
              console.log('item has results');
              if (pageResults[pluginName] && pageResults[pluginName].length > 0) {
                console.log('adding to existing array');
                pageResults[pluginName].push(item.id);
              } else {
                console.log('creating new array');
                pageResults[pluginName] = [item.id];
              }
              console.log(p.getResults());
            }
          });

          p.addResult(pageResults);
          console.log('final results');
          console.log(p.getResults());

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
  p.links = page.getLinks();
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
  i.links = item.getLinks();
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
  p.addLink(page.links);

  return p;
};

Course.prototype.decodeItem = function (item) {
  var i = new Item(item.courseId, item.id, item.title, null);

  for (var r in item.result) {
    var foo = {};
    foo[r] = item.result[r];
    i.addResult(foo);
  }

  i.addLink(item.links);

  return i;
};

export default Course;
