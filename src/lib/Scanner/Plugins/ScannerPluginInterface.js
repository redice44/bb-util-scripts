import DOMInterface from 'dom';
import errorIcon from 'Icons/errorIcon';
import warningIcon from 'Icons/warningIcon';
import newWindowIcon from 'Icons/newWindowIcon';
import editIcon from 'Icons/editIcon';

function ScannerPluginInterface (name, color) {
  DOMInterface.call(this);
  this.name = name;
  this.color = color;
}

ScannerPluginInterface.prototype = Object.create(DOMInterface.prototype);
ScannerPluginInterface.prototype.constructor = ScannerPluginInterface;

/**
  @param {DOM Node} dom - DOM Node to parse
*/
ScannerPluginInterface.prototype.parse = function (dom) {
  new Error('Override: ScannerPluginInterface.parse()');
};

/**
  @param {Item} item - Item to display results for.

  @return {DOM Node} - DOM Node of the results.
*/
ScannerPluginInterface.prototype.getResults = function (item) {
  new Error('Override: ScannerPluginInterface.getResults()');
};

ScannerPluginInterface.prototype.__addActionLinks__ = function (item, result) {
  var newWindowNode = this.makeNode('a');
  this.setAttr({ href: item.getLinks().Content, target: '_blank' }, newWindowNode);
  newWindowNode.appendChild(newWindowIcon());

  var editNode = this.makeNode('a');
  this.setAttr({ href: item.getLinks().Edit, target: '_blank' }, editNode);
  editNode.appendChild(editIcon());

  result.appendChild(newWindowNode);
  result.appendChild(editNode);
};

ScannerPluginInterface.prototype.getName = function () {
  return this.name;
};

ScannerPluginInterface.prototype.getWarningIcon = function () {
  return warningIcon(this.color);
};

ScannerPluginInterface.prototype.getErrorIcon = function () {
  return errorIcon(this.color);
};

export default  ScannerPluginInterface;
