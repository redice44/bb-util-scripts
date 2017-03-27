import Page from 'Course/Page';

function Course (id, LMSinterface) {
  this.id = id;
  this.root = null;
  this.LMSinterface = LMSinterface;
}

/**
  Scans all top level pages
*/
Course.prototype.scan = function () {
  // get course dom
  var that = this;
  var menuLinks = this.LMSinterface.getTopLevel(this.id);
  menuLinks
    .then(function (pages) {
      console.log('pages:');
      console.log(pages);
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
        if (item instanceof Page) {
          // console.log('page');
          this.scanPage(item);
        } else {
          // console.log('item');
        }
      }, that);
    })
    .catch(function (err) {
      console.log(err);
    });
};

export default Course;
