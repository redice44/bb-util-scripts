import DOMInterface from 'dom';

function ScannerPlugin (name) {
  DOMInterface.call(this);
  this.name = name;
}

// Inherit DOMInterface
ScannerPlugin.prototype = Object.create(DOMInterface.prototype);
ScannerPlugin.prototype.constructor = ScannerPlugin;

export default ScannerPlugin;
