import Item from 'Course/Item';

function Page (course, id, title, dom) {
  Item.call(this, course, id, title, dom);
  this.__items__ = [];
}

// Inherit Item
Page.prototype = Object.create(Item.prototype);
Page.prototype.constructor = Page;

/**
  @param {Item} item
*/
Page.prototype.addItem = function (item) {
  this.__items__.push(item);
};

Page.prototype.addItems = function (items) {
  this.__items__ = this.__items__.concat(items);
};

Page.prototype.getItems = function () {
  return this.__items__;
};

export default Page;
