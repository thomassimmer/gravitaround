(function(angular) {
  'use strict';

  var app = angular.module('bluetils.map.controllers', []);

  app.controller('MapCtrl', [
    '$scope',
    '$modal',
    'Map',
    function($scope, $modal, Map) {
      $scope.map = new Map();

      $scope.openModal = function() {
        $modal.open({
          templateUrl: 'mapModalContent.html',
          controller: ModalCtrl,
          resolve: {
            map: function() {
              return $scope.map;
            }
          }
        });
      };
    }
  ]);

  var ModalCtrl = function($scope, $modalInstance, map) {
    angular.extend($scope, {
      modal: $modalInstance,
      map: map
    });

    $scope.cancel = function() {
      $scope.modal.dismiss('cancel');
    };
  };
})(angular);
