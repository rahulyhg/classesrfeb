'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'ngAutocomplete',
  'paginationModule',
  'pascalprecht.translate',
  'myApp.view1',
  'firebase',
  'googleLoginFBModule'
  //'ui.bootstrap'
])

.factory('MyErrorHandler', function ($q, $log) {
  return function (part, lang, response) {
    $log.error('The "' + part + '/' + lang + '" part was not loaded.');
    return $q.when({});
  };
})

.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider.otherwise({redirectTo: '/'});
  $locationProvider.html5Mode(true);
}])

.config(['$translateProvider', '$translatePartialLoaderProvider', function($translateProvider, $translatePartialLoaderProvider) {
  //different language files can be defined here as part
  $translatePartialLoaderProvider.addPart('a');
  $translatePartialLoaderProvider.addPart('b');
  //useloader to hand the template for translation
  $translateProvider.useLoader('$translatePartialLoader', {
    urlTemplate: '/i18n/{lang}/{part}.json',
    loadFailureHandler: 'MyErrorHandler'
  });
  var prefLang = localStorage.getItem('preferredLanguage');
  if (!prefLang) prefLang = 'us-en';
  $translateProvider.preferredLanguage(prefLang);
}])

.controller('mainController', ['$scope', '$translate', '$routeParams', function($scope, $translate, $routeParams) {
  //firebase init
  // Initialize the Firebase SDK
  var config = {
    apiKey: 'AIzaSyDnERUhALUFNxWZsjaLpT4_nqIYW2i2jDU',
    authDomain: 'mkgxy-3d7ce.firebaseapp.com',
    databaseURL: 'https://mkgxy-3d7ce.firebaseio.com/',
    storageBucket: 'mkgxy-3d7ce.appspot.com'
  };
  firebase.initializeApp(config);
  //end firebase
  
  $scope.userData = null;
  //getting the details form localStorage
  var userProfile = localStorage.getItem('userData');
  if (userProfile) {
      $scope.userData = JSON.parse(userProfile);
  }
  
  $scope.userToken = null;
  var userToken = localStorage.getItem('userToken');
  if (userToken) {
      $scope.userToken = userToken;
  }
  
  
  //language change
  $scope.changeLanguage = function (langKey) {
    $translate.use(langKey);
    localStorage.setItem('preferredLanguage', langKey);
    
    var tmp = langKey.split('-');
    $scope.country = tmp[0];
    $scope.language = tmp[1];
  };//end function changeLanguage
  
  $scope.country = 'us';
  $scope.language = 'en';
  
  //check language based on routeParams and change if needed
  $scope.checkLanguage = function(params) {
    if (!(params.country && params.language)) {
      return;
    }//end if
    
    $scope.country = params.country;
    $scope.language = params.language;
    
    var langKey = params.country + '-' + params.language;
    if (!(langKey === 'us-en' || langKey === 'us-es' || langKey === 'ca-en' || langKey === 'ca-fr')) {
      langKey = 'us-en';
    }
    $scope.changeLanguage(langKey);
  };//end function checkLanguage
  
  
  function initApp() {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        $scope.userData = {};
        $scope.userData.provider = user.providerData[0].providerId;
        // The signed-in user info.
        $scope.userData.email = user.providerData[0].email;
        $scope.userData.uid = user.uid;
        $scope.userData.displayName = user.providerData[0].displayName;
        $scope.userData.photoURL = user.providerData[0].photoURL;
        $scope.userData.providerUID = user.providerData[0].uid;
        if(!$scope.$$phase) $scope.$apply();
      } else {
        // User is signed out.
        console.log('user is signed out');
      }
    }, function(error) {
      console.log('err: ', error);
    });
  };
  
  initApp();
  
}])