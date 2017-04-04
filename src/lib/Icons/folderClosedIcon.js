/*
  Google's Material Design Icon: File > folder
*/

import DOMInterface from 'dom';

var dom = new DOMInterface();

function folderClosedIcon (color) {
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
      d: 'M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z'
    }
  ];
  dom.setAttr(svgAttr, icon);
  pathAttrs.forEach(function (pathAttr, i) {
    dom.setAttr(pathAttr, dom.getChild('path', i, icon));
  });

  return icon;
}

export default folderClosedIcon;
