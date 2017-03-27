import Item from 'Course/Item';

function Page (course, id) {
  Item.call(this, course, id);
  this.items = [];
}

// Inherit Item
Page.prototype = Object.create(Item.prototype);
Page.prototype.constructor = Page;

/**
  @param {Item} item
*/
Page.prototype.addItem = function (item) {
  this.items.push(item);
};

export default Page;
