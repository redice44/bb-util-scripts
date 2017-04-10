import LMSInterface from 'Blackboard';
import SPA from 'SPA';
import Modal from 'Modal';

var lmsi =  new LMSInterface('https://fiu.blackboard.com');
var app;
var modal;

function init () {
  buildStartBtn();
  modal = new Modal('SPA');
  document.body.appendChild(modal.getModal());
}

function buildStartBtn () {
  lmsi.addPrimaryMenuButton('Start SPA', initSPA);
  lmsi.addPrimaryMenuButton('Test Edit', testEdit);
}

function initSPA () {
  modal.show();
  modal.updateDisplay(lmsi.makeNode('div > p {Starting SPA}'));
  app = new SPA(lmsi);
  app.start()
    .then(function () {
      // modal.updateDisplay(lmsi.makeNode('div > p {SPA Ready!}'));
      modal.hide();
    })
    .catch(function (err) {
      console.log(err);
    });
}

function testEdit () {
  console.log('Testing Async Edit');
  lmsi.editItem();

}

init();
