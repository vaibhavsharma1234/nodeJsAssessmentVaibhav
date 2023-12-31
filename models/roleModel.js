const mongoose = require('mongoose')
const { Schema } = mongoose
const RoleSchema = new Schema(
  {
    id: {
      type: 'String',
      required: true,
      unique: true,
    },
    name: {
      type: 'String',

      unique: 'true',
      minLength: 2,
    },
  },
  { timestamps: true }
)
module.exports = mongoose.model('Role', RoleSchema)
