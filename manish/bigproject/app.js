'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'ngAutocomplete',
  'googleLoginFBModule',
  'paginationModule',
  'messagesModule',
  'myApp.messages',
  'myApp.lessons',
  'myApp.students'
  //'ui.bootstrap'
])
.constant('configs', {
  'ineedtutor.us': {
    siteUrl: 'lessons',
    clientId: '754890700194-je7kh2gv91st19no73hf358u631uidh8.apps.googleusercontent.com',
    clientSecret: '3P-qhjGsheVQgNYronZ3Xxwz',
    apiKey: 'AIzaSyCWqKxrgU8N1SGtNoD6uD6wFoGeEz0xwbs',
    title: 'I Need Tutor :: Search/Browse Teachers And Students',
    firebaseUrl: 'https://mycontacts12.firebaseio.com/projects/lessons',
    tid: 2,
    homePage: 'modules/lessons/lessons.html'
    
  }
})



.config(['$routeProvider', '$locationProvider', 'configs', function($routeProvider, $locationProvider, configs) {
  var host = window.location.hostname;
  var homePage = configs[host].homePage;
  $routeProvider
  .when('/', {
    templateUrl: homePage,
    controller: 'homePageController'
  })
  .otherwise({redirectTo: '/'});
  $locationProvider.html5Mode(true);
}])

.controller('mainController', ['$scope', 'configs', '$location', function($scope, configs, $location) {
  
  $scope.templateUrl = null;
  var host = $location.host();
  if (configs[host].siteUrl === 'lessons') {
    $scope.templateUrl = 'modules/navItems/lessons.html';
  } else if (configs[host].siteUrl === 'student') {
    $scope.templateUrl = 'modules/navItems/student.html';
  }
  document.title = configs[host].title;
  
  $scope.userData = null;
  
  
  //getting the details form localStorage
  var userProfile = localStorage.getItem('userData');
  if (userProfile) {
      $scope.userData = JSON.parse(userProfile);
  }
  
}])

.controller('homePageController', ['$scope', function($scope) {
  
}])

;
