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
  this.LMSinterface.getCourse(this.id);
  // this.root = this.LMSinterface.getTopLevel(this.id);
  // this.root.forEach(function (page) {
  //   this.scanPage(page);
  // });
};

/**
  Deep scan of the page.
*/
Course.prototype.scanPage = function (page) {
  // get page from interface
  // iterate over items to see if they are pages
  // for the ones that are pages, update the reference to a Page
  // then recurse through it parsing that page. 
};

export default Course;
