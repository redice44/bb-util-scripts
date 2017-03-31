import ScannerPluginInterface from 'Scanner/Plugins/ScannerPluginInterface';

function NewWindowPlugin() {
  ScannerPluginInterface.call(this, 'New Window', '#7d1c1c');
  this.resultText = 'Links that do not open in a new window:';
}

NewWindowPlugin.prototype = Object.create(ScannerPluginInterface.prototype);
NewWindowPlugin.prototype.constructor = NewWindowPlugin;

NewWindowPlugin.prototype.parse = function (dom) {
  var links = this.getChildren('a', dom);
  var result = {};
  result[this.name] = [];

  if (links) {
    links.forEach(function (link) {
      if (!this.__validLink__(link)) {
        result[this.name].push(this.__encode__(link));
      }
    }, this);
  }

  return result;
};

NewWindowPlugin.prototype.getResults = function (item) {
  var results = item.getResults()[this.name];
  var resultsNode = this.makeNode(`div > p ${this.resultText} + ul > li * ${results.length} > p`);
  // this.addText(this.resultText, this.getChild('p', 0, resultsNode));

  results.forEach(function (r, i) {
    this.addText(r.title, this.getChild('p', 0, this.getChild('ul > li', i, resultsNode)));
  }, this);
  // update dom interface to add content to nodes, like text.

  return resultsNode;
};

/* Private */

NewWindowPlugin.prototype.__validLink__ = function (link) {
  var target = link.getAttribute('target');
  var href = this.getUrl(link);
  var exclusions = [
    new RegExp(/^#/g),
    new RegExp(/^javascript/g),
    new RegExp(/fiu\.blackboard\.com/g),
    new RegExp(/^\/webapps\//g)
  ];

  if (!exclusions.every(function (regex) {
    return !href.match(regex);
  })) {
    // Ignore Blackboard links
    return true;
  }
  return target && target.trim().toLowerCase() === '_blank';
};

NewWindowPlugin.prototype.__encode__ = function (link) {
  return {
    href: this.getUrl(link),
    title: link.innerText
  };
};

export default NewWindowPlugin;
