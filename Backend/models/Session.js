const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SessionSchema = new Schema({
  token: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  expires_at: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Session', SessionSchema);