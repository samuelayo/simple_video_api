const Joi = require('joi');
const CustomError = require('../utils/customError');
const requestError = require('../utils/requestError');
const VideoModel = require('../models/Video');
const { pageLimit, successMessage } = require('../config/constants');

/**
 * Validator object for creating a new video
 */
const createVideoSchema = Joi.object().keys({
  name: Joi.string().required(),
  url: Joi.string().required().uri(),
  thumbnailUrl: Joi.string().required().uri(),
  isPrivate: Joi.boolean().required(),
  timesViewed: Joi.number().required(),
});

/**
 * validator object for updating videos. Diff with other validator is that
 * in updating required is not set, this is so we can have optional fields updates
 */
const updateVideoSchema = Joi.object().keys({
  name: Joi.string(),
  url: Joi.string().uri(),
  thumbnailUrl: Joi.string().uri(),
  isPrivate: Joi.boolean(),
  timesViewed: Joi.number(),
});

/**
 * @param {*} requestBody Joi validator instance
 * Sample -> { "name": "clash of titans", "url": "clash.com/titans.mov",
 * "thumbnailUrl": "clash.com/titans.jpg", "isPrivate": false, timesViewed: 30 }
 * returns @Void
 */
const validateRequest = (requestBody, schema) => {
  const { error } = schema.validate(requestBody);
  const valid = error == null;
  if (!valid) {
    throw new CustomError('Invalid Request', 422, error);
  }
};

/**
 *
 * @param {*} req Expressjs request object
 * @param {*} res ExpressJs response object
 * @returns {Object} {PaginatedResponse}
 * Sample -> {
 * message: 'Sucess',
 * data: {
 *           totalCount: 1000,
 *           page: 1,
 *          items: [{ "name": "clash of titans", "url": "clash.com/titans.mov",
 *                  "thumbnailUrl": "clash.com/titans.jpg", "isPrivate": false, timesViewed: 30 }],
 *           itemPerPage: 50,
 *           hasPreviousPage: false,
 *           hasNextPage: true
 *      }
 * }
 */
const getAllVideos = async (req, res) => {
  try {
    let { page, above42, publicOnly } = req.query;
    const query = {};
    if (!page) page = 1;
    if (above42 && above42 !== 'false') query.timesViewed = { $gt: 42 };
    if (publicOnly && publicOnly !== 'false') query.isPrivate = false;
    const totalCount = await VideoModel.countDocuments(query);
    const items = await VideoModel.find(query).limit(pageLimit).skip((page - 1) * pageLimit).exec();
    const data = {
      totalCount,
      page,
      items,
      itemPerPage: pageLimit,
      hasPreviousPage: page > 1,
      hasNextPage: (page * pageLimit) < totalCount,
    };
    return res.status(200).json({
      message: successMessage,
      data,
    });
  } catch (error) {
    return requestError(error, res);
  }
};

/**
 *
 * @param {*} req Express request object
 * @param {*} res Express response object
 * @returns {Object} A video object
 */
const getSingleVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await VideoModel.findById(id);
    return res.status(200).json({
      message: successMessage,
      data,
    });
  } catch (error) {
    return requestError(error, res);
  }
};

/**
 *
 * @param {*} req Express request object
 * @param {*} res Express response object
 * @returns {Object} newly created object
 */
const createNewVideo = async (req, res) => {
  try {
    const { body } = req;
    validateRequest(body, createVideoSchema);
    const newRecord = await VideoModel.create(body);
    const data = newRecord.toJSON();
    return res.status(201).json({
      message: successMessage,
      data,
    });
  } catch (error) {
    return requestError(error, res);
  }
};

/**
 *
 * @param {*} req Express request object
 * @param {*} res Express response object
 * @returns {Object} updated video object
 */
const updateVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;
    validateRequest(body, updateVideoSchema);
    const data = await VideoModel.findOneAndUpdate({ _id: id }, { $set: body }, {
      new: true,
    });
    return res.status(200).json({
      message: successMessage,
      data,
    });
  } catch (error) {
    return requestError(error, res);
  }
};

/**
 *
 * @param {*} req Express request object
 * @param {*} res Express response object
 * @returns {Object} with a message saying delete was succesful
 */
const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;
    await VideoModel.deleteOne({ _id: id });
    return res.status(200).json({
      message: successMessage,
    });
  } catch (error) {
    return requestError(error, res);
  }
};

module.exports = {
  getAllVideos, getSingleVideo, createNewVideo, updateVideo, deleteVideo,
};
