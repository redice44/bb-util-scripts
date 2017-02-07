var itemCountPlugin = {
  parser: function (item, page) {
    if (!page.hasOwnProperty('numItems')) {
      page = Object.assign({}, { numItems: 0 }, page);
    }

    page.numItems++;
    return page;
  }
};
