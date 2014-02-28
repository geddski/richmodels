app.factory('richmodel', function($http){

  var richmodel = {};

  /**
   * return just the data from a succesful response
   */
  richmodel.getData = function(obj){
    return obj.data;
  };

  /**
   * update the model with the results from the service call (like ngResource)
   */
  richmodel.updatesModel = function(instance, promise, shouldUpdate){
    if (shouldUpdate === true){
      promise.then(function(data){
        udpate(instance, data.data);
      });
    }
  };

  /**
   * add CRUD functionality to a model
   */
  richmodel.CRUD = function(obj, args){
    richmodel.mixin(obj, 'get', args);
    richmodel.mixin(obj, 'getAll', args);
    richmodel.mixin(obj.prototype, 'delete', args);
    richmodel.mixin(obj.prototype, 'save', args);
  }

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

  //------mixins-------//

  richmodel.mixin = function(obj, mixin, args){
    obj[mixin] = richmodel[mixin](args, obj);
  };

  richmodel.get = function(args, obj){
    return function(id){
      return $http({method: 'GET', url: args.url + '/' + id})
          .then(richmodel.getData)
          .then(args.transformIn || noTransform)
          .then(wrap(obj));
    }
  };

  richmodel.getAll = function(args, obj){
    return function(){
      return $http({method: 'GET', url: args.url })
          .then(richmodel.getData)
          .then(function(items){
            return items.map(wrap(obj));
          });
    }
  };

  richmodel.delete = function(args){
    return function(id){
      var url = args.url + '/' + this.id;
      return $http({method: 'DELETE', url: url}).then(richmodel.getData);
    };
  };

  richmodel.save = function(args){
    return function(shouldUpdate){
      var url = args.url;
      var method = 'POST';
      if (this.id){
        //if has an id, do an update rather than a create
        url += '/' + this.id;
        method = 'PUT';
      }
      var httpPromise = $http({method: method, url: url, data: args.transformOut(this) || noTransformthis(this) });
      richmodel.updatesModel(this, httpPromise, shouldUpdate);
      return httpPromise.then(richmodel.getData);
    };
  }

  return richmodel;
});