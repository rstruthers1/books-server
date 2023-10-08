const express = require('express');
const knex = require('../config/knex')
const upload = require("../config/upload");
const videosRouter = express.Router();

videosRouter.route('/videos')
.get(async (request, response, next) => {
  try {
    const videos = await knex('video')
    response.json(videos);
  } catch (err) {
    next(err)
  }
});

videosRouter.route('/videos')
.post(async (request, response, next) => {
  try {
    const insertResult = await knex('video').insert({title: request.body.title, video_type: request.body.video_type});
    if (insertResult && insertResult.length > 0) {
      const videos = await knex('video').where('id', insertResult[0]).select('*')
      response.json(videos[0])
    } else {
      response.json({success: false, message: "failed to insert the new video"})
    }
  } catch(err) {
    next(err)
  }
});


videosRouter.route('/videos/:id')
.put(async (request, response, next) => {
  try {
    const putResult = await knex('video').where('id', request.params.id).update(
        {title: request.body.title, video_type: request.body.video_type});
    if (putResult) {
      const videos = await knex('video').where('id', request.params.id).select('*')
      response.json(videos[0])
    } else {
      response.json({success: false, message: "failed to update the video"})
    }
  } catch(err) {
    next(err)
  }
});


videosRouter.route('/videos/:id')
.delete(async (request, response, next) => {
  try {
    const deleteResult = await knex('video').where('id', request.params.id).delete();
    if (deleteResult) {
      response.json({})
    } else {
      response.json({success: false, message: "failed to delete the video"})
    }
  } catch (err) {
    next(err)
  }
});

videosRouter.route('/videos/:id')
    .get(async (request, response, next) => {
      try {
        const videos = await knex('video').where('id', request.params.id).select("*")
        if (videos  && videos.length > 0) {
          response.json(videos[0])
        } else {
          response.json({success: false, message: "failed to fetch video"})
        }
      } catch(err) {
        next(err)
      }
    });

videosRouter.route('/videos/:id/image')
    .post(upload.single('file'), async (request, response, next) => {
      try {
        console.log(request.file.filename);
        const updateResult = await knex('video').where('id', request.params.id).update({image_file_name: request.file.filename});

        if (updateResult) {
          const videos = await knex('video').where('id', request.params.id).select('*')
          response.json(videos[0])
        } else {
          response.json({success: false, message: "failed to upload video image"})
        }
      } catch (err) {
        next(err)
      }
    });

videosRouter.route('/videos/image/:filename')
    .get(async (request, response, next) => {
      try {
        response.sendFile(`${process.env.IMAGE_DIR}/${request.params.filename}`)
      } catch (err) {
        next(err)
      }
    });

module.exports = videosRouter;
