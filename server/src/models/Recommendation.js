const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
}, { _id: false });

const roadmapStepSchema = new mongoose.Schema({
  step: { type: String, required: true },
  completed: { type: Boolean, default: false },
}, { _id: false });

const careerPathSchema = new mongoose.Schema({
  title: { type: String, required: true },
  fitScore: { type: Number, min: 0, max: 100 },
  reasons: [String],
  requiredSkills: [String],
  missingSkills: [String],
  learningRoadmap: [roadmapStepSchema],
  resources: [resourceSchema],
  salaryRange: { type: String, default: '$95,000 - $145,000 / yr' },
  growthOutlook: { type: String, default: '+20% (Much faster than average)' },
  demandLevel: { type: String, default: 'Very High' },
  topCompanies: [String],
}, { _id: false });

const recommendationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  profileSnapshot: { type: Object, required: true },
  careerPaths: [careerPathSchema],
  summary: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Recommendation', recommendationSchema);
