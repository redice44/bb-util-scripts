var newTabPlugin = {
  checkLinks: function (node, highlightColor){
      var newTabProperty = 'target="_blank"';
      if(node.outerHTML){
          if(!node.outerHTML.includes(newTabProperty)){
              node.setAttribute('style', 'background-color: ' + highlightColor);
          }// End of inner if statement
      } // End of outer if statement
  }, // End of function
}
