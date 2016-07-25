(function (require) {
  if (typeof require != 'undefined' && eval('typeof require') == 'undefined') {
    exports.cjs = true;
  }
  if (false) {
    require('withoutTrailingSlash');
    require('withTrailingSlash');
    require('some' + 'expression');
  }
})(require);