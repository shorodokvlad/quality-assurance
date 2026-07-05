const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const libraryModel = require('../models/lib');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  suite('Routing tests', function() {

    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', async function() {
        console.log("START: Test POST /api/books with title");
        const res = await chai.request(server)
          .post('/api/books')
          .send({ title: 'Test Book' });
        assert.equal(res.status, 200);
        assert.equal(res.body.title, 'Test Book');
        assert.property(res.body, '_id');
        console.log("END: Test POST /api/books with title");
      });
      
      test('Test POST /api/books with no title given', async function() {
        console.log("START: Test POST /api/books with no title given");
        const res = await chai.request(server)
          .post('/api/books')
          .send({});
        assert.equal(res.status, 200);
        assert.equal(res.text, 'missing required field title');
        console.log("END: Test POST /api/books with no title given");
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books', async function(){
        console.log("START: Test GET /api/books");
        const res = await chai.request(server)
          .get('/api/books');
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        if (res.body.length > 0) {
          assert.property(res.body[0], 'commentcount');
          assert.property(res.body[0], '_id');
          assert.property(res.body[0], 'title');
        }
        console.log("END: Test GET /api/books");
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db', async function(){
        console.log("START: Test GET /api/books/[id] with id not in db");
        const res = await chai.request(server)
          .get('/api/books/60f56b8c80d8f30591c3d003');
        assert.equal(res.status, 200);
        assert.equal(res.text, 'no book exists');
        console.log("END: Test GET /api/books/[id] with id not in db");
      });
      
      test('Test GET /api/books/[id] with valid id in db', async function() {
        console.log("START: Test GET /api/books/[id] with valid id in db");
        const books = await libraryModel.find({}).exec();
        const id = books[0]._id;
        const res = await chai.request(server)
          .get(`/api/books/${id}`);
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, 'comments');
        assert.property(res.body, '_id');
        assert.property(res.body, 'title');
        assert.equal(res.body._id, id.toString());
        console.log("END: Test GET /api/books/[id] with valid id in db");
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', async function(){
        const books = await libraryModel.find({}).exec();
        const id = books[0]._id;
        const res = await chai.request(server)
          .post(`/api/books/${id}`)
          .send({ comment: 'Great book!' });
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, 'comments');
        assert.isArray(res.body.comments);
        assert.include(res.body.comments, 'Great book!');
        assert.property(res.body, '_id');
        assert.property(res.body, 'title');
      });

      test('Test POST /api/books/[id] without comment field', async function(){
        const books = await libraryModel.find({}).exec();
        const id = books[0]._id;
        const res = await chai.request(server)
          .post(`/api/books/${id}`)
          .send({});
        assert.equal(res.status, 200);
        assert.equal(res.text, 'missing required field comment');
      });

      test('Test POST /api/books/[id] with comment, id not in db', async function(){
        const res = await chai.request(server)
          .post('/api/books/60f56b8c80d8f30591c3d003')
          .send({ comment: 'Comment for non-existent book' });
        assert.equal(res.status, 200);
        assert.equal(res.text, 'no book exists');
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {
      
      test('Test DELETE /api/books/[id] with valid id in db', async function(){
        const books = await libraryModel.find({}).exec();
        const id = books[0]._id;
        const res = await chai.request(server)
          .delete(`/api/books/${id}`);
        assert.equal(res.status, 200);
        assert.equal(res.text, 'delete successful');
      });

      test('Test DELETE /api/books/[id] with id not in db', async function(){
        const res = await chai.request(server)
          .delete('/api/books/60f56b8c80d8f30591c3d003');
        assert.equal(res.status, 200);
        assert.equal(res.text, 'no book exists');
      });
      
    });

  });

});
