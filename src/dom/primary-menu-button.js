var makePrimaryMenuButton = function(linkName, action) {
  var primaryActionBar = document.getElementById('nav');
  var liNode = document.createElement('li');
  var h2Node = document.createElement('h2');
  var linkNode = document.createElement('a');
  var text = document.createTextNode(linkName);
  // Blackboard class
  liNode.classList.add('mainButton');
  // linkNode.setAttribute('href', '#');

  linkNode.appendChild(text);
  h2Node.appendChild(linkNode);
  liNode.appendChild(h2Node);

  liNode.addEventListener('click', action);
  primaryActionBar.appendChild(liNode);
};

var makePrimarySubMenuButton = function(linkName, subItems) {
  var primaryActionBar = document.getElementById('nav');
  var liNode = document.createElement('li');
  var h2Node = document.createElement('h2');
  var linkNode = document.createElement('a');
  var text = document.createTextNode(linkName);
  var icon = document.createElement('span');
  var iconImg = document.createElement('img');
  // Blackboard class
  liNode.classList.add('mainButton', 'sub');

  linkNode.appendChild(text);
  iconImg.setAttribute('src', '/images/ci/ng/expand.gif');
  icon.appendChild(iconImg);
  icon.classList.add('chevron');

  linkNode.appendChild(icon);


  h2Node.appendChild(linkNode);
  liNode.appendChild(h2Node);

  var subList = document.createElement('ul');
  subItems.forEach(function(item) {
    __subListItem__(item, subList);
  });
  subList.classList.add('actionMenu');

  liNode.appendChild(subList);
  primaryActionBar.appendChild(liNode);
};

function __subListItem__ (item, parent) {
  var liNode = document.createElement('li');
  var subListA = document.createElement('a');
  var subListText = document.createTextNode(item.linkName);

  subListA.appendChild(subListText);
  liNode.appendChild(subListA);
  liNode.classList.add('actionMenuItem');
  liNode.addEventListener('click', item.action);

  parent.appendChild(liNode);
}
