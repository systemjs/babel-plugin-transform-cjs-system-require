(function(require) {
  if (typeof require != 'undefined' && eval('typeof require') == 'undefined') {
    return;
  }
  require('withoutTrailingSlash');
  require('withTrailingSlash/');
  require('some' + 'expression');
})(require);