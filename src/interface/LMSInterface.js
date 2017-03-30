import DOMInterface from 'dom';

function LMSInterface (domain) {
  DOMInterface.call(this);
  this.domain = domain;
}

LMSInterface.prototype = Object.create(DOMInterface.prototype);
LMSInterface.prototype.constructor = LMSInterface;

/**
  @param {String} courseId - The ID of the course.
  @return {Promise.<Page[]>} - Array of Pages that are at the top level of the course.
*/
LMSInterface.prototype.getMainPage = function (courseId) {
  new Error('Override: LMSInterface.getMainPage()');
};

/**
  @param {Page} page - Page to get content for.
  @return {Promise.<Item[]>} - Array of Items found on the page.
*/
LMSInterface.prototype.getPage = function (page) {
  new Error('Override: LMSInterface.getPage()');
};

/**
  @param {Item} item - Item in which to find the content ID for.
  @return {String} - Item's content ID.
*/
LMSInterface.prototype.getContentId = function (item) {
  new Error('Override: LMSInterface.getContentId()');
};

export default LMSInterface;
