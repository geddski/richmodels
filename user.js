/**
 * TODO:
 * needs more advanced URL handling like ngResource
 */
app.factory('User', function($http, $q, model){

  // annotate the model functionality onto a plain Constructor
  model.json(User, ['id', 'name', 'displayname']);
  // model.rest(User, { url: '/user' });
  // model.cache(User, { field: 'id', expires: '100000' });
  // model(User, { url: '/user' });
  function User(obj){
    // defaults
    this.favorites = [];
    // from data (only if undefined)
    this.fromJSON(obj);

    // this.id = obj.id;
    // this.name = obj.name;
    // this.displayname = obj.displayname;
    
  };

  // OR could mixin just the functionality the model needs:
  // model.mixin(User, 'get', { url: '/user' });
  // model.mixin(User, 'getAll', { url: '/user' });
  // model.mixin(User.prototype, 'save', { url: '/user' });
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
        .then(model.all(User.fromJSON))
        .then(model.all(model.wrap(User)))
  };


  // Transform data on its way to and from the server.
  // Any common transforms could be moved out of the model.
  // Maybe we even allow multiple transform functions

  //TODO move to prototype
  User.fromJSON = function(data){
    data.displayname = data.name.toLowerCase();
    return data;
  }

  User.toJSON = function(data){
    data.cool = true;
    return data;
  }

  return User;
})
