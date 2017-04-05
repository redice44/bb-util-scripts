import ScannerPluginInterface from 'Scanner/Plugins/ScannerPluginInterface';

function ImageTextPlugin() {
  ScannerPluginInterface.call(this, 'Image-Text', '#7d1e9a');
  this.resultText = 'Images that do not have alt text:';
}

ImageTextPlugin.prototype = Object.create(ScannerPluginInterface.prototype);
ImageTextPlugin.prototype.constructor = ImageTextPlugin;

ImageTextPlugin.prototype.parse = function (dom) {
  var images = this.getChildren('img', dom);
  var result = {};
  result[this.name] = [];

  if (images) {
    images.forEach(function (image) {
      if (!this.__isValid__(image)) {
        result[this.name].push(this.__encode__(image));
      }
    }, this);
  }

  return result;
};

ImageTextPlugin.prototype.hasResults = function (item) {
  return item.getResults()[this.name] && item.getResults()[this.name].length > 0;
};

ImageTextPlugin.prototype.toggleResult = function (e) {
  var target = e.target;
  target = target.parentElement.parentElement.parentElement;
  this.getChild(`div.${this.name}`, 0, target).classList.toggle('hide');
};

ImageTextPlugin.prototype.getResults = function (item) {
  var results = item.getResults()[this.name];
  var resultsNode = this.makeNode(`div.hide.${this.name}.plugin-result > p + ul > li * ${results.length} > p`);
  var infoNode = this.getChild('p', 0, resultsNode);
  infoNode.appendChild(this.getErrorIcon());
  this.addText(this.resultText, infoNode);

  results.forEach(function (r, i) {
    var thisResult = this.getChild('p', 0, this.getChild('ul > li', i, resultsNode));
    // this.addText(r.src, thisResult);
    var imageNode = this.makeNode('a > img');
    this.setAttr({ href: r.src }, imageNode);
    this.setAttr({ src: r.src }, this.getChild('img', 0, imageNode));
    thisResult.appendChild(imageNode);
    this.__addActionLinks__(item, thisResult);
  }, this);

  return resultsNode;
};

/* Private */

ImageTextPlugin.prototype.__isValid__ = function (image) {
  var alt = this.getAttr('alt', image);
  var src = this.getAttr('src', image);
  var exlusions = [
    '/images/ci/',
    'BBLEARN'   // probably restrict this a bit more
  ];

  if (exlusions.every(function (exclusion) {
    return !src.includes(exclusion);
  })) {
    return !!alt;
  }

  return true;
};

ImageTextPlugin.prototype.__encode__ = function (link) {
  return {
    src: this.getAttr('src', link)
  };
};

export default ImageTextPlugin;
