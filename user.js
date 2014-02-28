var app = angular.module('app', []);

app.factory('User', function($http, $q){
  var User = function User(name){
    this.name = name;
    this.favorites = [];
  };

  User.getAll = function(){
    return $http({method: 'GET', url: '/user'}).then(richmodel.getData);
  };  

  User.get = function(id){
    return $http({method: 'GET', url: '/user/' + id}).then(richmodel.getData);
  };

  User.prototype.save = function(shouldUpdate){
    var url = '/user';
    var method = 'POST';
    if (this.id){
      //do an update rather than a create
      url += '/' + this.id;
      method = 'PUT';
    }
    var httpPromise = $http({method: method, url: url, data: this});
    richmodel.updatesModel(this, httpPromise, shouldUpdate);
    return httpPromise.then(richmodel.getData);
  };

  User.prototype.delete = function(){
    var url = '/user/' + this.id;
    return $http({method: 'DELETE', url: url}).then(richmodel.getData);
  };

  User.prototype.addFavorite = function(user){
    var _this = this;
    var httpPromise =  $http({method: 'POST', url: '/user/' + this.id + '/favorite?id=' + user.id})
      return httpPromise.then(function(response){
        _this.favorites.push(user);
        return richmodel.getData(response);
      })
      .catch(function(){
        //Can catch here as well as in userland
      })
  };

  return User;
})