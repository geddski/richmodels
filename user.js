app.factory('User', function($http, $q, richmodel){

  // just a regular constructor function
  var User = function User(name){
    this.name = name;
    this.favorites = [];
  };

  // add CRUD functionality (needs more advanced URL handling like ngResource?)
  richmodel.CRUD(User, { url: '/user' });

  // OR could mixin just the functionality the model needs:
  // richmodel.mixin(User, 'get', { url: '/user' });
  // richmodel.mixin(User, 'getAll', { url: '/user' });
  // richmodel.mixin(User.prototype, 'delete', { url: '/user' });
  // richmodel.mixin(User.prototype, 'save', { url: '/user' });

  // add custom functionality
  User.prototype.addFavorite = function(user){
    var _this = this;
    var httpPromise =  $http({method: 'POST', url: '/user/' + this.id + '/favorite?id=' + user.id})
      return httpPromise.then(function(response){
        _this.favorites.push(user);
        return richmodel.getData(response);
      })
      .catch(function(){
        //Can catch here AND as in userland with multiple .catch() calls
      })
  };

  return User;
})