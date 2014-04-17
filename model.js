app.factory('model', function($http, $q, $angularCacheFactory){

  /**
   * add CRUD functionality to a model
   */
  var model = function(){};

  model.rest = function(obj, args){
    model.mixin(obj, 'get', args);
    model.mixin(obj, 'getAll', args);
    model.mixin(obj.prototype, 'delete', args);
    model.mixin(obj.prototype, 'save', args);  
  };


  /**
   * add toJSON and fromJSON functions
   */
  model.json = function(contructor, fields){
    contructor.prototype.toJSON = function(){
      var json = {};
      _.each(fields, function(field){
        json[field] = this[field];
      }, this);
      return json;
    };

    // add only the fields from the object that exist in the fields array
    contructor.prototype.fromJSON = function(obj){
      _.each(fields, function(field){
        if (!obj[field]) { return; }
        this[field] = obj[field];
      }, this);
    };
  }

  /**
   * return just the data from a succesful response
   */
  model.getData = function(obj){
    return obj.data;
  };
  
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
      var cache = $angularCacheFactory.get('UrlCache') || $angularCacheFactory('UrlCache');
      cache.put(key, obj);
      return obj;
    }
  }

  function checkCache(key){
    var deferred = $q.defer();
    var cache = $angularCacheFactory.get('UrlCache');
    if (cache){
      var item = cache.get(key);
      if (item){
        deferred.resolve(item);
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

  /**
    * TODO: flesh this out more
    * Assumptions for now:
    *  - If the paramVals is not an object, then we'll replace every
    *    propName with the paramVals value.
    *  - If the paramVals is falsey, we'll replace propNames with an empty string
    *  - If the parsedUrl ends with a slash, we'll strip it.
    * @param url - the URL with /:propNames to replace with values
    * @param paramVals - the values to replace the /:propNames with
    * @returns {string} - The parsed URL
    */
   function buildUrl(url, paramVals) {
     var isObject = angular.isObject(paramVals);
     var isEmpty = !paramVals;
     var parsedUrl = url.replace(/:(\w+)/g, function(match, param) {
       if (isEmpty) {
         return '';
       } else if (isObject) {
         return paramVals[param] || '';
       } else {
         return paramVals;
       }
     });
     return parsedUrl.replace(/\/$/, '');
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

  //TODO: conditional caching
  model.get = function(args, obj){
    return function(options){
      // try the cache first, if nothing then fetch from server
      var url = buildUrl(args.url, options);
      return checkCache(url)
        .catch(function(){
          return $http({method: 'GET', url: url})
              .then(model.getData)
              .then(args.transformIn || obj.transformIn || noTransform)
        })
        // regardless of source, wrap as instances and update the cache
        .then(wrap(obj))
        .then(cache(url));
    }
  };

  model.getAll = function(args, obj){
    return function(){
      var url = buildUrl(args.url);
      return $http({method: 'GET', url: url })
          .then(model.getData)
          .then(all(args.transformIn || obj.transformIn || noTransform))
          .then(all(wrap(obj)))
    }
  };

  model.delete = function(args){
    return function(){
      // var url = args.url + '/' + this.id;
      var url = buildUrl(args.url, this);
      return $http({method: 'DELETE', url: url}).then(model.getData);
    };
  };

  model.save = function(args){
    return function(options){
      options = options || {};
      var url = buildUrl(args.url, options);
      var method = 'POST';
      if (this.id){
        //if has an id, do an update rather than a create
        url += '/' + this.id;
        method = 'PUT';
      }

      var data = this;
      if (_.isFunction(this.toJSON)){
        data = this.toJSON();
      }

      var transformOut = args.transformOut || this.constructor.transformOut || noTransform;
      var httpPromise = $http({method: method, url: url, data: transformOut(data) });
      model.updatesModel(this, httpPromise, options.update);
      return httpPromise.then(model.getData);
    };
  }

  return model;
});