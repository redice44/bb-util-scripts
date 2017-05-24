/*
  Google's Material Design Icon: Alert > warning
*/

import makeIcon from 'Icons/makeIcon';

function warningIcon (color) {
  var pathAttrs = [
    {
      d: 'M0 0h24v24H0z',
      fill: 'none'
    },
    {
      d: 'M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z'
    }
  ];

  return makeIcon(color, pathAttrs);
}

export default warningIcon;
