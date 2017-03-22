var nonContextualPlugin = {
  checkLinks: function (node, list, highlightColor){
      var children = node.childNodes;
      for(var i = 0; i < children.length; i++){
          var link = children[i];
          if(link.outerHTML){
            for (var x = 0; x < list.length; x++) {
              var txt = link.textContent.toLowerCase();
              if(txt.includes(list[x])){
                  console.log(txt);
                  children[i].setAttribute('style', 'background-color: ' + highlightColor);
              }// End of inner if statement

            } // End of for statement

          } // End of outer if statement
      }
  }, // End of function
}
