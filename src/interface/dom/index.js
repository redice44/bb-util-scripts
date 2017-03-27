function DOMInterface () {
  this.doc = null;
}

DOMInterface.prototype.updateDoc = function (doc) {
  this.doc = doc;
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
