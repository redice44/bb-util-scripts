// ==UserScript==
// @name         Blackboard Editor HTML Templates
// @namespace    https://github.com/redice44
// @source       https://github.com/redice44/bb-util-scripts/dist/chrome/icon-templates.user.js
// @updateURL    https://github.com/redice44/bb-util-scripts/dist/chrome/icon-templates.user.js
// @supportURL   https://github.com/redice44/bb-util-scripts/issues
// @version      0.1.0
// @description  Adds two selectbox (dropdown) menus to all Blackboard TinyMCE editors with pre-defined HTML templates.
// @author       Daniel Victoriano <victoriano518@gmail.com>
// @match        https://fiu.blackboard.com/*

// @run-at       document-idle
// @noframes

// ==/UserScript==


/******/ (function(modules) { // webpackBootstrap
/******/  // The module cache
/******/  var installedModules = {};
/******/
/******/  // The require function
/******/  function __webpack_require__(moduleId) {
/******/
/******/    // Check if module is in cache
/******/    if(installedModules[moduleId]) {
/******/      return installedModules[moduleId].exports;
/******/    }
/******/    // Create a new module (and put it into the cache)
/******/    var module = installedModules[moduleId] = {
/******/      i: moduleId,
/******/      l: false,
/******/      exports: {}
/******/    };
/******/
/******/    // Execute the module function
/******/    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/    // Flag the module as loaded
/******/    module.l = true;
/******/
/******/    // Return the exports of the module
/******/    return module.exports;
/******/  }
/******/
/******/
/******/  // expose the modules object (__webpack_modules__)
/******/  __webpack_require__.m = modules;
/******/
/******/  // expose the module cache
/******/  __webpack_require__.c = installedModules;
/******/
/******/  // identity function for calling harmony imports with the correct context
/******/  __webpack_require__.i = function(value) { return value; };
/******/
/******/  // define getter function for harmony exports
/******/  __webpack_require__.d = function(exports, name, getter) {
/******/    if(!__webpack_require__.o(exports, name)) {
/******/      Object.defineProperty(exports, name, {
/******/        configurable: false,
/******/        enumerable: true,
/******/        get: getter
/******/      });
/******/    }
/******/  };
/******/
/******/  // getDefaultExport function for compatibility with non-harmony modules
/******/  __webpack_require__.n = function(module) {
/******/    var getter = module && module.__esModule ?
/******/      function getDefault() { return module['default']; } :
/******/      function getModuleExports() { return module; };
/******/    __webpack_require__.d(getter, 'a', getter);
/******/    return getter;
/******/  };
/******/
/******/  // Object.prototype.hasOwnProperty.call
/******/  __webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/  // __webpack_public_path__
/******/  __webpack_require__.p = "";
/******/
/******/  // Load entry module and return exports
/******/  return __webpack_require__(__webpack_require__.s = 45);
/******/ })
/************************************************************************/
/******/ ({

/***/ 1:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
function DOMInterface () {
  this.__activeDom__ = null;
  this.__parser__ = new DOMParser();
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

DOMInterface.prototype.stringToDom = function (str) {
  return this.__parser__.parseFromString(str, "text/html");
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

DOMInterface.prototype.removeClasses = function (classes, dom, updateActiveDom) {
  var domNode = this.chainDom(dom, updateActiveDom);

  if (!domNode) {
    return null;
  }

  if (classes instanceof Array) {
    classes.forEach(function (c) {
      domNode.classList.remove(c);
    });
  } else {
    domNode.classList.remove(classes);
  }
  return domNode.cloneNode(true);
};

DOMInterface.prototype.toggleClasses = function (classes, value, dom, updateActiveDom) {
  var domNode = this.chainDom(dom, updateActiveDom);

  if (!domNode) {
    return null;
  }

  if (classes instanceof Array) {
    classes.forEach(function (c) {
      if (value !== null) {      
        domNode.classList.toggle(c, value);
      } else {
        domNode.classList.toggle(c);
      }
    });
  } else {
    if (value !== null) {
      domNode.classList.toggle(classes, value);
    } else {
      domNode.classList.toggle(classes);
    }

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

/* harmony default export */ __webpack_exports__["a"] = (DOMInterface);


/***/ }),

/***/ 21:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
function TinymceInterface() {
}

// Fires event with editor details as editors are rendered (async)
TinymceInterface.prototype.getInstances = function () {
  try {
    return tinyMCE.onAddEditor.add( function(mgr,ed) {
      ed.onPostRender.add( function(ed, cm) {
        var event = new CustomEvent('EditorAdded', {'detail': ed});
        return document.dispatchEvent(event);
      });
    });
  } catch(e) {
    console.log('error', e);
  }
};

// Gets the HTML content of editor instance
TinymceInterface.prototype.getContent = function (instance) {
  return instance.getContent();
};

// Sets the HTML content of editor instance
TinymceInterface.prototype.setContent = function (instance, content) {
  instance.setContent(content, {format: 'raw'});
};

// NOTE: Debug undefined error
// TinymceInterface.prototype.setHTML = function (instance, target, content) {
//   instance.DOM.setHTML(target, content);
// };

// Gets the HTML content of second column in editor instance
TinymceInterface.prototype.getColumn2 = function (instance, domId) {
  if ( instance.dom.get(domId) ) {
    return instance.dom.get(domId);
  } else {
    return false;
  }
};

TinymceInterface.prototype.isEmpty = function (instance) {
  var root = instance.dom.getRoot();
  return instance.dom.isEmpty(root);
};

/* harmony default export */ __webpack_exports__["a"] = (TinymceInterface);


/***/ }),

/***/ 23:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return iconList; });
var iconList = { // Select array instead?
  style_1: {
    title: 'Style 1',
    folder: {
      title: 'Folder',
      altText: 'Folder',
      iconSrc: 'https://s3.amazonaws.com/vivomedia.fiu.edu/718822d6-9514-4e2a-acdc-0925d227b569/source.png',
      defaultHTML: `<p>Select the link above titled "Module #: ..." in order to access all necessary content for this module.</p>`
    },
    todolist: {
      title: 'To Do List',
      altText: 'To Do List',
      iconSrc: 'https://s3.amazonaws.com/vivomedia.fiu.edu/ed1742a7-4db3-4fb1-b093-d1e5506bc318/source.png',
      defaultHTML: `<p>For the successful completion of this week, students are required to:</p>
    <p><strong>Read the following:</strong></p>
    <ul>
    <li></li>
    </ul>
    <p><strong>View the following videos</strong></p>
    <ul>
    <li></li>
    </ul>
    <p><strong>Complete</strong></p>
    <ul>
    <li>Participate in</li>
    <li>Complete</li>
    <li>Submit</li>
    </ul>`
    },
    videos: {
      title: 'Videos',
      altText: 'Videos',
      iconSrc: 'https://s3.amazonaws.com/vivomedia.fiu.edu/0e10ccc9-c027-408a-a148-2893854037c4/source.png',
      defaultHTML: `<p>Select the links below to view this week's videos.</p>`
    },
    discussion: {
      title: 'Discussion',
      altText: 'Discussion',
      iconSrc: 'https://s3.amazonaws.com/vivomedia.fiu.edu/08e9be5d-a8f3-4034-8fbc-3cbd4890db5f/source.png',
      defaultHTML: `<p>Select the link above titled "Discussion Board" or on the "Discussion Board" link on the course menu to the left of the screen in order to submit your post by the due date noted in the syllabus.</p>`
    },
    assessment: {
      title: 'Assessment',
      altText: 'Assessment',
      iconSrc: 'https://s3.amazonaws.com/vivomedia.fiu.edu/2fe71c33-82e0-4f75-be11-b55e14ec36e0/source.png',
      defaultHTML: `<p>Select the link above titled "Quizzes and Exams" or on the "Assessments" portion of the course menu to the left of the screen in order to complete your assessment by its due date noted in the syllabus.</p>`
    },
    assignment: {
      title: 'Assignment',
      altText: 'Assignment',
      iconSrc: 'https://s3.amazonaws.com/vivomedia.fiu.edu/ea389562-95cd-45a2-97ee-42dd4b425662/source.png',
      defaultHTML: `<p>Select the link above titled "Assignment Dropbox" or on the "Assignment Dropbox" link on the course menu to the left of the screen in order to submit your post by the due date noted in the syllabus.</p>`
    },
    adobeconnect: {
      title: 'Adobe Connect',
      altText: 'Adobe Connect',
      iconSrc: 'https://s3.amazonaws.com/vivomedia.fiu.edu/7b6afd0d-be5f-4ece-b99f-39e521868846/source.png',
      defaultHTML: `<p>Select the link above titled "Adobe Connect" or on the "Adobe Connect" link on the course menu to the left of the screen in order to access the scheduled Adobe Connect session.</p>`
    },
    additionalresources: {
      title: 'Additional Resources',
      altText: 'Additional Resources',
      iconSrc: 'https://s3.amazonaws.com/vivomedia.fiu.edu/7dca219c-c88a-48c1-98f3-5bec983dc8db/source.png',
      defaultHTML: `<p>Select the links below to view the additional resources for this week.</p>`
    },
    announcement: {
      title: 'Announcement',
      altText: 'Announcement',
      iconSrc: 'https://s3.amazonaws.com/vivomedia.fiu.edu/f5330f62-bf62-4620-8f8b-6d735cb3ec82/source.png',
      defaultHTML: `<p>Enter Announcement Here</p>`
    },
    facebook: {
      title: 'Facebook',
      altText: 'Facebook',
      iconSrc: 'https://s3.amazonaws.com/vivomedia.fiu.edu/0f58bd14-1c9b-43d7-9b2e-430c50285011/source.png',
      defaultHTML: ``
    },
    instagram: {
      title: 'Instagram',
      altText: 'Instagram',
      iconSrc: 'https://s3.amazonaws.com/vivomedia.fiu.edu/8d117e00-68a8-4970-9792-1fc3038be4a3/source.png',
      defaultHTML: ``
    },
    twitter: {
      title: 'Twitter',
      altText: 'Twittter',
      iconSrc: 'https://s3.amazonaws.com/vivomedia.fiu.edu/f9c39aef-6563-4e1e-abfc-23a00d0e9f79/source.png',
      defaultHTML: ``
    }
  },
  style_2: {
    title: 'Style 2',
    folder: {
      title: 'Folder',
      altText: 'Folder',
      iconSrc: 'https://s3.amazonaws.com/vivomedia.fiu.edu/f92e7c39-7b4e-47ee-9b19-d7397a66858c/source.png',
      defaultHTML: `<p>Select the link above titled "Module #: ..." in order to access all necessary content for this module.</p>`
    },
    todolist: {
      title: 'To Do List',
      altText: 'To Do List',
      iconSrc: 'https://s3.amazonaws.com/vivomedia.fiu.edu/81f33db2-aec1-4553-baa6-3366c4efc582/source.png',
      defaultHTML: `<p>For the successful completion of this week, students are required to:</p>
    <p><strong>Read the following:</strong></p>
    <ul>
    <li></li>
    </ul>
    <p><strong>View the following videos</strong></p>
    <ul>
    <li></li>
    </ul>
    <p><strong>Complete</strong></p>
    <ul>
    <li>Participate in</li>
    <li>Complete</li>
    <li>Submit</li>
    </ul>`
    },
    videos: {
      title: 'Videos',
      altText: 'Videos',
      iconSrc: 'https://s3.amazonaws.com/vivomedia.fiu.edu/31d08943-107e-4b7d-9801-895521a764f2/source.png',
      defaultHTML: `<p>Select the links below to view this week's videos.</p>`
    },
    discussion: {
      title: 'Discussion',
      altText: 'Discussion',
      iconSrc: 'https://s3.amazonaws.com/vivomedia.fiu.edu/51db674e-b6c3-4d54-a24c-23bd15c5f90d/source.png',
      defaultHTML: `<p>Select the link above titled "Discussion Board" or on the "Discussion Board" link on the course menu to the left of the screen in order to submit your post by the due date noted in the syllabus.</p>`
    },
    assessment: {
      title: 'Assessment',
      altText: 'Assessment',
      iconSrc: 'https://s3.amazonaws.com/vivomedia.fiu.edu/63fa5670-1df5-4d4a-a9f9-bf0788fa2651/source.png',
      defaultHTML: `<p>Select the link above titled "Quizzes and Exams" or on the "Assessments" portion of the course menu to the left of the screen in order to complete your assessment by its due date noted in the syllabus.</p>`
    },
    assignment: {
      title: 'Assignment',
      altText: 'Assignment',
      iconSrc: 'https://s3.amazonaws.com/vivomedia.fiu.edu/5709d05f-5383-43c2-b300-a73ea6052724/source.png',
      defaultHTML: `<p>Select the link above titled "Assignment Dropbox" or on the "Assignment Dropbox" link on the course menu to the left of the screen in order to submit your post by the due date noted in the syllabus.</p>`
    },
    groups: {
      title: 'Groups',
      altText: 'Groups',
      iconSrc: 'https://s3.amazonaws.com/vivomedia.fiu.edu/708912d8-21d2-421c-8c7b-4df9b77015d2/source.png',
      defaultHTML: `<p>Select the link above titled "Groups" or on the "Groups" link on the course menu to the left of the screen in order to section of the course.</p>`
    },
    adobeconnect: {
      title: 'Adobe Connect',
      altText: 'Adobe Connect',
      iconSrc: 'https://s3.amazonaws.com/vivomedia.fiu.edu/886de176-6d26-4c1d-a6af-a868108aa742/source.png',
      defaultHTML: `<p>Select the link above titled "Adobe Connect" or on the "Adobe Connect" link on the course menu to the left of the screen in order to access the scheduled Adobe Connect session.</p>`
    },
    additionalresources: {
      title: 'Additional Resources',
      altText: 'Additional Resources',
      iconSrc: 'https://s3.amazonaws.com/vivomedia.fiu.edu/bad6daba-ab6a-4e9e-b7fe-62ca35cfbf85/source.png',
      defaultHTML: `<p>Select the links below to view the additional resources for this week.</p>`
    },
    announcement: {
      title: 'Announcement',
      altText: 'Announcement',
      iconSrc: 'https://s3.amazonaws.com/vivomedia.fiu.edu/3328fce6-e147-44ea-ad40-f836045a9c3c/source.png',
      defaultHTML: `<p>Enter Announcement Here</p>`
    }
  },
  style_3: {
    title: 'Style 3',
    folder: {
      title: 'Folder',
      altText: 'Folder',
      iconSrc: 'https://s3.amazonaws.com/vivomedia.fiu.edu/2530deaa-c98d-498e-b2c4-e9bc906dbb55/source.png',
      defaultHTML: `<p>Select the link above titled "Module #: ..." in order to access all necessary content for this module.</p>`
    },
    todolist: {
      title: 'To Do List',
      altText: 'To Do List',
      iconSrc: 'https://s3.amazonaws.com/vivomedia.fiu.edu/4d997f56-b053-4737-937b-15ace5b0e2be/source.png',
      defaultHTML: `<p>For the successful completion of this week, students are required to:</p>
      <p><strong>Read the following:</strong></p>
      <ul>
      <li></li>
      </ul>
      <p><strong>View the following videos</strong></p>
      <ul>
      <li></li>
      </ul>
      <p><strong>Complete</strong></p>
      <ul>
      <li>Participate in</li>
      <li>Complete</li>
      <li>Submit</li>
      </ul>`
    },
    discussion: {
      title: 'Discussion',
      altText: 'Discussion',
      iconSrc: 'https://s3.amazonaws.com/vivomedia.fiu.edu/72ee46b6-370d-4576-bd69-e1193d037840/source.png',
      defaultHTML: `<p>Select the link above titled "Discussion Board" or on the "Discussion Board" link on the course menu to the left of the screen in order to submit your post by the due date noted in the syllabus.</p>`
    },
    assessment: {
      title: 'Assessment',
      altText: 'Assessment',
      iconSrc: 'https://s3.amazonaws.com/vivomedia.fiu.edu/fe3f86b6-4b89-4ca9-9cd0-bfe27c7e93fb/source.png',
      defaultHTML: `<p>Select the link above titled "Quizzes and Exams" or on the "Assessments" portion of the course menu to the left of the screen in order to complete your assessment by its due date noted in the syllabus.</p>`
    },
    assignment: {
      title: 'Assignment',
      altText: 'Assignment',
      iconSrc: 'https://s3.amazonaws.com/vivomedia.fiu.edu/dad17077-c8b6-4bf5-8d15-47e0cf4f66d1/source.png',
      defaultHTML: `<p>Select the link above titled "Assignment Dropbox" or on the "Assignment Dropbox" link on the course menu to the left of the screen in order to submit your post by the due date noted in the syllabus.</p>`
    },
    adobeconnect: {
      title: 'Adobe Connect',
      altText: 'Adobe Connect',
      iconSrc: 'https://s3.amazonaws.com/vivomedia.fiu.edu/c27bb737-2f34-4968-b5a8-2fc82b7e29d9/source.png',
      defaultHTML: `<p>Select the link above titled "Adobe Connect" or on the "Adobe Connect" link on the course menu to the left of the screen in order to access the scheduled Adobe Connect session.</p>`
    },
    additionalresources: {
      title: 'Additional Resources',
      altText: 'Additional Resources',
      iconSrc: 'https://s3.amazonaws.com/vivomedia.fiu.edu/1e5f6de6-1607-4489-a8cb-90dc41f5b0f3/source.png',
      defaultHTML: `<p>Select the links below to view the additional resources for this week.</p>`
    },
    announcement: {
      title: 'Announcement',
      altText: 'Announcement',
      iconSrc: 'https://s3.amazonaws.com/vivomedia.fiu.edu/fb3e3b76-ea84-4722-b196-940f20adbb7b/source.png',
      defaultHTML: `<p>Enter Announcement Here</p>`
    }
  },
  style_4: {
    title: 'Style 4',
    folder: {
      title: 'Folder',
      altText: 'Folder',
      iconSrc: 'https://s3.amazonaws.com/vivomedia.fiu.edu/dcef2388-ad90-4096-a230-766376fe508d/source.png',
      defaultHTML: `<p>Select the link above titled "Module #: ..." in order to access all necessary content for this module.</p>`
    },
    todolist: {
      title: 'To Do List',
      altText: 'To Do List',
      iconSrc: 'https://s3.amazonaws.com/vivomedia.fiu.edu/5015cf00-cd74-42bb-8735-618470db9b13/source.png',
      defaultHTML: `<p>For the successful completion of this week, students are required to:</p>
        <p><strong>Read the following:</strong></p>
        <ul>
        <li></li>
        </ul>
        <p><strong>View the following videos</strong></p>
        <ul>
        <li></li>
        </ul>
        <p><strong>Complete</strong></p>
        <ul>
        <li>Participate in</li>
        <li>Complete</li>
        <li>Submit</li>
        </ul>`
    },
    videos: {
      title: 'Videos',
      altText: 'Videos',
      iconSrc: 'https://s3.amazonaws.com/vivomedia.fiu.edu/23972792-dbab-4c62-9779-78a3ac64fb27/source.png',
      defaultHTML: `<p>Select the links below to view this week's videos.</p>`
    },
    discussion: {
      title: 'Discussion',
      altText: 'Discussion',
      iconSrc: 'https://s3.amazonaws.com/vivomedia.fiu.edu/6db08e32-e2d5-4ea2-a802-67da8140e6f7/source.png',
      defaultHTML: `<p>Select the link above titled "Discussion Board" or on the "Discussion Board" link on the course menu to the left of the screen in order to submit your post by the due date noted in the syllabus.</p>`
    },
    assessment: {
      title: 'Assessment',
      altText: 'Assessment',
      iconSrc: 'https://s3.amazonaws.com/vivomedia.fiu.edu/b3020f15-ad1a-415c-a882-e63772c047b0/source.png',
      defaultHTML: `<p>Select the link above titled "Quizzes and Exams" or on the "Assessments" portion of the course menu to the left of the screen in order to complete your assessment by its due date noted in the syllabus.</p>`
    },
    assignment: {
      title: 'Assignment',
      altText: 'Assignment',
      iconSrc: 'https://s3.amazonaws.com/vivomedia.fiu.edu/898d3fa4-f2d6-4e8f-8937-f32101162a85/source.png',
      defaultHTML: `<p>Select the link above titled "Assignment Dropbox" or on the "Assignment Dropbox" link on the course menu to the left of the screen in order to submit your post by the due date noted in the syllabus.</p>`
    },
    additionalresources: {
      title: 'Additional Resources',
      altText: 'Additional Resources',
      iconSrc: 'https://s3.amazonaws.com/vivomedia.fiu.edu/ad9b9722-53bd-4080-aa43-ff85bfd93c28/source.png',
      defaultHTML: `<p>Select the links below to view the additional resources for this week.</p>`
    }
  },
  style_5: {
    title: 'Style 5',
    folder: {
      title: 'Folder',
      altText: 'Folder',
      iconSrc: 'https://s3.amazonaws.com/vivomedia.fiu.edu/77f5aa74-b19f-4dce-aaa1-05813865cc10/source.png',
      defaultHTML: `<p>Select the link above titled "Module #: ..." in order to access all necessary content for this module.</p>`
    },
    todolist: {
      title: 'To Do List',
      altText: 'To Do List',
      iconSrc: 'https://s3.amazonaws.com/vivomedia.fiu.edu/05e84ba3-5467-40ae-9635-2efd078302d4/source.png',
      defaultHTML: `<p>For the successful completion of this week, students are required to:</p>
          <p><strong>Read the following:</strong></p>
          <ul>
          <li></li>
          </ul>
          <p><strong>View the following videos</strong></p>
          <ul>
          <li></li>
          </ul>
          <p><strong>Complete</strong></p>
          <ul>
          <li>Participate in</li>
          <li>Complete</li>
          <li>Submit</li>
          </ul>`
    },
    videos: {
      title: 'Videos',
      altText: 'Videos',
      iconSrc: 'https://s3.amazonaws.com/vivomedia.fiu.edu/cebcf070-b0fa-4809-b5bd-f7998ec4b842/source.png',
      defaultHTML: `<p>Select the links below to view this week's videos.</p>`
    },
    discussion: {
      title: 'Discussion',
      altText: 'Discussion',
      iconSrc: `https://s3.amazonaws.com/vivomedia.fiu.edu/a0b38285-2d3d-4b4d-b7ca-386b79845958/source.png`,
      defaultHTML: `<p>Select the link above to participate in this week's discussion when it becomes available.</p>`
    },
    assessment: {
      title: 'Assessment',
      altText: 'Assessment',
      iconSrc: 'https://s3.amazonaws.com/vivomedia.fiu.edu/2bbb23f3-452c-453d-9129-745d65f26965/source.png',
      defaultHTML: `<p>Select the link above titled "Quizzes and Exams" or on the "Assessments" portion of the course menu to the left of the screen in order to complete your assessment by its due date noted in the syllabus.</p>`
    },
    assignment: {
      title: 'Assignment',
      altText: 'Assignment',
      iconSrc: 'https://s3.amazonaws.com/vivomedia.fiu.edu/426e5260-7e82-4218-b144-8d7044efecb9/source.png',
      defaultHTML: `<p>Select the link above titled "Assignment Dropbox" or on the "Assignment Dropbox" link on the course menu to the left of the screen in order to submit your post by the due date noted in the syllabus.</p>`
    },
    groups: {
      title: 'Groups',
      altText: 'Groups',
      iconSrc: 'https://s3.amazonaws.com/vivomedia.fiu.edu/88f846e5-54e9-465e-9742-11b0e0462a01/source.png',
      defaultHTML: `<p>Select the link above titled "Groups" or on the "Groups" link on the course menu to the left of the screen in order to section of the course.</p>`
    },
    adobeconnect: {
      title: 'Adobe Connect',
      altText: 'Adobe Connect',
      iconSrc: 'https://s3.amazonaws.com/vivomedia.fiu.edu/451fca68-3c8d-46ac-9779-ad96c8c65d65/source.png',
      defaultHTML: `<p>Select the link above titled "Adobe Connect" or on the "Adobe Connect" link on the course menu to the left of the screen in order to access the scheduled Adobe Connect session.</p>`
    },
    additionalresources: {
      title: 'Additional Resources',
      altText: 'Additional Resources',
      iconSrc: 'https://s3.amazonaws.com/vivomedia.fiu.edu/c91ea83d-b819-4501-8f89-fef49c75d421/source.png',
      defaultHTML: `<p>Select the links below to view the additional resources for this week.</p>`
    }
  }
};


/***/ }),

/***/ 24:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_dom__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_TinyMCE__ = __webpack_require__(21);


// import getFromStorage from 'Storage/get';
// import setToStorage from 'Storage/set';

var DOM = new __WEBPACK_IMPORTED_MODULE_0_dom__["a" /* default */](); // NOTE: Should tinyMCE inherit DOMInterface?
var MCE = new __WEBPACK_IMPORTED_MODULE_1_TinyMCE__["a" /* default */](); // NOTE: Should TextEditor inherit TinyMCE?



function TextEditor(tinymceInstance) {
  this.instance = tinymceInstance;
  this.editorId = escapeCharacters(tinymceInstance.id);
  this.tableRowNode = DOM.getChild(`#${this.editorId}_toolbar2 tr`, 0, document);
  this.contentColumnId = `${this.editorId}`;
  // NOTE: Add constants/dictionary?
}

// NOTE: Make a "Menu building" object/class?
TextEditor.prototype.buildMenu = function (iconsList) {
  var topLevel = DOM.makeNode( this.__buildToplevel__(iconsList) );
  DOM.setStyle({ // NOTE: Make reusable "Styles" constants?
    width: '120px',
    'max-width': '120px'
    }, topLevel.querySelector("select"));
  this.__addNode__(this.tableRowNode, topLevel);

  var subLevels = this.__buildSublevels__(iconsList);
  subLevels.forEach( function(sublevel) {
    var subMenu = DOM.makeNode(sublevel)
    DOM.setStyle({
      width: '120px',
      'max-width': '120px',
      display:'none'
      }, subMenu.querySelector("select"));
    this.__addNode__(this.tableRowNode, subMenu);
  }, this);

  // Add event listeners
  // NOTE: Clean up event listeners (naming, reuse, etc)
  var that = this; // NOTE: Better way to pass 'this'?
  var topLevelSelect = DOM.getChild('#main-style-select select', 0, this.tableRowNode);
  var submenuSelects = DOM.getChildren('.tinymce-menu', this.tableRowNode);
  var styleObject = {};

  // NOTE: Make event listener functions?
  topLevelSelect.addEventListener('change', function() {
    var topLevelSelectedOption = topLevelSelect.item(topLevelSelect.selectedIndex).innerText;
    styleObject = that.__searchObject__(iconsList, topLevelSelectedOption);
    that.toggleDisplayedMenu(topLevelSelectedOption, submenuSelects);
    setToStorage('topLevelSelect', topLevelSelect.selectedIndex);
  });

  submenuSelects.forEach( function(subMenu) {
    var select = DOM.getChild(`#${subMenu.id} select`, 0, this.tableRowNode);
    select.addEventListener('change', function() {
      var styleOption = topLevelSelect.item(topLevelSelect.selectedIndex).innerText;
      var iconTypeOption = select.item(select.selectedIndex).innerText;
      var iconTypeObject =  that.__searchObject__(styleObject, iconTypeOption);
      that.__setHtml__( iconTypeObject );
      that.__resetSelectMenu__(this);
    });
  }, this);

  setSelection('topLevelSelect', topLevel.querySelector('select'));
};

TextEditor.prototype.__buildToplevel__ = function (optionsList) {
  var emmetString = 'td#main-style-select > select.mceNativeListBox > option {Select a Style}';
  for (var item in optionsList) { // First level
    if ( typeof optionsList[item] === "object" ) {
      emmetString += ` + option {${optionsList[item].title}}`; // Note blank space at start of String
    }
  }
  return emmetString;
};

TextEditor.prototype.__buildSublevels__ = function (optionsList) {
  var emmetStringList = [];
  for (var item in optionsList) { // First level
    var emmetString = `td#${item}-select.tinymce-menu > select.mceNativeListBox > option {Select an Icon}`;
    if ( typeof optionsList[item] === "object" ) {
      for (var subItem in optionsList[item]) { // Second level
        if ( typeof optionsList[item][subItem] === "object" ) {
          emmetString += ` + option {${optionsList[item][subItem].title}}`; // Note blank space at start of String
        }
      }
    }
    emmetStringList.push(emmetString);
  }
  return emmetStringList;
};

// NOTE: Return the appended node for reference?
TextEditor.prototype.__addNode__ = function (parentNode, node) {
  console.log('Select element added with ID: ', node.id);
  var lastChild = parentNode.lastChild.cloneNode(true);
  parentNode.removeChild(parentNode.lastChild);
  parentNode.appendChild(node);
  parentNode.appendChild(lastChild);
};

// NOTE: Refactor toggleDisplayedMenu to be more reusable? (i.e. can be applied to any menu element)
TextEditor.prototype.toggleDisplayedMenu = function (target, menus) {
  for (var menu of menus) {
    var select = DOM.getChild(`#${menu.id} select`, 0, this.tableRowNode);
    if ( menu.id.includes( target.replace('Style ', '') ) ) { // NOTE: Determine better condition?
      DOM.setStyle({display: 'block'}, select);
    } else {
      DOM.setStyle({display: 'none'}, select);
    }
  }
};

// NOTE: Consolidate repetative vars/simplify if logic
TextEditor.prototype.__setHtml__ = function (content) {
  var targetId = `${this.contentColumnId}_col2`;
  var uniqueId = `${this.contentColumnId}`;
  var currentContent = MCE.getColumn2(this.instance, targetId);

  if ( currentContent ) {
    console.log('Adding template. Col 2 exists.');
    if (getFromStorage('lastContent').trim() === currentContent.innerHTML.trim()) {
        currentContent = content.defaultHTML;
        setToStorage('lastContent', currentContent);
    } else {
      currentContent = currentContent.innerHTML;
    }
  }
  else if ( !currentContent && !MCE.isEmpty(this.instance) ) {
    console.log('Adding template. Col 2 does not exist, but there is content.');
    currentContent = MCE.getContent(this.instance);
  }
  else if ( MCE.isEmpty(this.instance) ) {
    console.log('Adding template. Editor is empty.');
    currentContent = content.defaultHTML;
    setToStorage('lastContent', currentContent);
  }

  var htmlTemplate =
  `<div style="display: flex;">
    <div id="${uniqueId}_col1">
      <img alt="${content.altText}" style="max-width: 75px; padding: 0 15px 0 0;" src="${content.iconSrc}" />
    </div>
    <div style="display: flex; align-items: center;">
      <div id="${uniqueId}_col2">
        <p>some text</p>
        ${currentContent}
      </div>
    </div>
  </div>`;

  MCE.setContent(this.instance, htmlTemplate);
  var targetNode = MCE.getColumn2(this.instance, targetId);
  targetNode.innerHTML = currentContent;
};

TextEditor.prototype.__searchObject__ = function (object, queryTerm) {
  for (var key in object) {
    var value = object[key];
    if (typeof value === 'Object' && value.title !== queryTerm) {
      this.searchObject(value);
    }
    if (value.title === queryTerm) {
      return value;
    }
  }
};

TextEditor.prototype.__getMenus__ = function () {
  // Gets menu elements that were added to tinymce
};

TextEditor.prototype.__setEventListener__ = function () { // NOTE: Makes sense as function?
  // Adds an event listenser to elements in tinymce
};

TextEditor.prototype.__resetSelectMenu__ = function (eventOriginNode) {
  // Resets a select menu to display the first/default option
  eventOriginNode.selectedIndex = 0;
};

TextEditor.prototype.sample = function () {
  //
};

/**
 * Helper functions
 */
 function escapeCharacters(string) {
   var newString = CSS.escape(string);

  //  var charactersToEscape= {
  //    // '|\.': '\\.', NOTE: Syntax to include '.' here instead of in separate if statement?
  //    '/': '\\/',
  //    '"': '\\"',
  //    "'": "\\'"
  //  };

  //  if (newString.includes('\.')) {
  //    newString = newString.replace( new RegExp(/[.]/, 'g'), '\\.');
  //  }
   //
  //  for (char in charactersToEscape) {
  //    if ( newString.includes(char) ) {
  //      console.log(char);
  //      newString = newString.replace(new RegExp(char, 'g'), charactersToEscape[char]);
  //    }
  //  }

   return newString;
 }

function setSelection(key, selectBox) {
  if( getFromStorage(key) ) {
    selectBox.selectedIndex = getFromStorage(key);
    selectBox.dispatchEvent(new Event('change'));
  }
}

function setToStorage (key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  // GM_setValue(key, value);
}

function getFromStorage (key) {
  return JSON.parse(localStorage.getItem(key));
  // console.log('get: ', key,GM_getValue(key, null));
  // return JSON.parse(GM_getValue(key, null));
  // return GM_getValue(key, null);
}



/* harmony default export */ __webpack_exports__["a"] = (TextEditor);


/***/ }),

/***/ 45:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_TinyMCE__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_Editor__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_TinyMCE_IconTemplates__ = __webpack_require__(23);




var MCE = new __WEBPACK_IMPORTED_MODULE_0_TinyMCE__["a" /* default */]();
var icons = __WEBPACK_IMPORTED_MODULE_2_TinyMCE_IconTemplates__["a" /* iconList */];

function init(instance) {
  var editor = new __WEBPACK_IMPORTED_MODULE_1_Editor__["a" /* default */](instance);
  editor.buildMenu(icons);
}

document.addEventListener('EditorAdded', function(event) {
  var editor = event.detail;
  console.log('Editor added with ID: ', event.detail.id);
  init(editor);
});

MCE.getInstances();


/***/ })

/******/ });