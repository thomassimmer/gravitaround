/* global google */

(function(angular) {
  'use strict';

  var app = angular.module('google-maps');

  app.directive('ajax', function() {
    return {
      require: '^googleMap',
      restrict: 'ECMA',
      scope: true,
      link: function($scope, $element, $attrs, ctrl) {
        var expression = $attrs.url + ' + ' +
                         $attrs.coords + '.latitude + ' +
                         $attrs.coords + '.longitude';

        $scope.$watch(expression, function() {
          $scope.map.refresh();
        });
      }
    };
  });
})(angular);

(function(angular, google) {
  'use strict';

  var app = angular.module('bluetils.map.directives', []);

  app.directive('placeAutocomplete', function() {
    return {
      require: 'ngModel',
      restrict: 'ECMA',
      transclude: true,
      scope: {
        ngModel: '=',
        bounds: '='
      },
      link: function($scope, $element, $attrs, ctrl) {
        var options = {
          types: [
            'geocode'
          ]
        };

        if (angular.isDefined($scope.bounds)) {
            var southwest = new google.maps.LatLng(
              $scope.bounds.southwest.latitude,
              $scope.bounds.southwest.longitude
            ),
            northeast = new google.maps.LatLng(
              $scope.bounds.northeast.latitude,
              $scope.bounds.northeast.longitude
            );

            options.bounds = new google.maps.LatLngBounds(southwest, northeast);
        }

        angular.forEach($element, function(element) {

          if (google && google.maps && google.maps.places) {

            var autocomplete = new google.maps.places.Autocomplete(element, options);
            google.maps.event.addListener(autocomplete, 'place_changed', function() {
              var place = autocomplete.getPlace();

              if (angular.isUndefined(place.geometry)) {
                return;
              }

              $scope.$apply(function() {
                ctrl.$setViewValue(place.formatted_address);

                $scope.$parent.map.ajax.latitude = place.geometry.location.lat();
                $scope.$parent.map.ajax.longitude = place.geometry.location.lng();
              });
            });

          }
        });
      },
      template: '<input type="text" class="form-control" ng-transclude>',
      replace: true
    };
  });
})(angular, google);
