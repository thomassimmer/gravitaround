(function(angular) {
  'use strict';

  var app = angular.module('bluetils.map.services', []);

  app.factory('Map', [
    '$http',
    'Marker',
    function($http, Marker) {
      function Map(overrides) {
        angular.extend(this, {
          ajax: {
            url: undefined,
            latitude: undefined,
            longitude: undefined
          },
          center: {
            latitude: undefined,
            longitude: undefined
          },
          zoom: 8,
          draggable: false,
          dragging: false,
          bounds: {
            northeast: {
              latitude: undefined,
              longitude: undefined
            },
            southwest: {
              latitude: undefined,
              longitude: undefined
            }
          },
          markers: {
            active: [],
            selected: []
          },
          events: {},
          refreshing: false
        }, overrides);
      }

      Map.prototype.refresh = function(callback) {
        var self = this;

        self.refreshing = true;

        var config = {
          params: {
            latitude: self.ajax.latitude,
            longitude: self.ajax.longitude
          }
        };

        $http.get(self.ajax.url, config).success(function(map) {
          angular.extend(self, {
            center: map.center,
            zoom: map.zoom,
            markers: {
              active: [],
              selected: []
            }
          });

          angular.forEach(map.markers, function(value, key) {
            if (angular.isArray(value)) {
              self.markers[key] = value.map(function(item) {
                return new Marker(item, self);
              });
            } else {
              self.markers[key] = new Marker(value, self);
            }
          });

          self.refreshing = false;

          if (angular.isFunction(callback)) {
            callback(self);
          }
        }).error(function() {
          self.refreshing = false;
        });
      };

      return Map;
    }
  ]);

  app.factory('Marker', [
    '$rootScope',
    function($rootScope) {
      function Marker(overrides, map) {
        angular.extend(this, {
          icons: {
            default: undefined,
            selected: undefined
          },
          visibleWindow: false,
          selected: false
        }, overrides);

        this.icon = this.icons.default;

        this.getMap = function() {
          return map;
        };
      }

      Marker.prototype.select = function() {
        var self = this;

        self.icon = self.icons.selected;
        self.selected = true;

        angular.forEach(self.getMap().markers.selected, function(selectedMarker) {
          if (selectedMarker !== self) {
            selectedMarker.deselect();
          }
        });

        self.getMap().markers.selected = [self];
      };

      Marker.prototype.deselect = function() {
        this.selected = false;
        this.icon = this.icons.default;

        this.getMap().markers.selected.length = 0;
      };

      Marker.prototype.showWindow = function() {
        var self = this;

        self.visibleWindow = true;

        angular.forEach(self.getMap().markers.active, function(activeMarker) {
          if (activeMarker !== self) {
            activeMarker.hideWindow();
          }
        });

        self.getMap().markers.active = [self];
      };

      Marker.prototype.hideWindow = function() {
        this.visibleWindow = false;

        this.getMap().markers.active.length = 0;
      };

      Marker.prototype.choose = function() {
        var self = this;

        $rootScope.$apply(function() {
          self.model.select();
        });
      };

      Marker.prototype.openWindow = function() {
        var self = this;

        $rootScope.$apply(function() {
          self.model.showWindow();
        });
      };

      Marker.prototype.closeWindow = function() {
        var self = this;

        $rootScope.$apply(function() {
          self.model.hideWindow();
        });
      };

      return Marker;
    }
  ]);
})(angular);
