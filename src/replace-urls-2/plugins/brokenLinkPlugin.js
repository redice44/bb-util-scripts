var brokenLinkPlugin = {
  fetchStatus: function (node, highlightColor){
    var client = new XMLHttpRequest();
    if(node){
      client.onload = function(){
        console.log("Here  " + node);
        console.log(client);
        //statusReturned(client, node);
      }

      client.onerror = function(){
        console.log("Error");
        console.log(client);
      }

      client.open('HEAD', node);
      client.send();

    } // End of outer if statement
  }, // End of function
  statusReturned: function(httpClient, node){

    if(httpClient.status === 404){
      console.log("Broken Link " + node);
      console.log("Code for the link " + httpClient.status);
      node.setAttribute('style', 'background-color: ' + highlightColor);
    }

  }, // End of function
}
