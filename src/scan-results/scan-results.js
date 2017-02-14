var scanResults = {
  // Global DOM Nodes
  submitBtn: null,
  courseIdNode: null,
  resultsNode: null,
  plugins: [],
  navNodeTemplate: null,
  init: function(plugins) {
    console.log('results');
    this.plugins = plugins;
    this.submitBtn = document.getElementById('see_results');
    this.courseIdNode = document.getElementById('course_id');
    this.resultsNode = document.getElementById('results');

    var url = window.location.href;

    try {
      this.courseIdNode.value = this.parseCourseId(url);
      this.showCourse(this.courseIdNode.value);
    } catch (e) {
      // It's fine to not have an initial query parameter.
      this.courseIdNode.focus();
    }

    this.submitBtn.addEventListener('click', function(e) {
      console.log(this.courseIdNode.value);
      try {
        this.showCourse(this.parseCourseId(this.courseIdNode.value));
      } catch (e) {
        this.showCourse(this.courseIdNode.value);
      }
    });
  },
  showCourse: function (courseId) {
    var courseMap = getFromStorage(courseId);

    if (courseMap) {
      console.log('rendering results', courseMap);
      var courseNode = document.createElement('section');
      var headingNode = document.createElement('header');
      headingNode.appendChild(document.createTextNode(courseMap.title));
      courseNode.appendChild(headingNode);
      courseNode.id = courseMap.courseId;
      courseNode.classList.add('course');
      this.resultsNode.innerHTML = '';


      this.navNodeTemplate = document.createElement('nav');

      courseMap.nodes.forEach(function(items) {
        courseNode.appendChild(this.showLevel(items));
      }, this);

      this.resultsNode.appendChild(courseNode);
    } else {
      this.courseNotFound();
    }
  },
  toggleDisplay: function(e) {
    var target = e.target;
    target.classList.toggle('collapse');
  },
  __buildItem__: function(item) {
    var itemDom = document.createElement('section');

    var title = document.createElement('header');
    var pluginList = document.createElement('section');
    title.appendChild(document.createTextNode(item.title));



    var itemIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    itemIcon.setAttribute('fill', '#000000');
    itemIcon.setAttribute('height', '24');
    itemIcon.setAttribute('viewBox', '0 0 24 24');
    itemIcon.setAttribute('width', '24');
    itemIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

    var pathData1Svg = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathData1Svg.setAttribute('d', 'M6 2c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6H6zm7 7V3.5L18.5 9H13z');
    var pathData2Svg = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathData2Svg.setAttribute('d', 'M0 0h24v24H0z');
    pathData2Svg.setAttribute('fill', 'none');

    itemIcon.appendChild(pathData1Svg);
    itemIcon.appendChild(pathData2Svg);

    title.insertAdjacentElement('afterbegin', itemIcon);


    this.plugins.forEach(function(plugin) {
      var pluginDom = plugin.getDom(item);
      var pluginAlert;

      if (plugin.hasIssue(pluginDom) && !plugin.hasIssue(title)) {
        pluginAlert = plugin.addAlert(title);
        pluginAlert.addEventListener('click', function(e) {
          // Ugly for now
          var className = e.path[1].classList[0];
          var dom = e.path[3].querySelector('section.plugin-issues > .' + className);
          dom.classList.toggle('hide');

        });
        title.insertAdjacentElement('beforeend', pluginAlert);
      }
      pluginList.appendChild(pluginDom);
    }, this);

    pluginList.classList.add('plugin-issues');
    itemDom.appendChild(title);
    itemDom.appendChild(pluginList);
    return itemDom;
  },
  showLevel: function (item) {
    var itemDom = document.createElement('section');
    var title = document.createElement('header');
    var childrenList = document.createElement('article');

    var folderIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    folderIcon.setAttribute('fill', '#000000');
    folderIcon.setAttribute('height', '24');
    folderIcon.setAttribute('viewBox', '0 0 24 24');
    folderIcon.setAttribute('width', '24');
    folderIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    folderIcon.setAttribute('class', 'close-folder');

    var pathData1Svg = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathData1Svg.setAttribute('d', 'M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z');
    var pathData2Svg = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathData2Svg.setAttribute('d', 'M0 0h24v24H0z');
    pathData2Svg.setAttribute('fill', 'none');

    folderIcon.appendChild(pathData1Svg);
    folderIcon.appendChild(pathData2Svg);



    var openFolderIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    openFolderIcon.setAttribute('fill', '#000000');
    openFolderIcon.setAttribute('height', '24');
    openFolderIcon.setAttribute('viewBox', '0 0 24 24');
    openFolderIcon.setAttribute('width', '24');
    openFolderIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    openFolderIcon.setAttribute('class', 'open-folder');

    var openPathData1Svg = document.createElementNS("http://www.w3.org/2000/svg", "path");
    openPathData1Svg.setAttribute('d', 'M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z');
    var openPathData2Svg = document.createElementNS("http://www.w3.org/2000/svg", "path");
    openPathData2Svg.setAttribute('d', 'M0 0h24v24H0z');
    openPathData2Svg.setAttribute('fill', 'none');

    openFolderIcon.appendChild(openPathData1Svg);
    openFolderIcon.appendChild(openPathData2Svg);


    title.appendChild(document.createTextNode(item.title));
    title.addEventListener('click', this.toggleDisplay);
    title.classList.add('collapse');
    itemDom.classList.add('folder');
    title.insertAdjacentElement('afterbegin', openFolderIcon);    
    title.insertAdjacentElement('afterbegin', folderIcon);


    var pluginAlert;

    if (item.items) {
      item.items.forEach(function (i) {
        if (i.url) {
          // Is a folder
          var folder;
          // Get correct folder node
          item.nodes.forEach(function (node) {
            if (node.url === i.url) {
              folder = node;
            }
          }, this);
          var folderDom = this.showLevel(folder);
          folderDom.classList.add('folder');
          this.plugins.forEach(function (plugin) {
            // console.log(folderDom);
            if (plugin.hasIssue(folderDom.querySelector('header')) &&
                !plugin.hasIssue(title)) {
              pluginAlert = plugin.addAlert(title);
              title.insertAdjacentElement('beforeend', pluginAlert);
            }
          }, this);
          childrenList.appendChild(folderDom);
        } else {
          var iDom = this.__buildItem__(i);
          this.plugins.forEach(function (plugin) {
            if (plugin.hasIssue(iDom.querySelector('header')) &&
                !plugin.hasIssue(title)) {
              pluginAlert = plugin.addAlert(title);
              title.insertAdjacentElement('beforeend', pluginAlert);
            }
          }, this);
          childrenList.appendChild(iDom);
        }
      }, this);
    }

    itemDom.appendChild(title);
    itemDom.appendChild(childrenList);
    return itemDom;
  },
  parseCourseId: function (url) {
    if (url.includes('course_id=')) {
      var params = url.split('?')[1];
      params = params.split('&');
      params = params.reduce(function(acc, val) {
        if (val.includes('course_id')) {
          return val.split('=')[1];
        }
        return acc;
      }, '');

      return params;
    }
    throw new Error('Does not contain a course_id');
  },
  courseNotFound: function () {
    console.log('Course Not Found');
    this.resultsNode.innerHTML = 'Course Not Found';
  }
};
