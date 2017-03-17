// ==UserScript==
// @name         DEV Quick Icons
// @namespace    https://github.com/redice44
// @supportURL   https://github.com/redice44/bb-util-scripts/issues
// @version      0.1.0
// @description  Adds Quick Access Icons
// @author       Matt Thomson <red.cataclysm@gmail.com>
// @match        https://fiu.blackboard.com/webapps/blackboard/content/listContentEditable.jsp?*
// @require      https://raw.githubusercontent.com/redice44/bb-util-scripts/master/src/dom/primary-menu-button.js
// @require      https://raw.githubusercontent.com/redice44/bb-util-scripts/master/lib/superagent/superagent.js
// @resource     iconCss https://raw.githubusercontent.com/redice44/bb-util-scripts/master/src/quick-icons/quick-icons.css
// @run-at       document-start
// @grant        GM_addStyle
// @grant        GM_getResourceText
// ==/UserScript==

// load CSS

GM_addStyle (GM_getResourceText('iconCss'));


var STYLE_AVAILABILITY = '__bbqol__availability';
var STYLE_DENSE = '__bbqol__dense';
var STYLE_DENSE_TOGGLE = '__bbqol__dense-toggle';
var ACTIONS = '__bbqol__actions';
var denseAllState = false;
var request = superagent;


var nonceQuery = 'input[name="blackboard.platform.security.NonceUtil.nonce.ajax"]';

function ContentObject (config) {
  var temp = this.__build(config.rootNode);
  this.courseId = config.courseId;
  this.domId = temp.domId;
  this.id = temp.id;
  this.title = temp.title;
  this.availability = temp.availability;
  this.editLink = this.getActionLink(config.actionNode, 'Edit');
  if (!this.editLink) {
    // This is for assessments
    this.editLink = this.getActionLink(config.actionNode, 'Edit the Test Options');
  }
  this.copyLink = this.getActionLink(config.actionNode, 'Copy');
  this.moveLink = this.getActionLink(config.actionNode, 'Move');
  this.deleteLink = this.getActionLink(config.actionNode, 'Delete');

  this.dense = false;
  this.toggleDense = this.toggleDense.bind(this);

  this.__updateStyles();
  this.__modDOM();
}

ContentObject.prototype.getActionLink = function (node, action) {
  var link = node.querySelector('ul');
  console.log('');
  // link = link.children[action];
  link = link.querySelector('a[title="'+action+'"]');
  console.log(link);
  if (link) {
    return link.href;
  } else {
    return null;
  }
};

ContentObject.prototype.addActionIcons = function () {
  var editIconSvg = 'PHN2ZyBmaWxsPSIjMDAwMDAwIiBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCiAgICA8cGF0aCBkPSJNMyAxNy4yNVYyMWgzLjc1TDE3LjgxIDkuOTRsLTMuNzUtMy43NUwzIDE3LjI1ek0yMC43MSA3LjA0Yy4zOS0uMzkuMzktMS4wMiAwLTEuNDFsLTIuMzQtMi4zNGMtLjM5LS4zOS0xLjAyLS4zOS0xLjQxIDBsLTEuODMgMS44MyAzLjc1IDMuNzUgMS44My0xLjgzeiIvPg0KICAgIDxwYXRoIGQ9Ik0wIDBoMjR2MjRIMHoiIGZpbGw9Im5vbmUiLz4NCjwvc3ZnPg==';
  var copyIconSvg = 'PHN2ZyBmaWxsPSIjMDAwMDAwIiBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCiAgICA8cGF0aCBkPSJNMCAwaDI0djI0SDB6IiBmaWxsPSJub25lIi8+DQogICAgPHBhdGggZD0iTTE2IDFINGMtMS4xIDAtMiAuOS0yIDJ2MTRoMlYzaDEyVjF6bTMgNEg4Yy0xLjEgMC0yIC45LTIgMnYxNGMwIDEuMS45IDIgMiAyaDExYzEuMSAwIDItLjkgMi0yVjdjMC0xLjEtLjktMi0yLTJ6bTAgMTZIOFY3aDExdjE0eiIvPg0KPC9zdmc+';
  var moveIconSvg = 'PHN2ZyBmaWxsPSIjMDAwMDAwIiBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCiAgICA8cGF0aCBkPSJNMTAgOWg0VjZoM2wtNS01LTUgNWgzdjN6bS0xIDFINlY3bC01IDUgNSA1di0zaDN2LTR6bTE0IDJsLTUtNXYzaC0zdjRoM3YzbDUtNXptLTkgM2gtNHYzSDdsNSA1IDUtNWgtM3YtM3oiLz4NCiAgICA8cGF0aCBkPSJNMCAwaDI0djI0SDB6IiBmaWxsPSJub25lIi8+DQo8L3N2Zz4=';
  var deleteIconSvg = 'PHN2ZyBmaWxsPSIjMDAwMDAwIiBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCiAgICA8cGF0aCBkPSJNNiAxOWMwIDEuMS45IDIgMiAyaDhjMS4xIDAgMi0uOSAyLTJWN0g2djEyek0xOSA0aC0zLjVsLTEtMWgtNWwtMSAxSDV2MmgxNFY0eiIvPg0KICAgIDxwYXRoIGQ9Ik0wIDBoMjR2MjRIMHoiIGZpbGw9Im5vbmUiLz4NCjwvc3ZnPg==';

  if (this.editLink) {
    this.addActionIcon(this.editLink, editIconSvg);
  }

  if (this.copyLink) {
    this.addActionIcon(this.copyLink, copyIconSvg);
  }

  if (this.moveLink) {
    this.addActionIcon(this.moveLink, moveIconSvg);
  }

  this.addDeleteIcon(deleteIconSvg);
};

ContentObject.prototype.addDeleteIcon = function (icon) {
  var parent = document.getElementById(this.domId);
  var q = `.${ACTIONS}`;
  parent = parent.querySelector(q);

  var linkNode = document.createElement('a');
  var iconNode = document.createElement('img');

  linkNode.setAttribute('href', '');
  linkNode.addEventListener('click', this.deleteMe.bind(this));

  iconNode.setAttribute('src', `data:image/svg+xml;base64,${icon}`);
  linkNode.appendChild(iconNode);
  parent.appendChild(linkNode);
};

ContentObject.prototype.deleteMe = function (e) {
  e.preventDefault();
  var link = this.deleteLink.substr(40);
  link = link.split(',');
  var title = link[1];
  title = title.substr(1, title.length - 2);
  link = link[0];
  link = link.substr(1, link.length - 2);

  if (window.confirm(`Delete ${title}?`)) {
    var nonce = document.querySelector(nonceQuery);
    console.log('nonce', nonce);
    console.log(`this ${this.title} | link title ${title}`);
    console.log(`link ${link}`);

    request.post(link)
      .type('form')
      .send(`course_id=${this.courseId}`)
      .send(`contentTitle=${title}`)
      .send(`blackboard.platform.security.NonceUtil.nonce.ajax=${nonce.value}`)
      .end((err, res) => {
        if (err) {
          // TODO: Handle various errors, 404, 5xx etc
          console.log(err);
        }
        if (!res.header['x-blackboard-errorid']) {
          console.log(res);
          // Parse the string to a html document
          var parser = new DOMParser();
          nonce.value = this.__parseNonce(parser.parseFromString(res.text, 'text/html'));
          console.log(`New nonce: ${nonce.value}`);

          // Delete dom node
          document.getElementById(this.domId).remove();

        } else {
          console.log(`Blackboard Error ID: ${res.header['x-blackboard-errorid']}`);
        }
      });
  }
};

ContentObject.prototype.__parseNonce = function (dom) {
  return dom.querySelector('input[name="blackboard.platform.security.NonceUtil.nonce.ajax"]').value;
};

ContentObject.prototype.addActionIcon = function (link, icon) {
  var parent = document.getElementById(this.domId);
  var q = `.${ACTIONS}`;
  parent = parent.querySelector(q);

  var linkNode = document.createElement('a');
  var iconNode = document.createElement('img');

  linkNode.setAttribute('href', link);
  linkNode.setAttribute('target', '_blank');
  iconNode.setAttribute('src', `data:image/svg+xml;base64,${icon}`);
  linkNode.appendChild(iconNode);
  parent.appendChild(linkNode);
};

  /*
   * A setter for dense flag.
   * TODO: Make this an actual es6 setter and validate that it's a boolean.
   */

ContentObject.prototype.setDense = function (dense) {
  // TODO: Validate it's a boolean
  this.dense = dense;
  this.__setDense(document.getElementById(this.domId));
};

  /*
   * Toggles the dense flag.
   */
ContentObject.prototype.toggleDense = function () {
  // if (process.env.DEBUG) {
    console.log(`Toggle Dense for ${this.title}`, this.dense);
  // }
  this.dense = !this.dense;
  this.__setDense(document.getElementById(this.domId));
};

  /* Private Methods */

ContentObject.prototype.__modDOM = function () {
  var co = document.getElementById(this.domId);
  this.__addActions(co);
  this.__addDenseToggle(co);
  this.addActionIcons();
}

ContentObject.prototype.__addActions = function (co) {
  var q = 'div.item';
  var parent = co.querySelector(q);
  var actions = document.createElement('div');
  actions.classList.add(ACTIONS);

  parent.insertBefore(actions, parent.firstChild);
}

ContentObject.prototype.__addDenseToggle = function (co) {
  var q = {
    toggleLink: 'div.item > a[title*="Hide"][href="#"]',
    toggleParent: 'div.item'
  };
  var toggleParent = co.querySelector(q.toggleParent);
  var toggle = co.querySelector(q.toggleLink);
  if (toggle) {
    toggle.remove();
  }
  toggle = document.createElement('span');
  toggle.addEventListener('click', this.toggleDense);
  // Add Blackboard class
  toggle.classList.add('u_floatThis-right', STYLE_DENSE_TOGGLE);
  toggleParent.appendChild(toggle);
}

ContentObject.prototype.__updateStyles = function () {
  var co = document.getElementById(this.domId);
  this.__setAvailability(co);
  this.__setDense(co);
}

ContentObject.prototype.__setAvailability = function (co) {
  if (this.availability) {
    co.classList.remove(STYLE_AVAILABILITY);
  } else {
    co.classList.add(STYLE_AVAILABILITY);
  }
}

ContentObject.prototype.__setDense = function (co) {
  if (this.dense) {
    co.classList.add(STYLE_DENSE);
  } else {
    co.classList.remove(STYLE_DENSE);
  }
}

ContentObject.prototype.__build = function (raw) {
  // if (process.env.DEBUG) {
    console.log('Build', raw);
  // }

  var q = {
    id: 'div.item',
    heading: 'div.item > h3',
    availability: 'div.details .detailsLabel',
  };
  var contentObject = {};

  contentObject.domId = raw.id;
  contentObject.id = raw.querySelector(q.id).id;
  contentObject.title = raw.querySelector(q.heading).innerText;
  var avail = raw.querySelector(q.availability);
  contentObject.availability = !(avail && avail.innerText.includes('Availability'));
  return contentObject;
}


































var CO_ROOT_ID = 'content_listContainer';
var CO;
var courseId;
var contentObjects = [];

/*
  Observe only the content object list.

  Initial document sent to browser contains important action links that
  are then parsed and removed. We check for that event and process that
  data before it is removed from the DOM. We also use this opportunity
  to build our data structures.
*/

var contentObjectObserver = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
      /*
        Should only fire once when the action links are removed for each item

        Build our data structure.
      */
      // TODO: Add other action links, remove, move, delete, etc.
      if (mutation.removedNodes.length > 0 &&
      mutation.removedNodes[0].nodeName !== '#text' &&
      mutation.removedNodes[0].id.includes('cmdiv')) {
        var config = {
          rootNode: mutation.target.parentNode.parentNode,
          actionNode: mutation.removedNodes[0],
          courseId: courseId
        };
        console.log(config);
        contentObjects.push(new ContentObject(config));
      }
  });

  // Stop Observing once all Content Objects are created
  if (contentObjects.length >= CO.length) {
    contentObjectObserver.disconnect();
    console.log('Disconnecting', contentObjects);
    // init();
    makePrimaryMenuButton('Collapse', toggleAll);
    console.log(request);
  }
});

function toggleAll (e) {
  denseAllState = !denseAllState;
  // TODO: Use constants for state
  e.target.innerText = denseAllState ? 'Expand' : 'Collapse';
  contentObjects.forEach(function (item) {
    item.setDense(denseAllState);
  });
};

/*
  Observes as the DOM loads and checks to see when the Content Objects
  are loaded. Stop the observer once it detects the content item list
  object is loaded and start only observing that section.

  We also know the Course ID section of the DOM is loaded, so we also
  get that information.
*/
var loadObserver = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    if (mutation.target.id === CO_ROOT_ID) {
      contentObjectObserver.observe(document.getElementById(CO_ROOT_ID), observerConfig);
      courseId = document.getElementById('course_id').value;
      CO = document.getElementById(CO_ROOT_ID).children;
      loadObserver.disconnect();
    }
  });
});

var observerConfig = {
  childList: true,
  subtree: true
};

loadObserver.observe(document, observerConfig);
