const { Router } = require('express');
const {
  getAllVideos, getSingleVideo, createNewVideo, updateVideo, deleteVideo,
} = require('../controllers/videoController');

const videoRouter = new Router();

videoRouter.get('/all', getAllVideos);
videoRouter.get('/:id', getSingleVideo);
videoRouter.post('/new', createNewVideo);
videoRouter.put('/:id', updateVideo);
videoRouter.delete('/:id', deleteVideo);

module.exports = videoRouter;
