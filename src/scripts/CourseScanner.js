import Interface from 'Blackboard';
import Course from 'Course';
import NewWindowPlugin from 'Course/plugin/NewWindowPlugin';

var bbi = new Interface('https://fiu.blackboard.com');

// _70246_1
var c = new Course('_44712_1', bbi, [new NewWindowPlugin()]);
c.getCourse();
