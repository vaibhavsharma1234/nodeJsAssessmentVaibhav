const mongoose = require('mongoose')
const { Schema } = mongoose
const AuthSchema = new Schema(
  {
    id: {
      type: 'String',
      required: true,
      unique: true,
    },
    name: {
      type: 'String',

      default: null,
      minLength: 2,
    },
    email: {
      type: 'String',

      unique: true,
    },
    password: {
      type: 'String',

      minLength: 6,
    },
  },
  { timestamps: true }
)
module.exports = mongoose.model('Auth', AuthSchema)
