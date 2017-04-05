import ScannerPluginInterface from 'Scanner/Plugins/ScannerPluginInterface';

function OldVivoPlugin() {
  ScannerPluginInterface.call(this, 'Old-Vivo', '#2c592c');
  this.resultText = 'Old Vivo Links:';
}

OldVivoPlugin.prototype = Object.create(ScannerPluginInterface.prototype);
OldVivoPlugin.prototype.constructor = OldVivoPlugin;

OldVivoPlugin.prototype.parse = function (dom) {
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

OldVivoPlugin.prototype.hasResults = function (item) {
  return item.getResults()[this.name] && item.getResults()[this.name].length > 0;
};

OldVivoPlugin.prototype.toggleResult = function (e) {
  var target = e.target;
  target = target.parentElement.parentElement.parentElement;
  this.getChild(`div.${this.name}`, 0, target).classList.toggle('hide');
};

OldVivoPlugin.prototype.getResults = function (item) {
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

OldVivoPlugin.prototype.__isValid__ = function (link) {
  var href = this.getUrl(link);
  return !href.includes('vivoId=');
};

OldVivoPlugin.prototype.__encode__ = function (link) {
  return {
    href: this.getUrl(link),
    text: link.innerText.trim() || 'Not a Text Link'
  };
};

export default OldVivoPlugin;
