const { Schema, model } = require('mongoose');

const collectionName = 'Video';
const schema = new Schema({
  name: String,
  url: String,
  thumbnailUrl: String,
  isPrivate: Boolean,
  timesViewed: Number,
}, {
  timestamps: true,
  versionKey: false,
});

schema.index({
  createdAt: 1,
}, {
  background: true,
});

module.exports = model(collectionName, schema);
