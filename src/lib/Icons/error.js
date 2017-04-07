/*
  Google's Material Design Icon: Alert > error
*/

import makeIcon from 'Icons/makeIcon';

function errorIcon (color) {
  var pathAttrs = [
    {
      d: 'M0 0h24v24H0z',
      fill: 'none'
    },
    {
      d: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z'
    }
  ];
  return makeIcon(color, pathAttrs);
}

export default errorIcon;
