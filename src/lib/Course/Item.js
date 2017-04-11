function Item (courseId, id, title, dom) {
  this.courseId = courseId;
  this.id = id;
  this.title = title;
  this.__links__ = {};
  this.__results__ = {};
  this.__dom__ = dom;
  this.__editContent__ = null;
}

Item.prototype.getEditContent = function () {
  return Object.assign({}, this.__editContent__);
};

Item.prototype.setEditContent = function (results) {
  this.__editContent__ = Object.assign({}, results);
};

Item.prototype.getDom = function () {
  return this.__dom__.cloneNode(true);
};

Item.prototype.setDom = function (dom) {
  this.__dom__ = dom.cloneNode(true);
};

Item.prototype.addLink = function (link) {
  this.__links__ = Object.assign({}, this.__links__, link);
};

Item.prototype.getLinks = function () {
  return Object.assign({}, this.__links__);
};

Item.prototype.addResult = function (result) {
  this.__results__ = Object.assign({}, result, this.__results__);
}; 

Item.prototype.getResults = function () {
  return Object.assign({}, this.__results__);
};

export default Item;
