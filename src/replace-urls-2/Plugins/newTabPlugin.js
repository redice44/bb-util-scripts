var newTabPlugin = {
  checkLinks: function (node, highlightColor){
      var newTabProperty = 'target="_blank"';
      var children = node.childNodes;
      for(var i = 0; i < children.length; i++){
          var link = children[i];
          if(link.outerHTML){
              if(!link.outerHTML.includes(newTabProperty)){
                  console.log(children[i]);
                  children[i].setAttribute('style', 'background-color: ' + highlightColor);
              }// End of inner if statement
          } // End of outer if statement
      }
  }, // End of function
