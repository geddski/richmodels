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
      $httpBackend.when('GET', '/user/1').respond(jim);
      $httpBackend.when('POST', '/user').respond(jared);
      $httpBackend.when('GET', '/user/5').respond(jared);
      $httpBackend.when('POST', '/user/5/favorite?id=3').respond({success: true});
    });
  });

  describe('#query (static method)', function(){
    it('fetches a list from the server, returning a promise', function(){
      User.query().then(function(data){
        expect(data.length).to.equal(4);
      });
      $httpBackend.flush();
    });
  });

  describe('#get (static method)', function(){
    it('fetches a single item from the server, returning a promise', function(){
      User.get(1).then(function(data){
        expect(data.name).to.equal('Jim');
      });
      $httpBackend.flush();
    });
  });

  describe("instances of the Resource", function(){
    var jared;

    beforeEach(function(){
      jared = new User('Jared');
    });

    it("makes a new instance (this is plain JS)", function(){
      expect(jared).to.be.an.instanceof(User);
      expect(jared.name).to.equal('Jared');
    });

    /**
     * the instance methods are $save(), $delete(), and $remove() (same as $delete)
     * @return {[type]} [description]
     */
    describe("$save action ", function(){
      it("POSTs to the server and updates itself with whatever the server returns", function(){
        jared.save(true).then(function(){
          expect(jared.id).to.equal(5); // id was returned from the server
        });
        $httpBackend.flush();
      });
    });

    describe("custom instance methods", function(){
      it("are just functions on the prototype", function(){
        // add Jenny to Jared's favorites
        jared.id = 5;
        jared.addFavorite(jenny).then(function(data){
          expect(jared.name).to.equal('Jared');
        });
        $httpBackend.flush();
      });
    });

  });

});