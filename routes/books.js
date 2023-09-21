const express = require('express');
const knex = require('../config/knex')
const booksRouter = express.Router();
const upload = require('../config/upload')

booksRouter.route('/books')
.get(async (request, response) => {
  const books = await knex('book')
  response.json(books);
});

booksRouter.route('/books')
.post(async (request, response) => {
  const insertResult = await knex('book').insert({title: request.body.title});
  if (insertResult && insertResult.length > 0) {
    const books = await knex('book').where('id' , insertResult[0]).select('id', 'title')
    response.json(books[0])
  } else {
    response.json({success: false, message: "failed to insert the new book"})
  }
});

booksRouter.route('/books/:id')
.put(async (request, response) => {
  const putResult = await knex('book').where('id', request.params.id).update({title: request.body.title});
  if (putResult) {
    const books = await knex('book').where('id' , request.params.id).select('id', 'title')
    response.json(books[0])
  } else {
    response.json({success: false, message: "failed to update the book"})
  }
});

booksRouter.route('/books/:id')
.delete(async (request, response) => {
  const deleteResult = await knex('book').where('id', request.params.id).delete();
  if (deleteResult) {
    response.json({})
  } else {
    response.json({success: false, message: "failed to delete the book"})
  }
});

booksRouter.route('/books/:id/image')
.post(upload.single('file'), async (request, response, next) => {
  try {
    console.log(request.file.filename);
    const updateResult = await knex('book').where('id', request.params.id).update({image_file_name: request.file.filename});

    if (updateResult) {
      const books = await knex('book').where('id', request.params.id).select('id', 'title', 'image_file_name')
      response.json(books[0])
    } else {
      response.json({success: false, message: "failed to update the book"})
    }
  } catch (err) {
    next(err)
  }
});

booksRouter.route('/books/image/:filename')
.get(async (request, response) => {
  response.sendFile(`${process.env.IMAGE_DIR}/${request.params.filename}`)
  
});

module.exports = booksRouter;
