import DOMInterface from 'dom';

function Modal (name) {
  DOMInterface.call(this);
  this.__prefix__ = 'modal-';
  this.name = name;
  this.modal = null;
  this.display = null;

  this.makeModal();
}

Modal.prototype = Object.create(DOMInterface.prototype);
Modal.prototype.constructor = Modal;

Modal.prototype.makeModal = function () {
  this.modal = this.makeNode(`div#${this.__prefix__}${this.name}.modal > div.bg + div.display`);
  this.display = this.getChild('.display', 0, this.modal);
  this.getChild('.bg', 0, this.modal).addEventListener('click', this.hide.bind(this));
};

Modal.prototype.getModal = function () {
  return this.modal;
};

Modal.prototype.updateDisplay = function (node) {
  this.clearDisplay();
  this.display.appendChild(node);
};

Modal.prototype.clearDisplay = function () {
  var children = this.getChildren('', this.display);
  if (children) {
    children.forEach(function (child) {
      child.remove();
    });
  }
};

Modal.prototype.hide = function () {
  this.setStyle({ display: 'none' }, this.modal);
};

Modal.prototype.show = function () {
  this.setStyle({ display: 'flex' }, this.modal);
};

export default Modal;
