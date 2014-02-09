var app = angular.module('app', ['ngResource']);

app.factory('User', function($resource){
  var User = $resource('/user/:id', {id: '@id'}, {
    getFavorites: { method:'GET', url: '/user/:id/favorite', isArray:true },
    addFavorite: { method:'POST', url: '/user/:id/favorite', params:{id: '@id'} }
  });

  // User.prototype.addFavorite = function(){
  //   console.log("adding favorite");
  // };

  return User;
})