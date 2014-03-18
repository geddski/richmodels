app.factory('model', function($http){

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
   * update the model with the results from the service call (like ngResource)
   */
  model.updatesModel = function(instance, promise, shouldUpdate){
    if (shouldUpdate === true){
      promise.then(function(data){
        udpate(instance, data.data);
      });
    }
  };

  function udpate(a, b){
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
  model.udpate = udpate;

  //------mixins-------//

  model.mixin = function(obj, mixin, args){
    obj[mixin] = model[mixin](args, obj);
  };

  model.get = function(args, obj){
    return function(id){
      return $http({method: 'GET', url: args.url + '/' + id})
          .then(model.getData)
          .then(args.transformIn || obj.fromJSON || noTransform)
          .then(wrap(obj));
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