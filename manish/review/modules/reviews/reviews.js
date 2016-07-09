'use strict';

angular.module('myApp.reviews', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl:  'modules/reviews/search.html',
    controller: 'ViewSearchCtrl'
  })
    .when('/create', {
    templateUrl: 'modules/reviews/create.html',
    controller: 'ViewCreateCtrl'
  })
    .when('/create/images/:id', {
    templateUrl: 'modules/reviews/images.html',
    controller: 'ViewImagesCtrl'
  })
  //route for search and browse
  .when('/search', {
    templateUrl: 'modules/reviews/search.html',
    controller: 'ViewSearchCtrl'
  })
   //search and browse
  
  // '/search'
  // '/search/0'
  // '/search/0/keyword'
  // '/search/0/lat/lng/radius'
  // '/search/0/keyword/lat/lng/radius'
  
  .when('/search/:page/:keyword/:lat/:lng/:radius/:location', {
    templateUrl: 'modules/reviews/search.html',
    controller: 'ViewSearchCtrl'
  })
  
  
  .when('/search/:page/:lat/:lng/:radius/:location', {
    templateUrl: 'modules/reviews/search.html',
    controller: 'ViewSearchCtrl'
  })
  
  
  .when('/search/:page/:keyword', {
    templateUrl: 'modules/reviews/search.html',
    controller: 'ViewSearchCtrl'
  })
  
  .when('/search/:page', {
    templateUrl: 'modules/reviews/search.html',
    controller: 'ViewSearchCtrl'
  })
  
  .when('/search', {
    templateUrl: 'modules/reviews/search.html',
    controller: 'ViewSearchCtrl'
  })
  
  .when('/detail/:id', {
    templateUrl: 'modules/reviews/detail.html',
    controller: 'ViewDetailCtrl'
  })
  
  //my profile route
  .when('/my/:page', {
    templateUrl: 'modules/reviews/my.html',
    controller: 'ViewMyProfileCtrl'
  })
  .when('/my', {
    templateUrl: 'modules/reviews/my.html',
    controller: 'ViewMyProfileCtrl'
  })
  
;
}])

.controller('ViewDetailCtrl', ['$scope', '$location', 'dataService', '$routeParams', function($scope, $location, dataService, $routeParams) {
 
    $scope.results = {};
  
  $scope.setImage = function(image) {
    $scope.results.mainImage = image;
  };
            
    
    function getSuccess(response) {
    $scope.results = response.data.data;
    
    var images = $scope.results.detailsFull.images;
    if (images) {
      angular.forEach(images, function(value1, key1) {
        if (!$scope.results.mainImage) {
          $scope.results.mainImage = value1;
        }//end if
      });//end foreach
    }//end if
    
    if (!$scope.results.mainImage) {
      $scope.results.mainImage = 'images/noimage.jpg';
    }//end if
    console.log($scope.results);
  }
  
  function getFailure(response) {
    console.log('failed: ', response);
  }
  
  var url = 'http://api.mkgalaxy.com/records.php?action=getOne&id='+$routeParams.id;
  dataService.get(url, getSuccess, getFailure, true); 
  
}])

// controller for my profile
.controller('ViewMyProfileCtrl', ['$scope', '$location', 'dataService', '$routeParams', function($scope, $location, dataService, $routeParams) {
  
  

  
  $scope.frm = {};
  
  
  $scope.frm.urlPrefix = '#/my';
  $scope.frm.urlSufix = '';
  
  
  //initialize the value of page, i.e. default value
  $scope.frm.page = 0;
  
  //page from url, if something coming from url, i will use that
  if ($routeParams.page) {
    $scope.frm.page = $routeParams.page;
  }
  //page
  
  $scope.results = null;
  
  
  function successGetData(response) {
    console.log('success: ', response);
    $scope.results = response.data.data.results;
    
    //create the mainImage
    angular.forEach($scope.results, function(value, key) {
      var images = value.detailsFull.images;
      if (images) {
        angular.forEach(images, function(value1, key1) {
          if (!$scope.results[key].mainImage) {
            $scope.results[key].mainImage = value1;
          }//end if
        });//end foreach
      }//end if
      
      if (!$scope.results[key].mainImage) {
        $scope.results[key].mainImage = 'images/noimage.jpg';
      }//end if
    });//end foreach
    //image ends
    
    $scope.data = response.data.data;
  }
  
  function failureGetData(response) {
    console.log('failed: ', response);
  }
  
  $scope.getData = function() {
    var url = 'http://api.mkgalaxy.com/records.php?action=my&showLocation=1&path=/manish/reviews&max=12&noCache=1';
    
    
    url = url + '&page=' + $scope.frm.page;
    
    var access_token = $scope.userData.token;
    url = url + '&access_token='+access_token;
    dataService.get(url, successGetData, failureGetData, false);
  };//get data ends
  
  $scope.getData();//get data on page load
}])


//controller for search and browse
.controller('ViewSearchCtrl', ['$scope','dataService','$location','$routeParams',function($scope,dataService,$location,$routeParams) {
 
    //location starts
  $scope.mapOptions = {
    types: 'geocode'
  };

  $scope.details = {};
  $scope.details.components = {};
  //location ends             
                
  //console.log('route param is ', $routeParams);
  $scope.frm = {};
  
  $scope.frm.urlPrefix = '#/search';
  $scope.frm.urlSufix = '';
  
   //initialize the value of page, i.e. default value
  $scope.frm.page = 0;
  
  //page from url, if something coming from url, i will use that
  if ($routeParams.page) {
    $scope.frm.page = $routeParams.page;
  }
  //page
  
  //default keyword
  $scope.frm.keyword = '';
  
  //check if url has keyword
  if ($routeParams.keyword) {
    $scope.frm.keyword = decodeURIComponent($routeParams.keyword);
    
    $scope.frm.urlSufix = $scope.frm.urlSufix + '/' + $routeParams.keyword;
  }
  
  
  $scope.frm.radius = 30;
  
    if ($routeParams.lat) {
    $scope.details.components.lat = $routeParams.lat;
    $scope.frm.urlSufix = $scope.frm.urlSufix + '/' + $routeParams.lat;
  }
  
  if ($routeParams.lng) {
    $scope.details.components.lng = $routeParams.lng;
    $scope.frm.urlSufix = $scope.frm.urlSufix + '/' + $routeParams.lng;
  }
 
  if ($routeParams.radius) {
     $scope.frm.radius = $routeParams.radius;
    $scope.frm.urlSufix = $scope.frm.urlSufix + '/' + $routeParams.radius;
  }
  
  if ($routeParams.location) {
    $scope.location = decodeURIComponent($routeParams.location);
    
    $scope.frm.urlSufix = $scope.frm.urlSufix + '/' + $routeParams.location;
  }
 
  $scope.results = null;
  
  
  function successGetData(response) {
    console.log('success: ', response.data.data.results);
    $scope.results = response.data.data.results;
    
    //create the mainImage
    angular.forEach($scope.results, function(value, key) {
      var images = value.detailsFull.images;
      if (images) {
        angular.forEach(images, function(value1, key1) {
          if (!$scope.results[key].mainImage) {
           $scope.results[key].mainImage = value1;
          }
        });
      }
      
      if (!$scope.results[key].mainImage) {
        $scope.results[key].mainImage = 'images/noimage.jpg';
      }
    });
    
    console.log($scope.results);
    
     $scope.data = response.data.data;
  }
  
  function failureGetData(response) {
    console.log('failed: ', response);
  }
  
  
  $scope.getData = function() {
      
      var url = 'http://api.mkgalaxy.com/records.php?action=getAll&showLocation=1&path=/manish/reviews&max=12';
    //check the keyword
    if ($scope.frm.keyword) {
      url = url + '&q=' + encodeURIComponent($scope.frm.keyword); 
    }
    
    //check the location
    if ($scope.location) {
      url = url + '&lat='+$scope.details.components.lat+'&lon='+$scope.details.components.lng+'&r='+encodeURIComponent($scope.frm.radius);
    }
     url = url + '&page=' + $scope.frm.page;
    console.log(url);
    dataService.get(url, successGetData, failureGetData, true);//true is for cache
    
  };//get data ends
  
  $scope.getData();//get data on page load
  
  /*Purpose of construct url is to create the url and pass the user to that url, it does not do any backend work. it just do client side redirection. url is contructed based on the route which we created.*/
  
  $scope.constructURL = function() {
    var url = '/search/0';
    
    if ($scope.frm.keyword) {
      url = url + '/' + encodeURIComponent($scope.frm.keyword);
    }
    
    if ($scope.location) {
      if (!$scope.frm.radius) {
        $scope.frm.radius = 30;
      }
      
      url = url + '/' + $scope.details.components.lat + '/' + $scope.details.components.lng + '/' + encodeURIComponent($scope.frm.radius) + '/' + encodeURIComponent($scope.location);
    }
    // to send user to url
    $location.path(url);
  };
  
}])

.controller('ViewLessonsCtrl', ['$scope',function($scope) {

}])

.controller('ViewCreateCtrl', ['$scope','$location','dataService', 'configs', function($scope,$location,dataService, configs) {
   //location starts
   console.log(configs);
  $scope.mapOptions = {
    types: 'geocode'
  };

  $scope.details = {};
 
  //location ends
  
  $scope.frm = {};
    //rating
    $scope.frm.rating = 10;
    $scope.rateFunction = function(rating) {
      $scope.frm.rating = rating;
    };
    //rating
  
  function addSuccess(response) {
    console.log('success: ', response);
    console.log('id is : ', response.data.data.id);
    $scope.frm = {};
    $location.path('/create/images/'+response.data.data.id);
    console.log(response.data.data.id);
  }
  
  function addFailure(response) {
    console.log('failure: ', response);
  }
  
   $scope.submitCreateForm = function() {
     
     var url = 'http://api.mkgalaxy.com/records.php?action=add&saveIP=1&access_token='+$scope.userData.token+'&path=/manish/reviews&tid=1';
     
     console.log(url);
     
    
    var postData = '';
    postData = postData + '&title='+encodeURIComponent($scope.frm.title);
    postData = postData + '&description='+encodeURIComponent($scope.frm.description);
    
    postData = postData + '&location[latitude]='+encodeURIComponent($scope.details.components.lat);
    postData = postData + '&location[longitude]='+encodeURIComponent($scope.details.components.lng);
    postData = postData + '&location[country]='+encodeURIComponent($scope.details.components.country);
    postData = postData + '&location[state]='+encodeURIComponent($scope.details.components.state);
    postData = postData + '&location[city]='+encodeURIComponent($scope.details.components.city);
    postData = postData + '&location[zip]='+encodeURIComponent($scope.details.components.postal_code);
    postData = postData + '&location[place_id]='+encodeURIComponent($scope.details.place_id);
    postData = postData + '&location[county]='+encodeURIComponent($scope.details.components.county);
    postData = postData + '&location[formatted_addr]='+encodeURIComponent($scope.details.formatted_address);
    
    postData = postData + '&reference_id='+encodeURIComponent($scope.frm.reference_id);
    postData = postData + '&data[email]='+encodeURIComponent($scope.frm.email);
    postData = postData + '&data[phone]='+encodeURIComponent($scope.frm.phone);
    postData = postData + '&i1='+encodeURIComponent($scope.frm.rating);
    $scope.frm.tags = $scope.frm.title + ',' + $scope.frm.phone + ',' + $scope.frm.email;
    postData = postData + '&tags='+($scope.frm.tags ? encodeURIComponent($scope.frm.tags) : '');
    //url
    var access_token = $scope.userData.token;
    var path = '/manish/reviewBox';
    var url = configs.apiUrl+'records.php?action=add&tid='+configs.tid+'&saveIP=1&access_token='+access_token+'&path='+path;
    console.log('url: ', url);
    console.log(postData);
    dataService.post(url, postData, addSuccess, addFailure);
  };
}])

.controller('ViewImagesCtrl', ['$scope', '$location', 'dataService', '$routeParams', function($scope, $location, dataService, $routeParams) {
  
  $scope.id = $routeParams.id;
 
  
  //get Data part
  $scope.images = null;
  function successGetData(response) {
    console.log('success: ', response);
    
    $scope.images = response.data.data.detailsFull.images;
  }
  
  function failureGetData(response) {
    console.log('failed: ', response);
  }
  
  $scope.getData = function() {
    var url = 'http://api.mkgalaxy.com/records.php?action=getOne&noCache=1&id='+$routeParams.id;
    dataService.get(url, successGetData, failureGetData, false);
  };
  
  //call the getdata function
  $scope.getData();
   //end getData part
  
  
  
  //add Image in database
        
  $scope.frm = {};
  
  function addImageSuccess(response) {
    console.log('success: ', response);
    $scope.frm = {};
    
     $scope.getData();
  }
  
  function addImageFailure(response) {
    console.log('failed: ', response);
  }
  
  
  $scope.addImage = function() {
    console.log($scope.frm);
    var url = 'http://api.mkgalaxy.com/records.php?action=updateSingle&access_token='+$scope.userData.token+'&key=images&id='+$routeParams.id;
    var postData = '';
    postData = postData + '&param='+encodeURIComponent($scope.frm.image);
    
    console.log(url);
    console.log(postData);  
    
    dataService.post(url, postData, addImageSuccess, addImageFailure);

  }; //add image function ends
  //ends add Image in database
  
  
  
  
 
}])

;