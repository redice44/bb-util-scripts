/*
  Google's Material Design Icon: File > folder open
*/

import makeIcon from 'Icons/makeIcon';

function folderOpenIcon (color) {
  var pathAttrs = [
    {
      d: 'M0 0h24v24H0z',
      fill: 'none'
    },
    {
      d: 'M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z'
    }
  ];
  
  return makeIcon(color, pathAttrs);
}

export default folderOpenIcon;
