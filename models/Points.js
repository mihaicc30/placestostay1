const mongoose = require('mongoose');

const PointsSchema = new mongoose.Schema({
  type:         { type: String },
  coords:       { type: String },
  icon:         { type: String },
  alt:          { type: String },
  color:        { type: String },
  fill_color:   { type: String },
  fill_opacity: { type: String },
  radius:       { type: String },
  popup_message: { type: String },
  layer_group:  { type: String },
  belongs_to:  { type: String },
  date: {
    type: Date,
    default: Date.now
  }
});

const Points = mongoose.model('Points', PointsSchema);

module.exports = Points;
