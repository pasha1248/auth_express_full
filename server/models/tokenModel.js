/** @format */

const { Schema, model } = require('mongoose')

const TokenSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User_' },
  refreshToken: { type: String, required: true },
})
module.exports = model('Token_', TokenSchema)
