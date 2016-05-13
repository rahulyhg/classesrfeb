'use strict';

angular.module('myApp.viewmm', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/add/mm', {
    templateUrl: 'viewmm/add.html',
    controller: 'ViewAddMMCtrl'
  }).when('/mm', {
    templateUrl: 'viewmm/viewmm.html',
    controller: 'ViewMMCtrl'
  });
}])

.controller('ViewMMCtrl', ['$scope', function($scope) {
  
}])

.controller('ViewAddMMCtrl', ['$scope', function($scope) {
  
}]);