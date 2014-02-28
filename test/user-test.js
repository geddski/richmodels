var expect = chai.expect;

describe('User Model', function(){
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
      // get the User Model
      User = $injector.get('User');

      // mock services
      $httpBackend = $injector.get('$httpBackend');
      $httpBackend.when('GET', '/user').respond([jim, sam, jenny, mark]);
      $httpBackend.when('GET', '/user/1').respond(jim);
      $httpBackend.when('POST', '/user').respond(jared);
      $httpBackend.when('GET', '/user/5').respond(jared);
      $httpBackend.when('POST', '/user/5/favorite?id=3').respond({success: true});
      $httpBackend.when('POST', '/user/undefined/favorite?id=3').respond(400, {reason: 'could not add favorite to undefined user'});
    });
  });

  describe('#getAll (static method)', function(){
    it('fetches a list from the server, returning a promise', function(){
      User.getAll().then(function(data){
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

  describe("instances of the Model", function(){
    var jared;

    beforeEach(function(){
      jared = new User('Jared');
    });

    it("makes a new instance (this is plain JS)", function(){
      expect(jared).to.be.an.instanceof(User);
      expect(jared.name).to.equal('Jared');
    });

    describe("#save", function(){
      it("POSTs to the server", function(){
        jared.save().then(function(data){
          expect(data.id).to.equal(5); // id was returned from the (mocked) server
        })
        $httpBackend.flush();
      });

      it("optionally updates the model with whatever the server returns", function(){
        jared.save(true).then(function(data){
          expect(jared.id).to.equal(5); // id was returned from the (mocked) server
        });
        $httpBackend.flush();
      });
    });

    describe.skip("#delete", function(){
      
    });

    describe("other custom instance methods", function(){
      it("are just functions on the prototype", function(){
        // add Jenny to Jared's favorites
        jared.id = 5;
        jared.addFavorite(jenny).then(function(){
          // expect(jared.name).to.equal('Jared');
          expect(jared.favorites[0]).to.equal(jenny);
        });
        $httpBackend.flush();
      });
    });

    describe("error handling", function(){
      it("using catch", function(){
        jared.awesome = false;

        jared.addFavorite(jenny)
          .then(function(){
            //should not make it here because of server response code
            jared.awesome = true;
          })
          .catch(function(response){
            expect(response.status).to.equal(400);
            expect(jared.awesome).to.equal(false);
          });
        $httpBackend.flush();
      });
    });

    describe.skip("transform in", function(){
      
    });

    describe.skip("transform out", function(){
      
    });

  });

});