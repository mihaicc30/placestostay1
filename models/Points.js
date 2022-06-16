const mongoose = require('mongoose');

const PointsSchema = new mongoose.Schema({
  type:         { type: String, default:"" },
  coords:       { type: String, default:"" },
  icon:         { type: String, default:"" },
  alt:          { type: String, default:"" },
  color:        { type: String, default:"" },
  fill_color:   { type: String, default:"" },
  fill_opacity: { type: String, default:"" },
  radius:       { type: String, default:"" },
  popup_message: { type: String, default:"" },
  layer_group:  { type: String, default:"" },
  belongs_to:  { type: String, default:"" },
  date: {
    type: Date,
    default: Date.now
  }
});

const Points = mongoose.model('Points', PointsSchema);

module.exports = Points;
