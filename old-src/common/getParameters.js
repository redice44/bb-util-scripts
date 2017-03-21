export default function (url) {
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
}
