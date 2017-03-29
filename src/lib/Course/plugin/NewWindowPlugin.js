import DOMInterface from 'dom';
import ScannerPlugin from 'Course/plugin/ScannerPlugin';

function NewWindowPlugin () {
  ScannerPlugin.call(this, 'NewWindow');
}

// Inherit DOMInterface
NewWindowPlugin.prototype = Object.create(ScannerPlugin.prototype);
NewWindowPlugin.prototype.constructor = NewWindowPlugin;

NewWindowPlugin.prototype.encode = function (link) {
  return {
    href: this.getUrl(link),
    title: link.innerText
  };
};

/**
  @param {DOM node} dom 
  @return {Object} Results of the plugin to be joined with the item's results.
*/
NewWindowPlugin.prototype.parse = function (dom) {
  var links = this.getChildren(dom, 'a');
  var result = {};
  result[this.name] = [];

  if (links) {
    links.forEach(function (link) {
      if (this.validLink(link)) {
        // console.log('valid link', this.encode(link));
      } else {
        console.log('invalid link', this.encode(link));
        result[this.name].push(this.encode(link));
      }
    }, this);
  }

  return result;
};

/**
  @param {Object} result - Results from the parse
  @return {DOM node}
*/
NewWindowPlugin.prototype.displayDOM = function (result) {
  var node = this.makeNode('p', {
    text: 'hello'
  });

  return node;
};

NewWindowPlugin.prototype.validLink = function (link) {
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

export default NewWindowPlugin;
