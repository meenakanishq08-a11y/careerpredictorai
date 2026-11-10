const Recommendation = require('../models/Recommendation');
const { generateAndSave } = require('../services/recommendation.service');
const { simulateScores } = require('../services/simulator.service');
const { success, error } = require('../utils/apiResponse');

const generate = async (req, res, next) => {
  try {
    const recommendation = await generateAndSave(req.user._id);
    return success(res, recommendation, 'Recommendations generated', 201);
  } catch (err) {
    next(err);
  }
};

const getHistory = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(20, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Recommendation.find({ userId: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Recommendation.countDocuments({ userId: req.user._id }),
    ]);

    return success(res, { items, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

const getOne = async (req, res, next) => {
  try {
    const rec = await Recommendation.findById(req.params.id);
    if (!rec) return error(res, 'Recommendation not found', 404);
    if (rec.userId.toString() !== req.user._id.toString()) return error(res, 'Not authorized', 403);
    return success(res, rec);
  } catch (err) {
    next(err);
  }
};

const deleteOne = async (req, res, next) => {
  try {
    const rec = await Recommendation.findById(req.params.id);
    if (!rec) return error(res, 'Recommendation not found', 404);
    if (rec.userId.toString() !== req.user._id.toString()) return error(res, 'Not authorized', 403);
    await rec.deleteOne();
    return success(res, null, 'Recommendation deleted');
  } catch (err) {
    next(err);
  }
};

const updateRoadmap = async (req, res, next) => {
  try {
    const { pathIndex, stepIndex, completed } = req.body;
    const rec = await Recommendation.findById(req.params.id);
    if (!rec) return error(res, 'Recommendation not found', 404);
    if (rec.userId.toString() !== req.user._id.toString()) return error(res, 'Not authorized', 403);

    if (!rec.careerPaths[pathIndex] || !rec.careerPaths[pathIndex].learningRoadmap[stepIndex]) {
      return error(res, 'Invalid pathIndex or stepIndex', 400);
    }

    rec.careerPaths[pathIndex].learningRoadmap[stepIndex].completed = completed;
    rec.markModified('careerPaths');
    await rec.save();

    return success(res, rec, 'Roadmap updated');
  } catch (err) {
    next(err);
  }
};

const simulate = async (req, res, next) => {
  try {
    const { recommendationId, extraSkills = [], removedSkills = [] } = req.body;
    const rec = await Recommendation.findById(recommendationId);
    if (!rec) return error(res, 'Recommendation not found', 404);
    if (rec.userId.toString() !== req.user._id.toString()) return error(res, 'Not authorized', 403);

    const simulated = simulateScores(rec.careerPaths, extraSkills, removedSkills);
    return success(res, { simulated });
  } catch (err) {
    next(err);
  }
};

module.exports = { generate, getHistory, getOne, deleteOne, updateRoadmap, simulate };
