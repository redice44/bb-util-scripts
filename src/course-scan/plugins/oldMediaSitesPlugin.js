var mediaSitesOldLinkPlugin = {
  parser: function (item, page) {
    console.log('Old MedaiSites Plugin Parse');
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

      currentItem.mediaSitesOldLink = [];

      links.forEach(function(link) {
        var href = link.getAttribute('href');

        if (href.includes('fiuonline.mediasite.com')) {
          var title = link.innerText.trim() || 'NO LINK TEXT!!';
          currentItem.mediaSitesOldLink.push({
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
    if (item.mediaSitesOldLink && item.mediaSitesOldLink.length > 0) {
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
      title.appendChild(document.createTextNode('Old MediaSites Links:'));
      resultDom.appendChild(title);
      // var heading = document.createElement('p');
      // heading.appendChild(document.createTextNode('List of old MediaSites Links: '));
      // resultDom.appendChild(heading);
      var contentPageUrl = 'https://fiu.blackboard.com/webapps/blackboard/content/listContentEditable.jsp?';
      var list = document.createElement('ul');
      item.mediaSitesOldLink.forEach(function(i) {
        var domNode = document.createElement('li');
        var link = document.createElement('a');
        var title = i.title;
        link.appendChild(document.createTextNode(title));
        link.setAttribute('href', contentPageUrl + 'course_id=' + item.courseId + '&content_id=' + item.contentId + '#contentListItem:' + i.parentId);
        link.setAttribute('target', '_blank');
        domNode.appendChild(link);
        // domNode.insertAdjacentElement('beforeend', this.addSlice());
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
    // return dom.classList.contains(this.__myCSS__);
  },
  getLegendColor: function() {
    return this.__myColor__;
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

    // parent.insertAdjacentElement('beforeend', alertIcon);

    parent.classList.add(this.__myCSS__);

    return alertIcon;














    // console.log('media parent', parent);
    // parent.querySelector('.' + this.__myCSS__).classList.remove('off');
    // parent.classList.add(this.__myCSS__, 'issue');
    // parent.insertAdjacentElement('afterbegin', this.addSlice());
  },
  addFilterButton: function () {
    var squareDom = document.createElement('div');
    squareDom.classList.add(this.__myCSS__, 'off');
    squareDom.style.backgroundColor = this.__myColor__;

    return squareDom;
  },
  addSlice: function () {
    // var slice = document.createElement('div');
    // var tooltip = document.createElement('span');
    // tooltip.appendChild(document.createTextNode('Contains old MediaSites Link.'));
    // tooltip.classList.add('tooltiptext', 'tooltip-left');
    // slice.appendChild(tooltip);
    // slice.style.backgroundColor = this.__myColor__;
    // slice.style.color = this.__myColor__;
    // slice.style.display = 'inline-block';
    // slice.classList.add('slice', 'tooltip');
    console.log('slice')
    var slice = document.createElement('div');
    slice.appendChild(folderIcon);
    return slice;
  },
  addFilter: function() {
    var optionDom = document.createElement('option');
    optionDom.appendChild(document.createTextNode('Old MediaSites'));
    optionDom.setAttribute('value', 'old-mediasites');

    return optionDom;
  },
  filter: function() {
    var results = document.getElementById('results');
    var detailsFilter = document.getElementById('filter-details');
    var nodes = results.querySelectorAll('article > header:not(.' + this.__myCSS__ + ')');

    if (detailsFilter.value === 'old-mediasites') {
      nodes.forEach(function (item) {
        item.classList.add('hide');
      });
      nodes = results.querySelectorAll('.folder > header:not(.' + this.__myCSS__ + ')');
      nodes.forEach(function (item) {
        item.classList.add('hide');
      });
    }
  },
  __myCSS__: 'old-mediasites',
  __myColor__: '#0000FF'
};
