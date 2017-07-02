var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server.js');
var assert = chai.assert;
var ShortUrl = require('../app/models/url');
require('dotenv').load();

chai.use(chaiHttp);

describe('URL Shortener API', function(){
  describe('/new endpoint', function(){
    it('should connect', function(done){
      chai.request(server)
        .get('/new')
        .end(function(err, res){
          assert.equal(res.status, 200);
          done();
        });
    });
    it('should return json', function(done){
      chai.request(server)
        .get('/new')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          done();
        });
    });
    it('should return error property', function(done){
      chai.request(server)
        .get('/new')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.property(res.body, 'error');
          done();
        });
    });
    it('should return "Please enter url." in error property', function(done){
      chai.request(server)
        .get('/new')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Please enter url.');
          done();
        });
    });
  });
  describe('/new/:url(*) endpoint', function(){
    it('should connect', function(done){
      chai.request(server)
        .get('/new/test')
        .end(function(err, res){
          assert.equal(res.status, 200);
          done();
        });
    });
    it('should return json', function(done){
      chai.request(server)
        .get('/new/test')
        .end(function(err, res){
          assert.equal(res.type, 'application/json');
          done();
        });
    });
    describe('invalid url', function(){
      it('should return error property when provided an invalid url', function(done){
        chai.request(server)
          .get('/new/test')
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.property(res.body, 'error');
            done();
          });
      });
      it('should return "Wrong url format, make sure you have a valid protocol '
         + 'and real site." in error property when provided an invalid url', function(done){
        chai.request(server)
          .get('/new/test')
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.property(res.body, 'error');
            assert.equal(res.body.error, 'Wrong url format, make sure you have a valid protocol and real site.');
            done();
          });
      });
    });
    describe('valid url', function(){
      afterEach(function(done){
        ShortUrl.collection.drop();
        done();
      });
      it('should return original_url property when provided a valid url of https://www.google.com', function(done){
        chai.request(server)
          .get('/new/https://www.google.com')
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.property(res.body, 'original_url');
            done();
          });
      });
      it('should return short_url property when provided a valid url of https://www.google.com', function(done){
        chai.request(server)
          .get('/new/https://www.google.com')
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.property(res.body, 'short_url');
            done();
          });
      });
      it('should return string in original_url property when provided a valid url of https://www.google.com', function(done){
        chai.request(server)
          .get('/new/https://www.google.com')
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.property(res.body, 'original_url');
            assert.typeOf(res.body.original_url, 'string');
            done();
          });
      });
      it('should return string in short_url property when provided a valid url of https://www.google.com', function(done){
        chai.request(server)
          .get('/new/https://www.google.com')
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.property(res.body, 'short_url');
            assert.typeOf(res.body.short_url, 'string');
            done();
          });
      });
      it('should return https://www.google.com in original_url property when provided a valid url of https://www.google.com', function(done){
        chai.request(server)
          .get('/new/https://www.google.com')
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.property(res.body, 'original_url');
            assert.typeOf(res.body.original_url, 'string');
            assert.equal(res.body.original_url, 'https://www.google.com');
            done();
          });
      });
      it('should return https://www.google.com in original_url property when provided a valid url of https://www.google.com', function(done){
        chai.request(server)
          .get('/new/https://www.google.com')
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.property(res.body, 'original_url');
            assert.typeOf(res.body.original_url, 'string');
            assert.include(res.body.short_url, '/1');
            done();
          });
      });
    });
  });
  describe('/:url(*) endpoint', function(){
    it('should connect', function(done){
      chai.request(server)
        .get('/test')
        .end(function(err, res){
          assert.equal(res.status, 200);
          done();
        });
    });
    it('should return json', function(done){
      chai.request(server)
        .get('/test')
        .end(function(err, res){
          assert.equal(res.type, 'application/json');
          done();
        });
    });
    describe('invalid url', function(){
      it('should return error property when provided an invalid url id', function(done){
        chai.request(server)
          .get('/test')
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.property(res.body, 'error');
            done();
          });
      });
      it('should return "URL does not exist." in error property when provided an invalid url id', function(done){
        chai.request(server)
          .get('/test')
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.property(res.body, 'error');
            assert.equal(res.body.error, 'URL does not exist.');
            done();
          });
      });
      it('should return "URL does not exist." in error property when provided an url id that does not exist', function(done){
        chai.request(server)
          .get('/1')
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.property(res.body, 'error');
            assert.equal(res.body.error, 'URL does not exist.');
            done();
          });
      });
    });
    describe('valid url', function(){
      before(function(done){
        ShortUrl.collection.drop(function(){
          var newShortUrl = new ShortUrl({
              original_url: 'https://www.freecodecamp.com',
              short_url: '99'
          });

          newShortUrl.save(function(err){
            if (err) return done(err);
            done();
          });
        });
      });
      after(function(done){
        ShortUrl.collection.drop();
        done();
      });
      it('should redirect when provided a valid url id', function(done){
        chai.request(server)
          .get('/99')
          .end(function(err, res){
            console.log(res.body)
            assert.isNotEmpty(res.redirects);
            done();
          });
      });
    });
  });
});