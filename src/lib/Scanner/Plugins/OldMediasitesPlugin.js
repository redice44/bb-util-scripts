import ScannerPluginInterface from 'Scanner/Plugins/ScannerPluginInterface';

function OldMediasitesPlugin() {
  ScannerPluginInterface.call(this, 'Old-Mediasites', '#373795');
  this.resultText = 'Old Mediasites Links:';
}

OldMediasitesPlugin.prototype = Object.create(ScannerPluginInterface.prototype);
OldMediasitesPlugin.prototype.constructor = OldMediasitesPlugin;

OldMediasitesPlugin.prototype.parse = function (dom) {
  var links = this.getChildren('a', dom);
  var result = {};
  result[this.name] = [];

  if (links) {
    links.forEach(function (link) {
      if (!this.__isValid__(link)) {
        result[this.name].push(this.__encode__(link));
      }
    }, this);
  }

  return result;
};

OldMediasitesPlugin.prototype.hasResults = function (item) {
  return item.getResults()[this.name] && item.getResults()[this.name].length > 0;
};

OldMediasitesPlugin.prototype.toggleResult = function (e) {
  var target = e.target;
  target = target.parentElement.parentElement.parentElement;
  this.getChild(`div.${this.name}`, 0, target).classList.toggle('hide');
};

OldMediasitesPlugin.prototype.getResults = function (item) {
  var results = item.getResults()[this.name];
  var resultsNode = this.makeNode(`div.hide.${this.name}.plugin-result > p + ul > li * ${results.length} > p`);
  var infoNode = this.getChild('p', 0, resultsNode);
  infoNode.appendChild(this.getErrorIcon());
  this.addText(this.resultText, infoNode);

  results.forEach(function (r, i) {
    var thisResult = this.getChild('p', 0, this.getChild('ul > li', i, resultsNode));
    this.addText(r.text, thisResult);
    this.__addActionLinks__(item, thisResult);
  }, this);

  return resultsNode;
};

/* Private */

OldMediasitesPlugin.prototype.__isValid__ = function (link) {
  var href = this.getUrl(link);
  return !href.includes('fiuonline.mediasite.com');
};

OldMediasitesPlugin.prototype.__encode__ = function (link) {
  return {
    href: this.getUrl(link),
    text: link.innerText.trim() || 'Not a Text Link'
  };
};

export default OldMediasitesPlugin;
