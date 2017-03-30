function DOMInterface () {
}

DOMInterface.prototype.setAttr = function (attributes) {

};

DOMInterface.prototype.makeSvg = function (emmetString) {
  this.__makeNode__(emmetString, function (node) {
    return document.createElementNS("http://www.w3.org/2000/svg", node);
  });
};

DOMInterface.prototype.makeNode = function (emmetString) {
  this.__makeNode__(emmetString, function (node) {
    return document.createElement(node);
  });
};

DOMInterface.prototype.__makeNode__ = function (emmetString, create) {
  var ops = {
    '>': 1,
    '+': 2,
    //'^',
    //'*'
  };
  
  var tokens = tokenize(emmetString);
  console.log(tokens);
  var opStack = [];
  var nodeStack = [];
  var dom = null;
  while (tokens.length > 0) {
    var t = tokens.shift();
    // console.log(tokens);
    var isOp = null;
    var op;
    for (op in ops) {
      if (t === op) {
        isOp = t;
      }
    }
    if (isOp) {
      // Opperator
      // Peek to see if you can add to op stack
      if (opStack.length > 0) {
        // console.log(ops[opStack[opStack.length - 1]], ops[isOp])
        if (ops[opStack[opStack.length - 1]] > ops[isOp]) {
          opStack.push(isOp);
          console.log(`Adding ${isOp} to opStack`);
        } else {
          // evaluate
          nodeStack.push(this.evaluateNodeStack(opStack, nodeStack));
          opStack.push(isOp)
          console.log(`Adding ${isOp} to opStack post eval`);
          console.log(`Adding ${nodeStack[nodeStack.length - 1]} to nodeStack`);
        }
      } else {
        opStack.push(isOp);
        console.log(`Adding ${isOp} to opStack`);
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
      nodeStack.push(create(node));
      console.log(`adding ${nodeStack[nodeStack.length - 1]} to nodeStack`);
    }
  }

  return this.evaluateNodeStack(opStack, nodeStack);
};

DOMInterface.prototype.evaluateNodeStack = function (opStack, nodeStack) {
  // console.log(opStack, nodeStack);
  console.log('Evaluating stack');
  var n1;
  var n2;
  var op;
  while (opStack.length > 0) {
    n1 = nodeStack.pop();
    op = opStack.pop();
    n2 = nodeStack.pop();
    switch (op) {
      case '>':
        n2.appendChild(n1);
        nodeStack.push(n2);
        break;
      case '+':
        var lastChild = n2;
        while (lastChild.children.length > 0) {
          lastChild = lastChild.children[lastChild.children.length - 1];
        }
        lastChild.parentElement.appendChild(n1);
        nodeStack.push(n2);
        break;
      case '^':
        break;
      case '*':
        break;
      default: 
    }
  }

  return nodeStack.pop();
};

function tokenize (emmetString) {
  // Handle text spaces later
  return emmetString.split(' ');
}

/**
  @param id: ID of the DOM node to return.
  @return: DOM node.
*/
DOMInterface.prototype.getId = function (dom, id) {
  if (!dom) {
    return null;
  }
  return dom.getElementById(id);
};

/**
  @param dom: The DOM node 
  @param q: (Optional) query string. If not provided, then all children are returned.
  @return: Array of DOM nodes
*/
DOMInterface.prototype.getChildren = function (dom, q) {
  if (!dom) {
    return null;
  }
  if (q) {
    return toArray(dom.querySelectorAll(q));
  } else {
    return toArray(dom.children);
  }
};

/**
  @param dom: The DOM node
  @param i: (Optional) index of the child. If not provided, then first child is returned.
  @param q: (Optional) query string. 
  @return: DOM node
*/
DOMInterface.prototype.getChild = function (dom, q, i) {
  if (!dom) {
    return null;
  }

  i = i || 0;

  var children = this.getChildren(dom, q);

  if (i === 0 && (!children || children.length === 0)) {
    return null;
  }
  return children[i];
};

DOMInterface.prototype.getUrl = function (link) {
  if (link) {
    return link.getAttribute('href');
  }
  return null;
};

/*
 * Helpers
*/

function toArray(arrayCollection) {
  var foo = [];
  var i = 0;

  for (; i < arrayCollection.length; i++) {
    foo.push(arrayCollection[i]);
  }

  return foo;
}

export default DOMInterface;
