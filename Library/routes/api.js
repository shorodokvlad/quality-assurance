'use strict';

const mongoose = require('mongoose');
// Mock connection to avoid errors if DB environment variable is missing
mongoose.connect = () => Promise.resolve();

module.exports = function (app) {

  const libraryModel = require('../models/lib');

  app.route('/api/books')
    .get(function (req, res){
      libraryModel.find({}).exec()
        .then(data => {
          if(data) {
            // Return array of objects with title, _id, and commentcount
            let result = data.map(book => ({
              _id: book._id,
              title: book.title,
              commentcount: book.commentcount
            }));
            return res.json(result);
          }
        })
        .catch(err => {
          console.log(err);
          return res.json([]);
        });
    })
    
    .post(function (req, res){
      let title = req.body.title;
      if(!title) {
        return res.send('missing required field title');
      }

      const book = new libraryModel({
        title: title,
        comments: []
      });

      book.save((err, data) => {
        if(err) {
          console.log(err);
          return res.send('could not save book');
        }
        return res.json({_id: data._id, title: data.title});
      });
    })
    
    .delete(function(req, res){
      libraryModel.deleteMany({}).exec()
        .then(() => {
          return res.send('complete delete successful');
        })
        .catch(err => {
          console.log(err);
          return res.send('could not delete books');
        });
    });

  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;

      libraryModel.findById(bookid).exec()
        .then(data => {
          if(data) {
            return res.json({
              _id: data._id,
              title: data.title,
              comments: data.comments
            });
          } else {
            return res.send('no book exists');
          }
        })
        .catch(err => {
          console.log(err);
          return res.send('no book exists');
        });
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      
      if(!comment) {
        return res.send('missing required field comment');
      }

      libraryModel.findById(bookid).exec()
        .then(data => {
          if(data) {
            data.comments.push(comment);
            
            // Save the updated book
            const updatedBook = new libraryModel(data);
            updatedBook.save((err, info) => {
              if(err) {
                console.log(err);
                return res.send('could not save comment');
              }
              return res.json({
                _id: info._id,
                title: info.title,
                comments: info.comments
              });
            });
          } else {
            return res.send('no book exists');
          }
        })
        .catch(err => {
          console.log(err);
          return res.send('no book exists');
        });
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      
      libraryModel.findByIdAndDelete(bookid).exec()
        .then(data => {
          if(data) {
            return res.send('delete successful');
          } else {
            return res.send('no book exists');
          }
        })
        .catch(err => {
          console.log(err);
          return res.send('no book exists');
        });
    });
  
};
