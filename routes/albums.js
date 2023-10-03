const express = require('express');
const knex = require('../config/knex')
const upload = require("../config/upload");
const albumsRouter = express.Router();

albumsRouter.route('/albums')
.get(async (request, response, next) => {
  try {
    const albums = await knex('album')
    response.json(albums);
  } catch (err) {
    next(err)
  }
});

albumsRouter.route('/albums')
.post(async (request, response, next) => {
  try {
    const insertResult = await knex('album').insert({name: request.body.name, artist: request.body.artist});
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
    const putResult = await knex('album').where('id', request.params.id).update(
        {name: request.body.name, artist: request.body.artist});
    if (putResult) {
      const albums = await knex('album').where('id', request.params.id).select('*')
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

albumsRouter.route('/albums/:id')
    .get(async (request, response, next) => {
      try {
        const albums = await knex('album').where('id', request.params.id).select("*")
        if (albums  && albums.length > 0) {
          response.json(albums[0])
        } else {
          response.json({success: false, message: "failed to fetch album"})
        }
      } catch(err) {
        next(err)
      }
    });

albumsRouter.route('/albums/:id/image')
    .post(upload.single('file'), async (request, response, next) => {
      try {
        console.log(request.file.filename);
        const updateResult = await knex('album').where('id', request.params.id).update({image_file_name: request.file.filename});

        if (updateResult) {
          const albums = await knex('book').where('id', request.params.id).select('*')
          response.json(albums[0])
        } else {
          response.json({success: false, message: "failed to upload album image"})
        }
      } catch (err) {
        next(err)
      }
    });
albumsRouter.route('/albums/image/:filename')
    .get(async (request, response, next) => {
      try {
        response.sendFile(`${process.env.IMAGE_DIR}/${request.params.filename}`)
      } catch (err) {
        next(err)
      }
    });

module.exports = albumsRouter;
