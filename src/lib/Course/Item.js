function Item (course, id, dom) {
  this.courseId = course;
  this.id = id;
  this.result = {};
  this.__dom__ = dom;
}

Item.prototype.getDom = function () {
  return this.__dom__;
};

Item.prototype.addResult = function (result) {
  this.result = Object.assign({}, result);
};

export default Item;
