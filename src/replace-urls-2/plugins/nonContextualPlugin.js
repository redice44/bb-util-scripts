var nonContextualPlugin = {
  checkLinks: function (node, list, highlightColor){
    if(node.outerHTML){
      for (var x = 0; x < list.length; x++) {
        var txt = node.textContent.toLowerCase();
        if(txt.includes(list[x])){
            node.setAttribute('style', 'background-color: ' + highlightColor);
        }// End of inner if statement

      } // End of for statement

    } // End of outer if statement
  }, // End of function
}
