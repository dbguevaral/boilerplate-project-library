/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai
          .request(server)
          .keepOpen()
          .post('/api/books')
          .send({
            title: 'Test'
          })
          .end(function (err, res) {
            assert.equal(res.body.title, 'Test');
            assert.deepEqual(res.body, {title: 'Test', _id: res.body._id});
            done();
          });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai
          .request(server)
          .keepOpen()
          .post('/api/books')
          .send({title: ''})
          .end(function (err, res) {
            assert.equal(res.body, 'missing required field title');
            done();
          });        
      });      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai
          .request(server)
          .keepOpen()
          .get('/api/books')
          .end(function (err, res) {
            assert.isArray(res.body, 'Is an array of books!');
            done();
          });
      });        
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      let validId

      setup(async function () {
        const res = await chai
            .request(server)
            .post('/api/books')
            .send({ title: 'Test Book'});
        validId = res.body._id
      })
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai  
          .request(server)
          .keepOpen()
          .get('/api/books/507f1f77bcf86cd799439999')
          .end(function (err, res) {
            assert.equal(res.text, 'no book exists');
            done();
          })

      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai  
          .request(server)
          .keepOpen()
          .get(`/api/books/${validId}`)
          .end(function (err, res) {
            assert.deepEqual(res.body, { _id: validId, title: 'Test Book', commentcount: 0, comments: [], __v: 0});
            done();
          })
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function() {
      let validId

      setup(async function () {
        const res = await chai
            .request(server)
            .post('/api/books')
            .send({ title: 'Test Comment'});
        validId = res.body._id
      })
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai
          .request(server)
          .keepOpen()
          .post(`/api/books/${validId}`)
          .send({ comment: 'This is a comment' })
          .end(function (err, res) {
            assert.deepEqual(res.body, {
              _id: validId, 
              title: 'Test Comment', 
              commentcount: 1, 
              comments: ['This is a comment'], 
              __v: 1
            });
            done();
          });
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        chai
          .request(server)
          .keepOpen()
          .post(`/api/books/${validId}`)
          .send({ comment: '' })
          .end(function (err, res) {
            assert.equal(res.text, 'missing required field comment');
            done();
          });
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai
          .request(server)
          .keepOpen()
          .post('/api/books/507f1f77bcf86cd744464999')
          .send({ 
            comment: 'This comment should work',
            _id: '507f1f77bcf86cd744464999'
           })
          .end(function (err, res) {
            assert.equal(res.text, 'no book exists');
            done();
          });
      });
    });
      

    suite('DELETE /api/books/[id] => delete book object id', function() {
      let validId

      setup(async function () {
        const res = await chai
            .request(server)
            .post('/api/books')
            .send({ title: 'Test Delete'});
        validId = res.body._id
      })

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai
          .request(server)
          .keepOpen()
          .delete(`/api/books/${validId}`)
          .send({ 
            _id: validId,
           })
          .end(function (err, res) {
            assert.equal(res.text, 'delete successful');
            done();
          });
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        chai
          .request(server)
          .keepOpen()
          .delete('/api/books/507f1f77bcf86cd744464999')
          .send({ 
            _id: '507f1f77bcf86cd744464999'
           })
          .end(function (err, res) {
            assert.equal(res.text, 'no book exists');
            done();
          });
      });
    });
  });
});
