const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
  degree: { type: String, required: true },
  institution: { type: String, required: true },
  year: { type: Number },
  score: { type: String },
}, { _id: false });

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  education: [educationSchema],
  skills: [{ type: String, trim: true }],
  interests: [{ type: String, trim: true }],
  experienceYears: { type: Number, default: 0, min: 0 },
  workStyle: {
    type: String,
    enum: ['remote', 'onsite', 'hybrid'],
    default: 'hybrid',
  },
  preferredDomains: [{ type: String, trim: true }],
  careerGoal: { type: String, maxlength: 500 },
  updatedAt: { type: Date, default: Date.now },
});

profileSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Profile', profileSchema);
