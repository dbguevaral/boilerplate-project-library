'use strict';
require('dotenv').config();
const Book = require('../models.js');
const mongoose = require('mongoose');
const uri = process.env.MONGO_URI;

mongoose.connect(uri).then( () => console.log('MongoDB connected')).catch( err => console.error('Connection error: ', err));


module.exports = function (app) {

  app.route('/api/books')
    .get(async function (req, res){ 
      try {
        const books = await Book.find({});
        res.json(books);
      } catch (err) {
        console.error(err);
        res.status(500);
      }
    })
    
    .post(async function (req, res){
      const title = req.body.title;
      if(!title) return res.json('missing required field title') 
      try {
        const book = new Book({ title });
        const savedBook = await book.save();
        return res.json({ title: savedBook.title, _id: savedBook._id })
      } catch (err) {
        console.error(err); // Log for debugging
        res.status(500);
      }
    })
    
    .delete(async function(req, res){
      try { 
        const deletedBooks = await Book.deleteMany({});
        res.send('complete delete successful');
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error in DELETE ALL route' });
      }
    });

  app.route('/api/books/:id')
    .get(async function (req, res){
      const bookid = req.params.id;
      try {
        const bookFound = await Book.findById(bookid);
        if (!bookFound) return res.send('no book exists');
        res.json(bookFound);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error in GET route'})
      }
    })
    
    .post(async function(req, res){
      const bookid = req.params.id;
      const comment = req.body.comment;
      if (!comment) return res.send('missing required field comment');   
      try {
        const commentedBook = await Book.findById(bookid);
        if (!commentedBook) return res.send('no book exists');
        commentedBook.comments.push(comment);
        commentedBook.commentcount += 1
        await commentedBook.save();
        res.json(commentedBook);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error in POST route' });
      }     
    })
    
    .delete(async function(req, res){
      const bookid = req.params.id;
      try {
        const deletedBook = await Book.findByIdAndDelete(bookid); 
        if (!deletedBook) return res.send('no book exists');
        res.send('delete successful');
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error in DELETE route' });
      }
    });
  
};
