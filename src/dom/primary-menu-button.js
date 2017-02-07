var makePrimaryMenuButton = function(linkName, cb) {
  var primaryActionBar = document.getElementById('nav');
  var liNode = document.createElement('li');
  var h2Node = document.createElement('h2');
  var linkNode = document.createElement('a');
  var text = document.createTextNode(linkName);
  // Blackboard class
  liNode.classList.add('mainButton');
  linkNode.setAttribute('href', '#');

  linkNode.appendChild(text);
  h2Node.appendChild(linkNode);
  liNode.appendChild(h2Node);

  liNode.addEventListener('click', cb);
  primaryActionBar.appendChild(liNode);
};

var makePrimarySubMenuButton = function() {
  var primaryActionBar = document.getElementById('nav');
  var liNode = document.createElement('li');
  var h2Node = document.createElement('h2');
  var linkNode = document.createElement('a');
  var text = document.createTextNode(linkName);
  // Blackboard class
  liNode.classList.add('mainButton');
  linkNode.setAttribute('href', '#');

  linkNode.appendChild(text);
  h2Node.appendChild(linkNode);
  liNode.appendChild(h2Node);

  liNode.addEventListener('click', cb);
  primaryActionBar.appendChild(liNode);


  var subList = document.createElement('ul');
  var subListItem = document.createElement('li');
  var subListA = document.createElement('a');
  var subListText = document.createTextNode('link 1');

  subListA.appendChild(subListText);
  subListItem.appendChild(subListA);
  subListItem.classList.add('actionMenuItem');
  subList.appendChild(subListItem);
  subList.classList.add('actionMenu');


  btn.appendChild(subList);

  primaryActionBar.appendChild(btn);
};
