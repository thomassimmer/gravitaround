(function(angular) {
  'use strict';

  var app = angular.module('bluetils.map.filters', []);

  app.filter('batteryLevel', function() {
    var steps = [
      80,
      50,
      20,
      0
    ];

    return function(level) {
      return _(steps).find(function(step) {
        return step <= level;
      });
    };
  });
})(angular);
