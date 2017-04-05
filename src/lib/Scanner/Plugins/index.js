import ImageText from 'Scanner/Plugins/ImageTextPlugin';
import NewWindow from 'Scanner/Plugins/NewWindowPlugin';
import OldMediasites from 'Scanner/Plugins/OldMediasitesPlugin';
import OldVivo from 'Scanner/Plugins/OldVivoPlugin';

var plugins = [
  new NewWindow(),
  new ImageText(),
  new OldMediasites(),
  new OldVivo()
];

export default plugins;
