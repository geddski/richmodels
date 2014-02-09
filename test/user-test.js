var expect = chai.expect;

describe('User Resource', function(){
  var User;
  var $httpBackend;
  // mock data
  var jim = {name: 'Jim', id: 1};
  var sam = {name: 'Sam', id: 2};
  var jenny = {name: 'Jenny', id: 3};
  var mark = {name: 'Mark', id: 4};
  var jared = {name: 'Jared', id: 5};

  beforeEach(function(){
    //load the module
    module('app');

    inject(function($injector) {
      // get the User Resource
      User = $injector.get('User');

      // mock services
      $httpBackend = $injector.get('$httpBackend');
      $httpBackend.when('GET', '/user').respond([jim, sam, jenny, mark]);
      $httpBackend.when('GET', '/user/1/favorite').respond([sam, jenny]);
      $httpBackend.when('GET', '/user/1').respond(jim);
      $httpBackend.when('POST', '/user').respond(jared);
      $httpBackend.when('GET', '/user/5').respond(jared);
      $httpBackend.when('POST', '/user/3/favorite?name=Jenny').respond({success: true});
    });
  });

  describe('#query (static Resource method)', function(){
    it('fetches a list from the server, returning a deferred', function(){
      var deferred = User.query();
      // the deferred contains the promise
      deferred.$promise.then(function(data){
        expect(data.length).to.equal(4);
      });
      $httpBackend.flush();
    });
  });

  describe('#get (static Resource method)', function(){
    it('fetches a single item from the server, returning a deferred', function(){
      var deferred = User.get({id: 1});
      deferred.$promise.then(function(data){
        expect(data.name).to.equal('Jim');
      });
      $httpBackend.flush();
    });
  });

  describe("custom static methods", function(){
    it("lets you make your own", function(){
      // Jim's favorites are Sam and Jenny
      var deferred = User.getFavorites({id: 1});
      deferred.$promise.then(function(data){
        expect(data[0].name).to.equal('Sam');
        expect(data[1].name).to.equal('Jenny');
        expect(data.length).to.equal(2);
      });
      $httpBackend.flush();
    });
  });

  describe("instances of the Resource", function(){
    var jared;

    beforeEach(function(){
      jared = new User({name: 'Jared'});
    });

    it("makes a new instance of the Resource", function(){
      expect(jared).to.be.an.instanceof(User);
      expect(jared.name).to.equal('Jared');
    });

    /**
     * the instance methods are $save(), $delete(), and $remove() (same as $delete)
     * @return {[type]} [description]
     */
    describe("$save action ", function(){
      it("POSTs to the server and updates itself with whatever the server returns", function(){
        jared.$save().then(function(){
          expect(jared.id).to.equal(5); // id was returned from the server
        });
        $httpBackend.flush();
      });
    });

    describe("custom instance methods", function(){
      it("lets you make your own, get mapped with $ prefix", function(done){
        // add Jenny to Jared's favorites
        jared.id = 5;
        jared.$addFavorite(jenny).then(function(data){
          console.log("data", data);
          console.log("jared", jared);
          // boo... the result gets set on the instance automatically
          // find a way to prevent this...
          expect(jared.name).to.equal('Jared');
          done();
        })
        $httpBackend.flush();
      });
    });

  });

});