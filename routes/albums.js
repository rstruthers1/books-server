const express = require('express');
const knex = require('../config/knex')
const albumsRouter = express.Router();

albumsRouter.route('/albums')
.get(async (request, response, next) => {
  const albums = await knex('album')
  response.json(albums);
});

albumsRouter.route('/albums')
.post(async (request, response, next) => {
  try {
    const insertResult = await knex('album').insert({name: request.body.name});
    if (insertResult && insertResult.length > 0) {
      const albums = await knex('album').where('id', insertResult[0]).select('id', 'name')
      response.json(albums[0])
    } else {
      response.json({success: false, message: "failed to insert the new album"})
    }
  } catch(err) {
    next(err)
  }
});


albumsRouter.route('/albums/:id')
.put(async (request, response, next) => {
  try {
    const putResult = await knex('album').where('id', request.params.id).update({name: request.body.name});
    if (putResult) {
      const albums = await knex('album').where('id', request.params.id).select('id', 'name')
      response.json(albums[0])
    } else {
      response.json({success: false, message: "failed to update the album"})
    }
  } catch(err) {
    next(err)
  }
});


albumsRouter.route('/albums/:id')
.delete(async (request, response, next) => {
  try {
    const deleteResult = await knex('album').where('id', request.params.id).delete();
    if (deleteResult) {
      response.json({})
    } else {
      response.json({success: false, message: "failed to delete the album"})
    }
  } catch (err) {
    next(err)
  }
});

/*

albumsRouter.route('/albums/:id/image')
.post(upload.single('file'), async (request, response) => {
  console.log(request.file.filename);
  const updateResult = await knex('book').where('id', request.params.id).update({image_file_name: request.file.filename});
  response.json({success: true});
});

albumsRouter.route('/albums/image/:filename')
.get(async (request, response) => {
  response.sendFile(`C:\\Users\\rstru\\IdeaProjects\\books-server\\uploads\\${request.params.filename}`)
  
});
*/


module.exports = albumsRouter;
