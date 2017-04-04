function Item (courseId, id, title, dom) {
  this.courseId = courseId;
  this.id = id;
  this.title = title;
  this.__links__ = {};
  this.__results__ = {};
  this.__dom__ = dom;
}

Item.prototype.getDom = function () {
  return this.__dom__;
};

Item.prototype.addLink = function (link) {
  this.__links__ = Object.assign({}, this.__links__, link);
};

Item.prototype.getLinks = function () {
  return Object.assign({}, this.__links__);
};

Item.prototype.addResult = function (result) {
  this.__results__ = Object.assign({}, this.__results__, result);
}; 

Item.prototype.getResults = function () {
  return Object.assign({}, this.__results__);
};

export default Item;
