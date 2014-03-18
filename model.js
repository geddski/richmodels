app.factory('model', function($http, $q, $angularCacheFactory){

  /**
   * add CRUD functionality to a model
   */
  var model = function(obj, args){
    model.mixin(obj, 'get', args);
    model.mixin(obj, 'getAll', args);
    model.mixin(obj.prototype, 'delete', args);
    model.mixin(obj.prototype, 'save', args);
  };

  /**
   * return just the data from a succesful response
   */
  model.getData = function(obj){
    return obj.data;
  };

  /**
   * add toJSON and fromJSON functions
   */
  model.json = function(contructor, fields){
    contructor.prototype.toJSON = function(){
      //pluck?
    };

    // add only the fields from the object that exist in the fields array
    contructor.prototype.fromJSON = function(obj){
      _.each(fields, function(field){
        this[field] = obj[field];
      }, this);
    };
  }

  /**
   * update the model with the results from the service call (like ngResource)
   */
  model.updatesModel = function(instance, promise, shouldUpdate){
    if (shouldUpdate === true){
      promise.then(function(data){
        update(instance, data.data);
      });
    }
  };

  function cache(key){
    return function(obj){
      var cache = $angularCacheFactory.get('UserCache') || $angularCacheFactory('UserCache');
      cache.put(key, obj);
      return obj;
    }
  }

  function checkCache(key){
    var deferred = $q.defer();
    var cache = $angularCacheFactory.get('UserCache');
    if (cache){
      var joe = cache.get('/joe');
      if (joe){
        deferred.resolve(joe);
      }
      else{
        deferred.reject();
      }
    }
    else{
      deferred.reject();
    }
    
    return deferred.promise;
  }

  function update(a, b){
    Object.getOwnPropertyNames(b).forEach(function(prop){
      a[prop] = b[prop];
    });
  }

  function noTransform(data){
    return data;
  }

  function wrap(obj){
    return function(data){
      return new obj(data);
    }
  }

  function all(fn){
    return function(items){
      return items.map(fn);
    }
  }

  //expose utilities
  model.all = all;
  model.wrap = wrap;
  model.udpate = update;
  model.cache = cache;

  //------mixins-------//

  model.mixin = function(obj, mixin, args){
    obj[mixin] = model[mixin](args, obj);
  };

  model.get = function(args, obj){
    return function(id, shouldCache){
      // try the cache first, if nothing then fetch from server
      return checkCache('/joe')
          .catch(function(){
            return $http({method: 'GET', url: args.url + '/' + id})
                .then(model.getData)
                .then(args.transformIn || obj.fromJSON || noTransform)
          })
          // regardless of source, wrap as instances and update the cache
          .then(wrap(obj))
          //TODO: conditionally probably?
          .then(cache('/joe'));

      // return $http({method: 'GET', url: args.url + '/' + id})
          // .then(model.getData)
          // .then(args.transformIn || obj.fromJSON || noTransform)
          // .then(wrap(obj))
          // .then(cache('/joe'));
    }
  };

  model.getAll = function(args, obj){
    return function(){
      return $http({method: 'GET', url: args.url })
          .then(model.getData)
          .then(all(args.transformIn || obj.fromJSON || noTransform))
          .then(all(wrap(obj)))
    }
  };

  model.delete = function(args){
    return function(id){
      var url = args.url + '/' + this.id;
      return $http({method: 'DELETE', url: url}).then(model.getData);
    };
  };

  model.save = function(args){
    return function(options){
      options = options || {};
      var url = args.url;
      var method = 'POST';
      if (this.id){
        //if has an id, do an update rather than a create
        url += '/' + this.id;
        method = 'PUT';
      }
      var transformOut = args.transformOut || this.constructor.toJSON || noTransform;
      var httpPromise = $http({method: method, url: url, data: transformOut(this) });
      model.updatesModel(this, httpPromise, options.update);
      return httpPromise.then(model.getData);
    };
  }

  return model;
});