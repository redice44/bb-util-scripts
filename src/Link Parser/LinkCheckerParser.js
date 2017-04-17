import DOMInterface from 'dom';

function LinkCheckerParser () {

}

LinkCheckerParser.prototype = Object.create(DOMInterface.prototype);
LinkCheckerParser.prototype.constructor = LinkCheckerParser;

LinkCheckerParser.prototype.getLinks = function(dom){

	if (!dom) {
		return null;
	}

	var returnedLinks= this.getChildren('a', dom);
	var results = [];
	for (var i = returnedLinks.length - 1; i >= 0; i--) {
		
		if (returnedLinks[i]) {
			var enocdedLink = this.isValidLink(returnedLinks[i]);

			if (enocdedLink){
				results.push(enocdedLink);
			}
		}
	}

	return results;
};

LinkCheckerParser.prototype.isValidLink = function(link){
	var target = link.getAttribute('target');
	var href = this.getUrl(link).toLowerCase();
	var exclusions = [
	new RegExp(/^#/g),
    new RegExp(/^javascript/g),
    new RegExp(/fiu\.blackboard\.com/g),
    new RegExp(/^\/webapps\//g)
  ];

  for (var i = exclusions.length - 1; i >= 0; i--) {

  	if (exclusions[i].test(href)){
  		return false;
  	}
 
  }
  var linkEncoded = this.encode(link);
  return linkEncoded;
};

/**
  @param {Link} link - link to check if target opens in new tab

  @return bool - If link does open in new tab
*/
LinkCheckerParser.prototype.newWindowValidator = function(link){
	if (link) {
		var newTab = new RegExp(/^\_blank/g);
		var tar = link.target.replace(/\s/g,'');

		if (newTab.test(tar)) {return true;} else {return false;}
	}

	return false;
};

LinkCheckerParser.prototype.encode = function(link){

   var dict = {
    href: this.getUrl(link),
    htmlText: link.outerHTML,
    style: link.style,
    text: link.innerText,
    target: link.target,
    newWindow: this.newWindowValidator(link)
  };
  return dict;
};

export default LinkCheckerParser;