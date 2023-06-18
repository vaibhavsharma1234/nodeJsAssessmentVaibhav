const mongoose = require('mongoose')
const { Schema } = mongoose
const AuthSchema = new Schema(
  {
    id: {
      type: 'String',
    },
    name: {
      type: 'String',
      required: true,

      minLength: 2,
    },
    email: {
      type: 'String',
      required: true,
    },
    password: {
      type: 'String',
      required: true,

      minLength: 6,
    },
  },
  { timestamps: true }
)
module.exports = mongoose.model('Auth', AuthSchema)
