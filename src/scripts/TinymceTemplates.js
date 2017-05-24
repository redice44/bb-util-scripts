import TinymceInterface from 'TinyMCE';
import Editor from 'Editor';
import { iconList } from 'TinyMCE/IconTemplates';

var MCE = new TinymceInterface();
var icons = iconList;

function init(instance) {
  var editor = new Editor(instance);
  editor.buildMenu(icons);
}

document.addEventListener('EditorAdded', function(event) {
  var editor = event.detail;
  console.log('Editor added with ID: ', event.detail.id);
  init(editor);
});

MCE.getInstances();
