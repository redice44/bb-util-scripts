import Interface from 'Blackboard';
import Course from 'Course';
import NewWindowPlugin from 'Scanner/Plugins/NewWindowPlugin';
import DOMInterface from 'dom';

var DOM = new DOMInterface();
var bbi = new Interface('https://fiu.blackboard.com');

// _70246_1
var c = new Course('_44712_1', bbi, [new NewWindowPlugin()]);
c.getCourse() // Promise
  .then(function () {
    console.log('course root');
    console.log(c.root);
    c.scan()  // Promise
      .then(function (pages) {
        console.log('done with scan');
        console.log(pages);
        var results = c.displayResults();
        console.log(results);
        document.getElementById('content_listContainer').appendChild(results);
      });
  }).catch(function (err) {
    console.log(err);
  });
