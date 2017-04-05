import ImageText from 'Scanner/Plugins/ImageTextPlugin';
import NewWindow from 'Scanner/Plugins/NewWindowPlugin';
import OldVivo from 'Scanner/Plugins/OldVivoPlugin';

var plugins = [
  new NewWindow(),
  new ImageText(),
  new OldVivo()
];

export default plugins;
