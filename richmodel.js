var richmodel = {};

richmodel.getData = function(obj){
  return obj.data;
};

/**
 * todo maybe mixin this shiz, less params
 */
richmodel.updatesModel = function(instance, promise, shouldUpdate){
  if (shouldUpdate === true){
    promise.then(function(data){
      richmodel.updateModel(instance, data.data);
    });
  }
}

richmodel.updateModel = function(a, b){
  Object.getOwnPropertyNames(b).forEach(function(prop){
    a[prop] = b[prop];
  });
}