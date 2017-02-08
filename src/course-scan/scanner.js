var scanner = {
  contentFolderController: '/webapps/blackboard/content/listContentEditable.jsp?',
  courseId: null,
  contentId: null,
  plugins: [],
  init: function(plugins) {
    this.courseId = document.getElementById('course_id').value;
    this.contentId = document.getElementById('content_id').value;
    this.plugins = plugins;

    if (window.location.href.includes('&scanning=true')) {
      this.checkPage();
    } else {
      this.addButtons();
    }
  },
  checkPage: function() {
    var courseMap = getFromStorage(this.courseId);

    if (courseMap) {
      if (courseMap.path.length > 0) {
        // continue walk
        nextStep(courseMap);
      } else {
        console.log('Course already scanned.');
        viewResults();
      }
    } else {
      // Build course entry
      console.log('Building new course entry.');
      var nodes = this.getCourseRoot();
      courseMap = Object.assign({}, {
        path: [0],
        max: [nodes.length - 1],
        nodes: nodes,
        startTime: Date.now(),
        numItems: 0
      });
      setToStorage(this.courseId, courseMap);
      // initiate walk
      window.location = courseMap.nodes[0].url + '&scanning=true';
    }
  },
  getCourseRoot: function () {
    var _root = [];
    var menuItems = document.getElementById('courseMenuPalette_contents');
    menuItems = menuItems.querySelectorAll('li.clearfix > a');
    menuItems.forEach(function(link) {
      if (link.href.includes(this.contentFolderController)) {
        _root.push(this._makeLink(link));
      }
    });

    return _root;
  },
  _makeLink: function (link) {
    var contentId = 'Error: Content ID not parsed';
    var courseId = 'Error: Course ID not parsed';
    var params = getParameters(link.href);

    if (params.hasOwnProperty('content_id')) {
      contentId = params.content_id;
    }
    if (params.hasOwnProperty('course_id')) {
      courseId = params.course_id;
    }

    return {
      url: link.href,
      title: link.innerText,
      contentId: contentId,
      courseId: courseId
    };
  },
  finishScan: function () {
    var courseMap = getFromStorage(courseId);
    var elapsedSec = Math.floor((Date.now() - courseMap.startTime) / 1000);
    courseMap.elapsedTime = elapsedSec;
    setToStorage(courseId, courseMap);
    console.log(courseMap);
    // Return to initial page and stop scanning
    window.location = courseMap.nodes[0].url;
  },
  getStep: function (courseMap) {
    var step = courseMap;

    // console.log('get step parent', step);
    for (var i = 0; i < courseMap.path.length; i++) {
      // console.log('get step', step);
      step = step.nodes[courseMap.path[i]];
    }

    return step;
  },
  updateNode: function (node) {
    node.scanned = true;
  },
  takeStep: function (courseMap, step) {
    step = this.getStep(courseMap);
    setToStorage(courseId, courseMap);
    window.location = step.url + '&scanning=true';
  },
  updatePath: function (courseMap) {
    if (courseMap.path[courseMap.path.length - 1] < courseMap.max[courseMap.path.length - 1]) {
      // continue scanning laterally
      courseMap.path[courseMap.path.length - 1]++;
      console.log('continue scanning laterally');
    } else if (courseMap.path.length > 0) {
      // Completed the depth scan at this level. Go to parent
      courseMap.path.pop();
      courseMap.max.pop();
      console.log('finished scanning page. go up a level');
    }
  },
  nextStep: function (courseMap) {
    // Get current page's node.
    var step = this.getStep(courseMap);

    if (step.nodes) {
      this.updatePath(courseMap);
    } else {
      // This page has not been scanned yet.
      var content = parsePage(scannerPlugins);
      // console.log('content', content);
      // step = Object.assign({}, content, step);
      for (var d in content) {
        // console.log('attr', d);
        step[d] = content[d];
      }
      // console.log('step', step);
      // step.nodes = content.dir;
      // step.numItems = content.numItems;
      if (step.nodes && step.nodes.length > 0) {
        // has children
        courseMap.path.push(0); // add another layer of depth;
        courseMap.max.push(step.nodes.length - 1);
        console.log('new scan with children. go down a level');
      } else {
        this.updatePath(courseMap);
      }
    }

    if (courseMap.path.length > 0) {
      this.updateNode(step);
      this.takeStep(courseMap, step);
    } else {
      console.log('Course Completed');
      this.updateNode(step);
      setToStorage(courseId, courseMap);
      this.finishScan();
    }
  },
  addButtons: function () {
    var items = [
      {
        linkName: 'Scan Course',
        action: this.checkPage
      },
      {
        linkName: 'View Results',
        action: this.viewResults
      },
      {
        linkName: 'Reset Scan',
        action: this.resetScan
      }
    ];

    makePrimarySubMenuButton('Scanner', items);
  },
  viewResults: function () {
    window.open('https://redice44.github.io/bb-util-scripts/results.html?course_id=' + course_id);
  },
  resetScan: function () {
    console.log('Resetting Scan', courseId);
    delFromStorage(courseId);
  }, 
  /*
  parseCourseId: function (url) {
    if (url.includes('course_id=')) {
      var params = url.split('?')[1];
      params = params.split('&');
      params = params.reduce(function(acc, val) {
        console.log(val);
        if (val.includes('course_id')) {
          console.log('course_id', val);
          return val.split('=')[1];
        }
        return acc;
      }, '');
      return params;
    }
  }
  */
};
