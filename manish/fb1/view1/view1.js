'use strict';

angular.module('myApp.view1', ['ngRoute', 'firebase'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$scope', '$firebaseArray', function($scope, $firebaseArray) {
  var ref = new Firebase('https://mycontacts12.firebaseio.com/fb1');
  $scope.records = $firebaseArray(ref);
  
  
  $scope.frm = {};
  $scope.frmEdit = {};
  
  //add new records
  $scope.addForm = function() {
    $scope.records.$add($scope.frm).then(function(ref) {
       var id = ref.key();
       console.log('record added with id: ', id);
       $scope.frm = {};
    });
  };
  
  //when user fills the edit form and submit the data, it will update the server
  $scope.editForm = function() {
    
  };
  
  //go to server, get the record and show record in edit form
  $scope.editLink = function() {
    
  };
  
  //go to server, delete the record
  $scope.deleteLink = function() {
    
  };
  
}]);