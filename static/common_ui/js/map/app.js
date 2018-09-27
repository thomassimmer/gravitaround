(function(angular, currentLanguage) {
  'use strict';

  angular.module('bluetils.map', [
    'gettext',
    'ui.bootstrap',
    'google-maps',
    'bluetils.map.controllers',
    'bluetils.map.directives',
    'bluetils.map.filters',
    'bluetils.map.services'
  ]).run(function(gettextCatalog) {
    gettextCatalog.currentLanguage = currentLanguage;
  });
})(angular, LANGUAGE_CODE.substr(0, 2));
