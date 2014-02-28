app.factory('User', function($http, $q, richmodel){

  // just a regular constructor function
  function User(obj){
    this.name = obj.name;
    this.favorites = [];
    this.displayname = obj.displayname;
  };

  // add CRUD functionality (probably needs more advanced URL handling like ngResource?)
  richmodel.CRUD(User, { url: '/user', transformIn: transformIn, transformOut: transformOut});

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


  // Transform data on its way to and from the server.
  // Any common transforms could be moved out of the model.
  // Maybe we even allow multiple transform functions

  function transformIn(data){
    data.displayname = data.name.toLowerCase();
    return data;
  }

  function transformOut(data){
    data.cool = true;
    return data;
  }

  return User;
})
