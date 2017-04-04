/*
  Google's Material Design Icon: Editor > mode edit
*/

import DOMInterface from 'dom';

var dom = new DOMInterface();

function editIcon (color) {
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
      d: 'M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z'
    }
  ];
  dom.setAttr(svgAttr, icon);
  pathAttrs.forEach(function (pathAttr, i) {
    dom.setAttr(pathAttr, dom.getChild('path', i, icon));
  });

  return icon;
}

export default editIcon;
