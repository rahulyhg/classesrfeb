angular.module('myApp').service('dataService', ['$http', '$location', function($http, $location) {
  
  this.get = function(url, callback, callbackFailed, cache) {
      $http({
        method: 'GET',
        url: url,
        cache: cache
      }).then(callback, callbackFailed);
  };
  
  //data: 'email='+encodeURIComponent($scope.frm.email)+'&question='+encodeURIComponent($scope.frm.question)+'&name='+encodeURIComponent($scope.frm.name)
  this.post = function(url, data, callback, callbackFailed) {
      $http({
        method: 'POST',
        url: url,
        data: data,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      }).then(callback, callbackFailed);
  };
  
  //data: {key: value, key: value}
  this.postJson = function(url, data, callback, callbackFailed) {
      $http({
        method: 'POST',
        url: url,
        data: data
      }).then(callback, callbackFailed);
  };
  
  this.tracking = function(ref, location, type, xtra) {
    //date
    var dt = new Date();
    var day = dt.getDate();
    var month = dt.getMonth() + 1;
    var year = dt.getFullYear();
    var hour = dt.getHours();
    var minute = dt.getMinutes();
    var seconds = dt.getSeconds();
    var createdDt = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + seconds;
    var createdDtLite = year + '-' + month + '-' + day;
    //date
    var obj = {
      createdAt: Firebase.ServerValue.TIMESTAMP,
      createdAtFull: createdDt,
      location: location.ip,
      url: $location.absUrl()
    };
    var user = btoa(location.ip);
    if (type == 1) {
      var newPostRef = ref.child('mainTracking').child('tracking').child(createdDtLite).push(obj);
      // Get the unique ID generated by push()
      var postID = newPostRef.key();
      ref.child('mainTracking').child('trackingUser').child(user).child('location').set(location);
      ref.child('mainTracking').child('trackingUser').child(user).child('access').child(createdDtLite).child(postID).set(obj);
      ref.child('mainTracking').child('trackingPath').child(btoa($location.absUrl())).child('path').set($location.absUrl());
      ref.child('mainTracking').child('trackingPath').child(btoa($location.absUrl())).child(createdDtLite).push(obj);
    } else if (type == 2) {
      var obj2 = {};
      obj2.basic = obj;
      obj2.xtra = xtra;
      ref.child('mainTracking').child('trackingSave').child(user).push(obj2);
    }  else if (type == 3) {
      var obj2 = {};
      obj2.basic = obj;
      obj2.xtra = xtra;
      ref.child('mainTracking').child('trackingDeleted').child(user).push(obj2);
    }
    return true;
  };
  
}]);
