var vivoOldLinkPlugin = {
  parser: function (item, page) {
    console.log('Old vivo Plugin Parse');
    var links = item.querySelectorAll('a');
    var currentItemTitle = item.querySelector('div.item > h3').innerText;

    if (links) {
      // Find the item
      var currentItem = page.items.find(function(i) {
        return i.title === currentItemTitle;
      });

      currentItem.vivoOldLink = [];

      links.forEach(function(link) {
        var href = link.getAttribute('href');

        if (href.includes('vivoId=')) {
          var title = link.innerText.trim() || 'NO LINK TEXT!!';
          currentItem.vivoOldLink.push({
            title: title,
            url: link.href,
            parentId: item.id.split(':')[1]
          });
        }
      }, this);

      console.log(currentItem);
    }

    return page;
  },
  getDom: function (item) {
    var resultDom = document.createElement('div');
    if (item.vivoOldLink && item.vivoOldLink.length > 0) {
      var alertIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      alertIcon.setAttribute('fill', this.__myColor__);
      alertIcon.setAttribute('height', '24');
      alertIcon.setAttribute('viewBox', '0 0 24 24');
      alertIcon.setAttribute('width', '24');
      alertIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      alertIcon.setAttribute('class', this.__myCSS__);

      var pathData1Svg = document.createElementNS("http://www.w3.org/2000/svg", "path");
      pathData1Svg.setAttribute('d', 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z');
      var pathData2Svg = document.createElementNS("http://www.w3.org/2000/svg", "path");
      pathData2Svg.setAttribute('d', 'M0 0h24v24H0z');
      pathData2Svg.setAttribute('fill', 'none');

      alertIcon.appendChild(pathData1Svg);
      alertIcon.appendChild(pathData2Svg);


      var title = document.createElement('p');
      title.appendChild(alertIcon);
      title.appendChild(document.createTextNode('Old Vivo Links:'));
      resultDom.appendChild(title);

      var contentPageUrl = 'https://fiu.blackboard.com/webapps/blackboard/content/listContentEditable.jsp?';
      var list = document.createElement('ul');
      item.vivoOldLink.forEach(function(i) {
        var domNode = document.createElement('li');
        var link = document.createElement('a');
        var title = i.title;
        link.appendChild(document.createTextNode(title));
        link.setAttribute('href', contentPageUrl + 'course_id=' + item.courseId + '&content_id=' + item.contentId + '#contentListItem:' + i.parentId);
        link.setAttribute('target', '_blank');
        domNode.appendChild(link);
        list.appendChild(domNode);
      }, this);
      resultDom.appendChild(list);
      resultDom.classList.add(this.__myCSS__, 'plugin-result', 'hide');
    }

    return resultDom; 
  },
  hasIssue: function (dom) {
    var slices = dom.querySelectorAll('svg') || [];
    var result = false;
    if (slices && slices.length > 0) {
      // console.log('media slices', slices);
      slices.forEach(function (slice) {
        if (!result && slice.classList.contains(this.__myCSS__) && !slice.classList.contains('off')) {
          result = true;
        }
      }, this);
    } else {
      result = dom.classList.contains(this.__myCSS__) && !dom.classList.contains('off');
    }
    return result;
  },
  getLegendColor: function() {
    return this.__myColor__;
  },
  alertHandler: function(e) {
    var targetDom = e.target;

    while (targetDom.nodeName !== 'svg') {
      targetDom = targetDom.parentElement;
    }

    var className = targetDom.classList[0];
    // Header
    targetDom = targetDom.parentElement;
    // Update the hide
    var dom = targetDom.querySelectorAll('.' + this.__myCSS__);
    dom.forEach(function(d) {
      d.classList.toggle('hide');
    });

    // Section
    targetDom = targetDom.parentElement;
    dom = targetDom.querySelector('section.plugin-issues > .' + className);
    dom.classList.toggle('hide');
  },
  addAlertOpen: function (parent) {
    var alertIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    alertIcon.setAttribute('fill', this.__myColor__);
    alertIcon.setAttribute('height', '24');
    alertIcon.setAttribute('viewBox', '0 0 24 24');
    alertIcon.setAttribute('width', '24');
    alertIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    alertIcon.setAttribute('class', this.__myCSS__ + ' hide');

    var pathData1Svg = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathData1Svg.setAttribute('d', 'M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z');
    var pathData2Svg = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathData2Svg.setAttribute('d', 'M0 0h24v24H0V0z');
    pathData2Svg.setAttribute('fill', 'none');

    alertIcon.appendChild(pathData1Svg);
    alertIcon.appendChild(pathData2Svg);

    return alertIcon;
  },
  addAlert: function (parent) {
    var alertIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    alertIcon.setAttribute('fill', this.__myColor__);
    alertIcon.setAttribute('height', '24');
    alertIcon.setAttribute('viewBox', '0 0 24 24');
    alertIcon.setAttribute('width', '24');
    alertIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    alertIcon.setAttribute('class', this.__myCSS__);

    var pathData1Svg = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathData1Svg.setAttribute('d', 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z');
    var pathData2Svg = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathData2Svg.setAttribute('d', 'M0 0h24v24H0z');
    pathData2Svg.setAttribute('fill', 'none');

    alertIcon.appendChild(pathData1Svg);
    alertIcon.appendChild(pathData2Svg);

    parent.classList.add(this.__myCSS__);

    return alertIcon;
  },
  addSlice: function () {
    var slice = document.createElement('div');
    slice.appendChild(folderIcon);
    return slice;
  },
  __myCSS__: 'old-vivo',
  __myColor__: '#2c592c'
};
