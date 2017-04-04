function Item (courseId, id, title, dom) {
  this.courseId = courseId;
  this.id = id;
  this.title = title;
  this.__results__ = {};
  this.__dom__ = dom;
}

Item.prototype.getDom = function () {
  return this.__dom__;
};

Item.prototype.addResult = function (result) {
  this.__results__ = Object.assign({}, this.__results__, result);
}; 

Item.prototype.getResults = function () {
  return Object.assign({}, this.__results__);
};

export default Item;
