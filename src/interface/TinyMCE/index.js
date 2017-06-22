function TinymceInterface() {
}

// Fires event with editor details as editors are rendered (async)
TinymceInterface.prototype.getInstances = function () {
  try {
    return tinyMCE.onAddEditor.add( function(mgr,ed) {
      ed.onPostRender.add( function(ed, cm) {
        var event = new CustomEvent('EditorAdded', {'detail': ed});
        return document.dispatchEvent(event);
      });
    });
  } catch(e) {
    console.log('error', e);
  }
};

// Gets the HTML content of editor instance
TinymceInterface.prototype.getContent = function (instance) {
  return instance.getContent();
};

// Sets the HTML content of editor instance
TinymceInterface.prototype.setContent = function (instance, content) {
  instance.setContent(content, {format: 'raw'});
};

// NOTE: Debug undefined error
// TinymceInterface.prototype.setHTML = function (instance, target, content) {
//   instance.DOM.setHTML(target, content);
// };

// Gets the HTML content of second column in editor instance
TinymceInterface.prototype.getColumn2 = function (instance, domId) {
  if ( instance.dom.get(domId) ) {
    return instance.dom.get(domId);
  } else {
    return false;
  }
};

TinymceInterface.prototype.isEmpty = function (instance) {
  var root = instance.dom.getRoot();
  return instance.dom.isEmpty(root);
};

export default TinymceInterface;
