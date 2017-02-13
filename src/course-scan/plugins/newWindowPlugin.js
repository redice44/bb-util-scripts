var linkNewWindowPlugin = {
  parser: function (item, page) {
    var links = item.querySelectorAll('a');
    var currentItemTitle = item.querySelector('div.item > h3').innerText;

    // if (!page.hasOwnProperty('newWindow')) {
    //   page = Object.assign({}, { newWindow: [] }, page);
    // }

    if (links) {
      // Find the item
      var currentItem = page.items.find(function(i) {
        return i.title === currentItemTitle;
      });

      currentItem.newWindow = [];

      links.forEach(function(link) {
        var target = link.getAttribute('target');
        var href = link.getAttribute('href');

        if (!href.match(/^#/) &&
            !href.match(/^javascript/) &&
            !href.match(/fiu\.blackboard\.com/) &&
            !href.match(/^\/webapps\//)) {
          if (!target || target && target.trim().toLowerCase() !== '_blank') {
            console.log('title', link.innerText);
            console.log('target ', target);
            console.log('href', href);
            console.log('valid no target=_blank');
            var title = link.innerText.trim() || 'NO LINK TEXT!!';
            currentItem.newWindow.push({
              title: title,
              url: link.href,
              parentId: item.id.split(':')[1]
            });
          }
        }
      }, this);
    }

    return page;
  },
  getDom: function (item) {
    var resultDom = document.createElement('div');
    if (item.newWindow && item.newWindow.length > 0) {
      // var heading = document.createElement('p');
      // heading.appendChild(document.createTextNode('List of Links that open in same window: '));
      // resultDom.appendChild(heading);
      var contentPageUrl = 'https://fiu.blackboard.com/webapps/blackboard/content/listContentEditable.jsp?';
      var list = document.createElement('ul');
      item.newWindow.forEach(function(i) {
        var domNode = document.createElement('li');
        var link = document.createElement('a');
        var title = i.title;
        link.appendChild(document.createTextNode(title));
        link.setAttribute('href', contentPageUrl + 'course_id=' + item.courseId + '&content_id=' + item.contentId + '#contentListItem:' + i.parentId);
        link.setAttribute('target', '_blank');
        domNode.appendChild(link);
        domNode.insertAdjacentElement('beforeend', this.addSlice());
        list.appendChild(domNode);
      }, this);
      resultDom.appendChild(list);
      resultDom.classList.add(this.__myCSS__, 'plugin-result');
    }

    return resultDom; 
  },
  hasIssue: function (dom) {
    return dom.classList.contains(this.__myCSS__);
  },
  getLegendColor: function() {
    return this.__myColor__;
  },
  addIssue: function (parent) {
    parent.classList.add(this.__myCSS__, 'issue');
    parent.insertAdjacentElement('beforeend', this.addSlice());
  },
  addSlice: function () {
    var slice = document.createElement('div');
    var tooltip = document.createElement('span');
    tooltip.appendChild(document.createTextNode('Contains Link that does not open in new window.'));
    tooltip.classList.add('tooltiptext', 'tooltip-left');
    slice.appendChild(tooltip);
    slice.style.backgroundColor = this.__myColor__;
    slice.style.color = this.__myColor__;
    slice.style.display = 'inline-block';
    slice.classList.add('slice', 'tooltip');
    return slice;
  },
  addFilter: function() {
    var optionDom = document.createElement('option');
    optionDom.appendChild(document.createTextNode('New Window'));
    optionDom.setAttribute('value', 'new-window');

    return optionDom;
  },
  filter: function() {
    var results = document.getElementById('results');
    var detailsFilter = document.getElementById('filter-details');
    var nodes = results.querySelectorAll('article > header:not(.' + this.__myCSS__ + ')');

    if (detailsFilter.value === 'new-window') {
      nodes.forEach(function (item) {
        item.classList.add('hide');
      });
      nodes = results.querySelectorAll('.folder > header:not(.' + this.__myCSS__ + ')');
      nodes.forEach(function (item) {
        item.classList.add('hide');
      });
    }

    // if (filter) {
    //   if (nodes) {
    //     nodes.forEach(function(item) {
    //       item.classList.add('hide');
    //     });
    //   }
    // } else {
    //   if (nodes) {
    //     results.querySelectorAll('article > header:not(.' + this.__myCSS__ + ')').forEach(function(item) {
    //       item.classList.remove('hide');
    //     });
    //   }
    // }

  },
  __myCSS__: 'not-new-window',
  __myColor__: '#FF0000'
};