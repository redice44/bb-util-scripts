(function() {
  var __storage__;

  function handleSubmit(e) {
    showCourse(document.getElementById('course_id').value);
  }

  function showCourse(courseId) {
    var courseMap = getFromStorage(courseId);
    if (courseMap) {
      var elapsedSec = courseMap.elapsedTime;
      var elapsedMin = Math.floor(elapsedSec / 60);
      elapsedSec = elapsedSec % 60;
      console.log('Total items scanned: ' + showLevel(courseMap, 0));
      console.log('Time Elapsed: ' + elapsedMin + 'm ' + elapsedSec + 's');
    } else {
      console.log('No course scan');
    }
  }

  function showLevel(parent, level) {
    var title = parent.title || 'Course';
    var spacing = ' '.repeat(level * 2);
    var total = parent.numItems;
    console.log(spacing + level + ': ' + title + ' (' + parent.numItems + ' items scanned)');
    if (parent.nodes) {
      parent.nodes.forEach(function(child, i) {
        total += showLevel(child, level + 1);
      });
    }

    return total;
  }

  /*
    Availability code from: 
    https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
  */
  function storageAvailable() {
    try {
      __storage__ = window.localStorage;
      var x = '__storage_test__';
      __storage__.setItem(x, x);
      __storage__.removeItem(x);
      return true;
    } catch (e) {
      return false;
    }
  }

  function getFromStorage(key) {
    return JSON.parse(__storage__.getItem(key));
  }

  function setToStorage(key, value) {
    __storage__.setItem(key, JSON.stringify(value));
  }

  function delFromStorage(key) {
    __storage__.removeItem(key);  
  }

  function init() {
    if (storageAvailable()) {
      var courseIdNode = document.getElementById('course_id');
      courseIdNode.focus();
      // courseIdNode.addEventListener('submit', handleSubmit);
      document.getElementById('see_results').addEventListener('click', handleSubmit);
    } else {
      alert('Please update your browser to Chrome 4 or Firefox 3.5 to use the Course Scanner Script.');
    }
  }

  init();
})();
