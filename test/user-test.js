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
      $httpBackend.when('GET', '/user').respond(200, [jim, sam, jenny, mark]);
      $httpBackend.when('GET', '/user/1').respond(200, jim);
      $httpBackend.when('POST', '/user').respond(201, jared);
      $httpBackend.when('GET', '/user/5').respond(200, jared);
      $httpBackend.when('PUT', '/user/5').respond(200, jared);
      $httpBackend.when('GET', '/user/4').respond(200, mark);
      $httpBackend.when('DELETE', '/user/5').respond(204, {deleted: jared.id});
      $httpBackend.when('POST', '/user/5/favorite?id=3').respond(200, {success: true});
      $httpBackend.when('POST', '/user/undefined/favorite?id=3').respond(400, {reason: 'could not add favorite to undefined user'});
    });
  });

  describe('#get (static method)', function(){
    it('fetches a single item from the server, returning a promise', function(){
      User.get(1).then(function(data){
        expect(data.name).to.equal('Jim');
        expect(data).to.be.an.instanceof(User);
      });
      $httpBackend.flush();
    });
  });

  describe('#getAll (static method)', function(){
    it('fetches a list from the server, returning a promise', function(){
      User.getAll().then(function(users){
        expect(users.length).to.equal(4);
        expect(users[0]).to.be.an.instanceof(User);
      });
      $httpBackend.flush();
    });
  });


  describe("instances of the Model", function(){
    var jared;

    beforeEach(function(){
      jared = new User({name: 'Jared'});
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

      it("optionally updates the model with whatever the server returns (like ngResource)", function(){
        jared.save(true).then(function(data){
          expect(jared.id).to.equal(5); // id was returned from the (mocked) server
        });
        $httpBackend.flush();
      });
    });

    describe("#delete", function(){
      it("is similar to #save", function(){
        jared.id = 5;
        jared.delete().then(function(data){
          expect(data.deleted).to.equal(5);
        })
        $httpBackend.flush();
      });
    });

    describe("other custom instance methods", function(){
      it("are just functions on the prototype", function(){
        // add Jenny to Jared's favorites
        jared.id = 5;
        jared.addFavorite(jenny).then(function(){
          expect(jared.favorites[0]).to.equal(jenny);
        });
        $httpBackend.flush();
      });
    });

    describe("when a service call fails", function(){
      it("the entire service response is returned, not just the data", function(){
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

    describe("transform data on its way IN", function(){
      it("should apply the transform", function(){
        User.get(4).then(function(data){
          expect(data.displayname).to.equal('mark');
        });
        $httpBackend.flush();
      });
    });

    describe("transform data on it way OUT", function(){
      it("should apply the transform", function(){
        $httpBackend.expectPUT('/user/5', {"name":"Jared","favorites":[],"id":5,"cool":true});
        jared.id = 5;
        jared.save();
        $httpBackend.flush();
      });
    });

  });

});