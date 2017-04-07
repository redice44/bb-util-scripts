import DOMInterface from 'dom';

var dom = new DOMInterface();

function makeIcon (color, pathAttrs) {
  color = color || '#000000';
  var icon = dom.makeSvg(`svg > path * ${pathAttrs.length}`);
  var svgAttr = {
    fill: color,
    height: '24',
    width: '24',
    viewBox: '0 0 24 24',
    xmlns: 'http://www.w3.org/2000/svg'
  };
  dom.setAttr(svgAttr, icon);
  pathAttrs.forEach(function (pathAttr, i) {
    dom.setAttr(pathAttr, dom.getChild('path', i, icon));
  });

  return icon;
}

export default makeIcon;
