;
(function () {
  // SHIM the F******* JQUERY UI REQUIRE !!!!
  var oldRequire = window.require;
  window.require = function (name) {
    if (oldRequire) {
      return oldRequire(name);
    }
    if (name === 'jquery') {
      return window.jQuery;
    }
  }
})();
var jQuery = window.jQuery;
