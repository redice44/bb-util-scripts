import DOMInterface from 'dom';

var dom = new DOMInterface();

function warningIcon (color) {
  color = color || '#000000';
  var icon = dom.makeSvg('svg > path * 2');
  var svgAttr = {
    fill: color,
    height: '24',
    width: '24',
    viewBox: '0 0 24 24',
    xmlns: 'http://www.w3.org/2000/svg'
  };
  var pathAttrs = [
    {
      d: 'M0 0h24v24H0z',
      fill: 'none'
    },
    {
      d: 'M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z'
    }
  ];
  dom.setAttr(svgAttr, icon);
  pathAttrs.forEach(function (pathAttr, i) {
    dom.setAttr(pathAttr, dom.getChild('path', i, icon));
  });

  return icon;
}

export default warningIcon;
