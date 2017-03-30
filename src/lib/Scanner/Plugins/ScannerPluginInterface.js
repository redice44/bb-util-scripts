import DOMInterface from 'dom';
import errorIcon from 'Icons/errorIcon';
import warningIcon from 'Icons/warningIcon';

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

ScannerPluginInterface.prototype.getWarningIcon = function () {
  return warningIcon(this.color);
};

ScannerPluginInterface.prototype.getErrorIcon = function () {
  return errorIcon(this.color);
};

export default  ScannerPluginInterface;
