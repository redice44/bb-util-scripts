import ScannerPluginInterface from 'Scanner/Plugins/ScannerPluginInterface';

function NewWindowPlugin() {
  ScannerPluginInterface.call(this, 'New-Window', '#7d1c1c');
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

NewWindowPlugin.prototype.hasResults = function (item) {
  return item.getResults()[this.name] && item.getResults()[this.name].length > 0;
};

NewWindowPlugin.prototype.toggleResult = function (e) {
  var target = e.target;
  target = target.parentElement.parentElement.parentElement;
  this.getChild(`div.${this.name}`, 0, target).classList.toggle('hide');
};

NewWindowPlugin.prototype.getResults = function (item) {
  var results = item.getResults()[this.name];
  var resultsNode = this.makeNode(`div.hide.${this.name}.plugin-result > p + ul > li * ${results.length} > p`);
  var infoNode = this.getChild('p', 0, resultsNode);
  infoNode.appendChild(this.getErrorIcon());
  this.addText(this.resultText, infoNode);

  results.forEach(function (r, i) {
    var thisResult = this.getChild('p', 0, this.getChild('ul > li', i, resultsNode));
    this.addText(r.title, thisResult);
    this.__addActionLinks__(item, thisResult);
  }, this);

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
