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
  richmodel.mixin(User, 'get', { url: '/user', transformIn: transformIn, transformOut: transformOut });
  richmodel.mixin(User, 'getAll', { url: '/user', transformIn: transformIn, transformOut: transformOut });
  richmodel.mixin(User.prototype, 'save', { url: '/user', transformIn: transformIn, transformOut: transformOut });
  richmodel.mixin(User.prototype, 'delete', { url: '/user' });

  // custom functionality just using $http
  User.prototype.addFavorite = function(user){
    var _this = this;
    return $http({method: 'POST', url: '/user/' + this.id + '/favorite?id=' + user.id})
        .then(function(){
          _this.favorites.push(user);
        });
  };

  // custom functionality leveraging richmodel utilities
  User.prototype.getFollowers = function(){
    return $http({method: 'GET', url: '/user/' + this.id + '/followers'})
        .then(richmodel.getData)
        .then(richmodel.all(transformIn))
        .then(richmodel.all(richmodel.wrap(User)))
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
