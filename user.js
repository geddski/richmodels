var app = angular.module('app', []);

app.factory('User', function($http, $q){
  var User = function User(name){
    this.name = name;
  };

  User.query = function(){
    return $http({method: 'GET', url: '/user'}).then(getData);
  };  

  User.get = function(id){
    return $http({method: 'GET', url: '/user/' + id}).then(getData);
  };

  User.prototype.save = function(shouldUpdate){
    var url = this.id ? '/user/' + id : '/user'; // TODO need something better for this too, like what Resource has
    var httpPromise = $http({method: 'POST', url: url, data: this});
    canUpdate(this, httpPromise, shouldUpdate);
    return httpPromise.then(getData);
  };

  User.prototype.addFavorite = function(user){
    return $http({method: 'POST', url: '/user/' + this.id + '/favorite?id=' + user.id}).then(getData);
  };



  // utils to put into richmodel.js or something

  function getData(obj){
    return obj.data;
  }

  /**
   * todo maybe mixin this shiz, less params
   */
  function canUpdate(instance, promise, shouldUpdate){
    if (shouldUpdate !== false){
      promise.then(function(data){
        updateModel(instance, data.data);
      });
    }
  }

  function updateModel(a, b){
    Object.getOwnPropertyNames(b).forEach(function(prop){
      a[prop] = b[prop];
    });
  }

  return User;
})