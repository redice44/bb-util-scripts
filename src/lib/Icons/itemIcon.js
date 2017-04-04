/*
  Google's Material Design Icon: Editor > insert drive file
*/

import DOMInterface from 'dom';

var dom = new DOMInterface();

function itemIcon (color) {
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
      d: 'M6 2c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6H6zm7 7V3.5L18.5 9H13z'
    }
  ];
  dom.setAttr(svgAttr, icon);
  pathAttrs.forEach(function (pathAttr, i) {
    dom.setAttr(pathAttr, dom.getChild('path', i, icon));
  });

  return icon;
}

export default itemIcon;
