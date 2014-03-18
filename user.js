app.factory('User', function($http, $q, model){

  // just a regular constructor function
  // model(User, ['name', 'favorites']);
  function User(obj){
    this.name = obj.name;
    this.favorites = [];
    this.displayname = obj.displayname;
  };

  // add CRUD functionality (probably needs more advanced URL handling like ngResource?)
  model.CRUD(User, { url: '/user', transformIn: fromJSON, transformOut: toJSON});

  // OR could mixin just the functionality the model needs:
  // model.mixin(User, 'get', { url: '/user', transformIn: fromJSON, transformOut: toJSON });
  // model.mixin(User, 'getAll', { url: '/user', transformIn: fromJSON, transformOut: toJSON });
  // model.mixin(User.prototype, 'save', { url: '/user', transformIn: fromJSON, transformOut: toJSON });
  // model.mixin(User.prototype, 'delete', { url: '/user' });

  // custom functionality just using $http
  User.prototype.addFavorite = function(user){
    var _this = this;
    return $http({method: 'POST', url: '/user/' + this.id + '/favorite?id=' + user.id})
        .then(function(){
          _this.favorites.push(user);
        });
  };

  // custom functionality leveraging model utilities
  User.prototype.getFollowers = function(){
    return $http({method: 'GET', url: '/user/' + this.id + '/followers'})
        .then(model.getData)
        .then(model.all(fromJSON))
        .then(model.all(model.wrap(User)))
  };


  // Transform data on its way to and from the server.
  // Any common transforms could be moved out of the model.
  // Maybe we even allow multiple transform functions

  function fromJSON(data){
    data.displayname = data.name.toLowerCase();
    return data;
  }

  function toJSON(data){
    data.cool = true;
    return data;
  }

  return User;
})
