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
    var _this = this;
    var url = this.id ? '/user/' + id : '/user';
    var httpPromise = $http({method: 'POST', url: url, data: this});
    if (shouldUpdate !== false){
      httpPromise.then(function(data){
        updateModel(_this, data.data);
      });
    }
    return httpPromise.then(getData);
  };

  User.prototype.getFavorites = function(id){
    return $http({method: 'GET', url: '/user/' + id + '/favorite'}).then(getData);
  };

  function getData(obj){
    return obj.data;
  }

  function updateModel(a, b){
    Object.getOwnPropertyNames(b).forEach(function(prop){
      a[prop] = b[prop];
    });
  }

  // var User = $resource('/user/:id', {id: '@id'}, {
  //   getFavorites: { method:'GET', url: '/user/:id/favorite', isArray:true },
  //   addFavorite: { method:'POST', url: '/user/:id/favorite', params:{id: '@id'} }
  // });

  // User.prototype.addFavorite = function(){
  //   console.log("adding favorite");
  // };

  return User;
})