import Interface from 'Blackboard';
import Course from 'Course';

var bbi = new Interface('https://fiu.blackboard.com');

var c = new Course('_70246_1', bbi, []);
c.getCourse();
