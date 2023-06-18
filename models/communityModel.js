const mongoose = require('mongoose')
const { Schema } = mongoose
const CommunitySchema = new Schema(
  {
    id: {
      type: 'String',
      required: true,
    },
    name: {
      type: 'String',
    },
    slug: {
      type: 'String',
      unique: true,
    },
    owner: {
      type: 'String',
      required: true,
    },
  },
  { timestamps: true }
)
module.exports = mongoose.model('Community', CommunitySchema)
