const mongoose = require("mongoose");

const domainSchema = mongoose.Schema({
  domain: {
    type: String,
    required: true,
    unique: true,
  },
  wordCount: {
    type: Number,
    required: true,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  webLinks: {
    type: [String],
  },
  mediaLinks: {
    type: [String],
  },
});

const domainModel = new mongoose.model("domain", domainSchema);

module.exports = { domainModel };
