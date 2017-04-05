function DOMInterface () {
  this.__activeDom__ = null;
}
/**
  @param {DOM Node} dom - The DOM Node to set as the active DOM Node for applicable functions.
*/
DOMInterface.prototype.setActiveDom = function (dom) {
  this.__activeDom__ = dom;
};

/**
  Sets the active DOM Node to null.
*/
DOMInterface.prototype.clearActiveDom = function () {
  this.__activeDom__ = null;
};


DOMInterface.prototype.useDocument = function () {
  return document;
};

/**********************************
  Set of Mutatable DOM functions
**********************************/

DOMInterface.prototype.addText = function (text, dom, updateActiveDom) {
  var domNode = this.chainDom(dom, updateActiveDom);

  if (!domNode) {
    return null;
  }

  domNode.appendChild(document.createTextNode(text));

  return domNode.cloneNode(true);
};

DOMInterface.prototype.replaceText = function (text, dom, updateActiveDom) {
  var domNode = this.chainDom(dom, updateActiveDom);

  if (!domNode) {
    return null;
  }

  domNode.innerText = text;

  return domNode.cloneNode(true);
};

/**
  Sets a set of attributes to the DOM Node.
  Part of the set of Mutatable DOM functions.

  @param {Object} attributes - The set of attributes to apply to the DOM Node.
  @param {DOM Node} dom - (Optional) The DOM Node to apply the attributes to.
  @param {boolean} updateActiveDom - (Optional) If this dom should update the active DOM Node.

  @return {DOM Node} - DOM Node with the new attributes. 
*/
DOMInterface.prototype.setAttr = function (attributes, dom, updateActiveDom) {
  var attr;
  var domNode = this.chainDom(dom, updateActiveDom);

  if (!domNode) {
    return null;
  }

  for (attr in attributes) {
    domNode.setAttribute(attr, attributes[attr]);
  }

  return domNode.cloneNode(true);
};

DOMInterface.prototype.setStyle = function (styles, dom, updateActiveDom) {
  var domNode = this.chainDom(dom, updateActiveDom);
  var style;
  var styleStr = '';
  if (!domNode) {
    return null;
  }

  for (style in styles) {
    // styleStr += `${style}: ${styles[style]};`;
    domNode.style[style] = styles[style];
  }
  // console.log(styleStr);
  // domNode.setAttribute('style', styleStr);

  return domNode.cloneNode(true);
};

/**
  Adds the classes to the DOM Node.
  Part of the set of Mutatable DOM functions.

  @param {String[]} classes - Array of CSS classes to apply to the dom.
  @param {DOM Node} dom - (Optional) The DOM Node to apply the attributes to.
  @param {boolean} updateActiveDom - (Optional) If this dom should update the active DOM Node.

  @return {DOM Node} - DOM Node with the new attributes. 
*/
DOMInterface.prototype.addClasses = function (classes, dom, updateActiveDom) {
  var domNode = this.chainDom(dom, updateActiveDom);

  if (!domNode) {
    return null;
  }

  if (classes instanceof Array) {
    classes.forEach(function (c) {
      domNode.classList.add(c);
    });
  } else {
    domNode.classList.add(classes);
  }
  return domNode.cloneNode(true);
};

/**
  Gets the DOM Node with the id.
  Part of the set of Mutatable DOM functions.

  @param {String} id - ID of the DOM Node to return.
  @param {DOM Node} dom - (Optional) The DOM Node to apply the attributes to.
  @param {boolean} updateActiveDom - (Optional) If this dom should update the active DOM Node.

  @return {DOM Node}
*/
DOMInterface.prototype.getId = function (id, dom, updateActiveDom) {
  var domNode = this.chainDom(dom, updateActiveDom);

  if (!domNode) {
    return null;
  }

  return domNode.getElementById(id);
};

/**
  Gets the children of the DOM Node.
  Part of the set of Mutatable DOM functions.

  @param {String} q - (Optional) Query string. If not provided, then all children are returned.
  @param {DOM Node} dom - (Optional) The DOM Node to apply the attributes to.
  @param {boolean} updateActiveDom - (Optional) If this dom should update the active DOM Node.

  @return: {DOM Node[]}
*/
DOMInterface.prototype.getChildren = function (q, dom, updateActiveDom) {
  var domNode = this.chainDom(dom, updateActiveDom);

  if (!domNode) {
    return null;
  }

  if (q) {
    return toArray(domNode.querySelectorAll(q));
  } else {
    return toArray(domNode.children);
  }
};

/**
  Gets a child of the DOM Node.
  Part of the set of Mutatable DOM functions.

  @param {String} q - (Optional) Query string. If not provided, then all children are returned.
  @param {Int} i - (Optional) index of the child. If not provided, then first child is returned.
  @param {DOM Node} dom - (Optional) The DOM Node to apply the attributes to.
  @param {boolean} updateActiveDom - (Optional) If this dom should update the active DOM Node.
  @return: DOM node
*/
DOMInterface.prototype.getChild = function (q, i, dom, updateActiveDom) {
  var children;
  var index;
  var domNode = this.chainDom(dom, updateActiveDom);
  if (!domNode) {
    return null;
  }

  index = i || 0;
  children = this.getChildren(q, domNode);

  if (index === 0 && (!children || children.length === 0)) {
    return null;
  }
  return children[index];
};

DOMInterface.prototype.deleteChild = function (q, i, dom, updateActiveDom) {
  var children;
  var index;
  var domNode = this.chainDom(dom, updateActiveDom);
  if (!domNode) {
    return null;
  }

  index = i || 0;
  children = this.getChildren(q, domNode);

  if (index === 0 && (!children || children.length === 0)) {
    return null;
  }
  children[index].remove();
  return domNode.cloneNode(true);
};

/**
  @private
  Private helper for the Mutatable DOM functions.

  @param {DOM Node} dom - Passed DOM Node to use.
  @param {boolean} updateActiveDom - If this dom should update the active DOM Node.
*/
DOMInterface.prototype.chainDom = function (dom, updateActiveDom) {
  if (updateActiveDom) {
    this.setActiveDom(dom);
  }

  return dom || this.__activeDom__;
};


/*********************************
  Set of DOM Creation functions
*********************************/


/**
  Builds an SVG DOM Node from an Emmet styled string. See https://emmet.io/ for more details.
  Only supports >, +, and * currently.

  @param {String} emmetString - Emmet styled string.

  @return {DOM Node}
*/
DOMInterface.prototype.makeSvg = function (emmetString) {
  return this.__makeNode__(emmetString, function (node) {
    return document.createElementNS("http://www.w3.org/2000/svg", node);
  });
};

/**
  Builds a DOM Node from an Emmet styled string. See https://emmet.io/ for more details.
  Only supports >, +, and * currently.

  @param {String} emmetString - Emmet styled string.

  @return {DOM Node}
*/
DOMInterface.prototype.makeNode = function (emmetString) {
  return this.__makeNode__(emmetString, function (node) {
    return document.createElement(node);
  });
};

/**
  @private
  Private helper to make DOM Nodes.

  @param {String} emmetString - Emmet styled string.
  @param {function} create - Function to return a DOM Node
*/
DOMInterface.prototype.__makeNode__ = function (emmetString, create) {
  var ops = {
    '>': 1,
    '+': 2,
    //'^',
    '*': 0
  };
  
  var tokens = tokenize(emmetString);
  // console.log(tokens);
  var opStack = [];
  var nodeStack = [];
  var dom = null;
  while (tokens.length > 0) {
    var t = tokens.shift();
    // console.log(`token: ${t}`);
    var isOp = null;
    var op;
    for (op in ops) {
      if (t === op) {
        isOp = t;
      }
    }
    // Opperator
    if (isOp) {
      if (opStack.length > 0) {
        if (isOp === '*') {
          // Is multiplication op
          // console.log('Multiplying');
          var count = parseInt(tokens.shift());
          var nodes = [];
          var temp = nodeStack.pop();
          var i;
          for (i = 0; i < count; i++) {
            nodes.push(temp.cloneNode(true));
            // nodeStack.push(temp.cloneNode(true));
            // opStack.push('+');
          }
          // nodeStack.push(temp.cloneNode(true));
          nodeStack.push(nodes);
        } else if (opStack.length === 0 || ops[opStack[opStack.length - 1]] <= ops[isOp]) {
          // Peek to see if you can add to op stack
          opStack.push(isOp);
          // console.log(`Adding ${isOp} to opStack`);
        } else {
          // evaluate
          nodeStack.push(this.__evaluateNodeStack__(opStack, nodeStack));
          opStack.push(isOp);
          // console.log(`Adding ${isOp} to opStack post eval`);
          // console.log(`Adding ${nodeStack[nodeStack.length - 1]} to nodeStack`);
        }
      } else {
        opStack.push(isOp);
        // console.log(`Adding ${isOp} to opStack`);
      }
    } else {
      // Node
      var node = t.split('#');
      var id = null;
      var classes = [];
      if (node.length > 1) {
        classes = node[1].split('.');
        id = classes[0];
        classes.shift();
        node = node[0];
      } else {
        classes = node[0].split('.');
        node = classes[0];
        classes.shift();
      }

      // generate node with ID and classes
      // add to node stack
      if (node.includes('{')) {
        var n = nodeStack.pop();
        n.append(this.__makeTextNode__(node));
        this.setActiveDom(n);
      } else {
        this.setActiveDom(create(node));
        if (id) {
          this.setAttr({"id": id});
        }
        if (classes.length > 0) {
          this.addClasses(classes);
        }
      }
      nodeStack.push(this.__activeDom__.cloneNode(true));
      this.clearActiveDom();
      // console.log(`adding ${nodeStack[nodeStack.length - 1]} to nodeStack`);
    }
  }

  return this.__evaluateNodeStack__(opStack, nodeStack);
};

/**
  @private
  Private helper to join DOM Nodes

  @param {String[]} opStack - Stack of opperators
  @param {DOM Node[]} nodeStack - Stack of DOM Nodes

  @return {DOM Node} - The resulting DOM Node after evaluating the stacks.
*/
DOMInterface.prototype.__evaluateNodeStack__ = function (opStack, nodeStack) {
  // console.log('Evaluating stack');
  // console.log(opStack, nodeStack);
  var n1;
  var n2;
  var op;

  while (opStack.length > 0) {
    n1 = nodeStack.pop();
    op = opStack.pop();
    n2 = nodeStack.pop();
    // console.log('n1', n1);
    // console.log(`op: ${op}`);
    // console.log('n2', n2);
    switch (op) {
      case '>':
        if (n2 instanceof Array) {
          // console.log('n2 is array', n1, n2);
          n2 = n2.map(function (item) {
            item.appendChild(n1);
            return item.cloneNode(true);
          });
        } else if (n1 instanceof Array) {
          // console.log('n1 is array', n1, n2);
          var lastChild = n2;
          while (lastChild.children.length > 0) {
            lastChild = lastChild.children[lastChild.children.length - 1];
          }
          n1.forEach(function (item) {
            lastChild.appendChild(item.cloneNode(true));
          });
        } else {
          // console.log('neither are arrays', n1, n2);
          // n2.appendChild(n1);
          var lastChild = n2;
          while (lastChild.children.length > 0) {
            lastChild = lastChild.children[lastChild.children.length - 1];
          }
          // console.log('last child');
          // console.log(lastChild);

          lastChild.append(n1);
        }
        nodeStack.push(n2);
        break;
      case '+':
        // var lastChild = n2;
        // if (lastChild.parentElement) {
        //   console.log('has a parent');
        //   while (lastChild.children.length > 0) {
        //     lastChild = lastChild.children[lastChild.children.length - 1];
        //   }
        //   if (n1 instanceof Array) {
        //     n1.forEach(function (item) {
        //       lastChild.parentElement.appendChild(item);
        //     });
        //   } else {
        //     lastChild.parentElement.appendChild(n1);
        //   }
        //   nodeStack.push(n2);          
        // } else {
        //   console.log('no parent');
        //   if (n1 instanceof Array) {
        //     nodeStack.push(n1.push(n2));
        //   } else {
        //     nodeStack.push([n2, n1]);
        //   }
        // }
        if (n2 instanceof Array) {
          if (n1 instanceof Array) {
            n1.forEach(function (item) {
              n2.push(item);
            });
            nodeStack.push(n2);
          } else {
            n2.push(n1);
            nodeStack.push(n2);
          }
        } else if (n1 instanceof Array) {
          n1.unshift(n2);
          nodeStack.push(n1);
        } else {
          nodeStack.push([n2, n1]);
        }
        break;
      case '^':
        break;
      default: 
    }
  }

  // console.log('result', nodeStack[nodeStack.length - 1]);
  return nodeStack.pop();
};

DOMInterface.prototype.__makeTextNode__ = function (text) {
  return document.createTextNode(text.substr(1, text.length-2).trim());
};


/********************************
  Set of DOM Utility functions
********************************/


DOMInterface.prototype.getUrl = function (link) {
  if (link) {
    return link.getAttribute('href');
  }
  return null;
};

DOMInterface.prototype.getAttr = function (attr, dom) {
  return dom.getAttribute(attr);
};

/**
  @param {String} url - URL to get the parameters from. If empty: uses current document url.
  @return {Object} - key:value from the parameters.
*/
DOMInterface.prototype.getParameters = function (url) {
  url = url || document.URL;
  var parameters = {};
  var parseParams = url.split('?')[1];
  parseParams = parseParams.split('&');
  parseParams = parseParams.forEach(function (pair) {
    var temp = {};
    var splitPair = pair.split('=');
    temp[splitPair[0]] = splitPair[1];
    parameters = Object.assign({}, temp, parameters);
  });

  return parameters;
};



/****************************
  Set of Helper functions
*****************************/


function tokenize (emmetString) {
  // Handle text spaces later
  var tokens = emmetString.split(' ');
  for (var i = 0; i < tokens.length; i++) {
    if (tokens[i].includes('{')) {
      // console.log(`Found starting token ${tokens[i]}`);
      while (tokens.length > i + 1 &&
        !tokens[i].includes('}') &&
        !tokens[i+1].includes('}')) {
          // console.log(`Joining next token ${tokens[i+1]}`);
          tokens[i] = `${tokens[i]} ${tokens.splice(i+1, 1)[0].trim()}`;
          // console.log(`Updated text token ${tokens[i]}`);
      }
      if (tokens.length > i + 1 && !tokens[i].includes('}')) {
        // Add the last } token
        // console.log(`Joining last token ${tokens[i+1]}`);
        tokens[i] = `${tokens[i]} ${tokens.splice(i+1, 1)[0].trim()}`;
      }
      tokens[i] = tokens[i].trim();
    }
  }
  return tokens;
}

function toArray (arrayCollection) {
  var foo = [];
  var i = 0;

  for (; i < arrayCollection.length; i++) {
    foo.push(arrayCollection[i]);
  }

  return foo;
}

export default DOMInterface;
