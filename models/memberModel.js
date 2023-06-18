const mongoose = require('mongoose')
const { Schema } = mongoose
const MemberSchema = new Schema(
  {
    id: {
      type: 'String',
      required: true,
    },
    community: {
      type: 'String',
      required: true,
    },
    user: {
      type: 'String',
      required: true,
    },
    role: {
      type: 'String',
      required: true,
    },
  },
  { timestamps: true }
)
module.exports = mongoose.model('Member', MemberSchema)
