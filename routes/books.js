const express = require('express');
const knex = require('../config/knex')
const booksRouter = express.Router();
const upload = require('../config/upload')

booksRouter.route('/books')
    .get(async (request, response, next) => {
        try {
            const books = await knex('book')
            response.json(books);
        } catch (err) {
            next(err)
        }
    });

booksRouter.route('/books')
    .post(async (request, response, next) => {
        try {
            const insertResult = await knex('book').insert({
                title: request.body.title,
                author: request.body.author
            });
            if (insertResult && insertResult.length > 0) {
                const books = await knex('book').where('id', insertResult[0]).select('*')
                response.json(books[0])
            } else {
                response.json({success: false, message: "failed to insert the new book"})
            }
        } catch (err) {
            next(err)
        }
    });

booksRouter.route('/books/:id')
    .put(async (request, response, next) => {
        try {
            const putResult = await knex('book').where('id', request.params.id).update({
                title: request.body.title,
                author: request.body.author
            });
            if (putResult) {
                const books = await knex('book').where('id', request.params.id).select('*')
                response.json(books[0])
            } else {
                response.json({success: false, message: "failed to update the book"})
            }
        } catch (err) {
            next(err)
        }
    });

booksRouter.route('/books/:id')
    .delete(async (request, response, next) => {
        try {
            const deleteResult = await knex('book').where('id', request.params.id).delete();
            if (deleteResult) {
                response.json({})
            } else {
                response.json({success: false, message: "failed to delete the book"})
            }
        } catch (err) {
            next(err)
        }
    });

booksRouter.route('/books/:id')
    .get(async (request, response, next) => {
        try {
            const books = await knex('book').where('id', request.params.id).select("*")
            if (books && books.length > 0) {
                response.json(books[0])
            } else {
                response.json({success: false, message: "failed to fetch book"})
            }
        } catch (err) {
            next(err)
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
    .get(async (request, response, next) => {
        try {
            response.sendFile(`${process.env.IMAGE_DIR}/${request.params.filename}`)
        } catch (err) {
            next(err)
        }

    });

module.exports = booksRouter;
