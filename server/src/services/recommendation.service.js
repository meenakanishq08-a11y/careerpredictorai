const { getLLMRecommendations } = require('./llm.service');
const Recommendation = require('../models/Recommendation');
const Profile = require('../models/Profile');

const generateAndSave = async (userId) => {
  const profile = await Profile.findOne({ userId });
  if (!profile) throw Object.assign(new Error('Profile not found. Please complete your profile first.'), { statusCode: 404 });

  const llmResult = await getLLMRecommendations(profile);

  const recommendation = await Recommendation.create({
    userId,
    profileSnapshot: profile.toObject(),
    careerPaths: llmResult.careerPaths,
    summary: llmResult.summary,
  });

  return recommendation;
};

module.exports = { generateAndSave };
