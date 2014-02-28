var app = angular.module('app', []);

app.factory('User', function($http, $q){
  var User = function User(name){
    this.name = name;
    this.favorites = [];
  };

  User.getAll = function(){
    return $http({method: 'GET', url: '/user'}).then(getData);
  };  

  User.get = function(id){
    return $http({method: 'GET', url: '/user/' + id}).then(getData);
  };

  User.prototype.save = function(shouldUpdate){
    var url = this.id ? '/useryyyy/' + id : '/user'; // TODO need something better for this too, like what Resource has
    var httpPromise = $http({method: 'POST', url: url, data: this});
    updatesModel(this, httpPromise, shouldUpdate);
    return httpPromise.then(getData);
  };

  User.prototype.addFavorite = function(user){
    var _this = this;
    var httpPromise =  $http({method: 'POST', url: '/user/' + this.id + '/favorite?id=' + user.id})
      return httpPromise.then(function(response){
        _this.favorites.push(user);
        return getData(response);
      })
      .catch(function(){
        //Can catch here as well as in userland
      })
  };



  // utils to put into richmodel.js or something

  function getData(obj){
    return obj.data;
  }

  /**
   * todo maybe mixin this shiz, less params
   */
  function updatesModel(instance, promise, shouldUpdate){
    if (shouldUpdate === true){
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