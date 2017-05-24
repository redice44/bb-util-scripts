import Interface from 'Blackboard';
import Course from 'Course';
import Plugins from 'Scanner/Plugins';
import Modal from 'Modal';

import getFromStorage from 'Storage/get';
import setToStorage from 'Storage/set';
import delFromStorage from 'Storage/del';

import newWindowIcon from 'Icons/newWindow';

var BBI = new Interface('https://fiu.blackboard.com');
var course;
var modal;

if (document.URL.includes('redice44.github.io/bb-util-scripts/results.html')) {
  var courseId = BBI.getCourseId(document.URL);
  console.log(courseId);
  var c = getFromStorage(courseId);
  console.log(GM_listValues());
  console.log(c);
  if (c) {
    course = new Course(null, BBI, Plugins);
    course.decode(c);
    var results = BBI.getId('results', document);
    results.appendChild(course.displayResults());
  }
} else {
  modal = buildModal();
  document.body.appendChild(modal);
  modal = new Modal('Scan');
  document.body.appendChild(modal.getModal());
  BBI.addPrimaryMenuButton('Scan Course', makeCourse);
}


function makeCourse (e) {
  e.preventDefault();
  console.log('Building Course');
  // scanningModal();
  modal.show();
  modal.updateDisplay(BBI.makeNode('div > p {Scanning Course}'));
  course = new Course(BBI.getCourseId(), BBI, Plugins);
  course.getCourse()
    .then(scanCourse)
    .catch(catchError);
}

function scanCourse () {
  console.log('Scanning Course');
  course.scan()
    .then(saveResults)
    .catch(catchError);
}

function saveResults () {
  console.log('Orignal');
  console.log(course);
  var c = course.encode();
  console.log(c);
  setToStorage(c.id, c);
  console.log('saved', c.id);
  modal.updateDisplay(finishedModal(c.id));

  console.log(getFromStorage(c.id));
}

function displayResults () {
  var results = course.displayResults();
  console.log(results);
  document.getElementById('content_listContainer').appendChild(results);
}

function catchError (err) {
  console.log(err);
}

function buildModal() {
  var modalNode = BBI.makeNode('div#scanner-modal > div#scanner-modal-bg + div#scanner-modal-box');
  console.log(modalNode);
  var modalBox = BBI.getChild('#scanner-modal-box', 0, modalNode);
  var attrs = {
    modal: {
      display: 'none',
      position: 'absolute',
      width: '100%',
      height: '100%',
      boxSizing: 'border-box',
      top: '0',
      left: '0',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalBg: {
      position: 'absolute',
      boxSizing: 'border-box',
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      top: '0',
      left: '0',
      zIndex: '1000'
    },
    modalBox: {
      display: 'flex',
      width: '200px',
      height: '75px',
      backgroundColor: '#333333',
      color: '#DDDDDD',
      borderRadius: '20px',
      border: '3px solid #DDDDDD',
      padding: '0 10px',
      fontSize: '24px',
      lineHeight: '24px',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: '1001'
    }
  };

  BBI.setStyle(attrs.modal, modalNode);
  BBI.setStyle(attrs.modalBg, BBI.getChild('#scanner-modal-bg', 0, modalNode));
  BBI.setStyle(attrs.modalBox, modalBox);
  BBI.getChild('#scanner-modal-bg', 0, modalNode).addEventListener('click', function (e) {
    BBI.setStyle({ display: 'none' }, e.target.parentElement);
  }.bind(this));
  return modalNode;
}

function scanningModal () {
  BBI.setStyle({ display: 'flex' }, modal);
  BBI.deleteChild('#scanner-modal-box > div', 0, modal);
  var scanningNode = BBI.makeNode('div > p {Scanning Course}');
  BBI.getChild('#scanner-modal-box', 0, modal).appendChild(scanningNode);
}

function finishedModal(courseId) {
  var resultsPage = 'https://redice44.github.io/bb-util-scripts/results.html?course_id=';
  // BBI.setStyle({ display: 'flex' }, modal);
  // BBI.deleteChild('#scanner-modal-box > div', 0, modal);
  var modalNode = BBI.makeNode('div > a {View Results}');
  var linkNode = BBI.getChild('a', 0, modalNode);
  BBI.setAttr({ href: `${resultsPage}${courseId}`, target: '_blank'}, linkNode);
  BBI.setStyle({ color: '#DDDDDD' }, linkNode);
  linkNode.appendChild(newWindowIcon('#DDDDDD'));
  // BBI.getChild('#scanner-modal-box', 0, modal).appendChild(modalNode);
  return modalNode;
}







