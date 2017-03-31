function Item (course, id, title, dom) {
  this.courseId = course;
  this.id = id;
  this.title = title;
  this.__results__ = {};
  this.__dom__ = dom;
}

Item.prototype.getDom = function () {
  return this.__dom__;
};

Item.prototype.addResult = function (result) {
  this.__results__ = Object.assign({}, result);
};

Item.prototype.getResults = function () {
  return this.__results__;
}

export default Item;
