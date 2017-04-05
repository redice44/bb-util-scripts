import ImageText from 'Scanner/Plugins/ImageTextPlugin';
import NewWindow from 'Scanner/Plugins/NewWindowPlugin';

var plugins = [
  new NewWindow(),
  new ImageText()
];

export default plugins;
