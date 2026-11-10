const Profile = require('../models/Profile');
const { success, error } = require('../utils/apiResponse');

const getProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ userId: req.user._id });
    if (!profile) return success(res, null, 'No profile found');
    return success(res, profile);
  } catch (err) {
    next(err);
  }
};

const upsertProfile = async (req, res, next) => {
  try {
    const { education, skills, interests, experienceYears, workStyle, preferredDomains, careerGoal } = req.body;

    const profile = await Profile.findOneAndUpdate(
      { userId: req.user._id },
      {
        userId: req.user._id,
        education: education || [],
        skills: skills || [],
        interests: interests || [],
        experienceYears: experienceYears ?? 0,
        workStyle: workStyle || 'hybrid',
        preferredDomains: preferredDomains || [],
        careerGoal: careerGoal || '',
        updatedAt: Date.now(),
      },
      { upsert: true, new: true, runValidators: true }
    );

    return success(res, profile, 'Profile saved successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = { getProfile, upsertProfile };
