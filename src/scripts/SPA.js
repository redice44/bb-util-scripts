import LMSInterface from 'Blackboard';
import SPA from 'SPA';

var lmsi =  new LMSInterface('https://fiu.blackboard.com');
var app;

function init () {
  buildStartBtn();
}

function buildStartBtn () {
  lmsi.addPrimaryMenuButton('Start SPA', initSPA);
}

function initSPA () {
  app = new SPA(lmsi);
  app.start();
}

init();
