/**
 * Re-scores career paths deterministically based on skill changes.
 * No LLM call — fast, deterministic and reliable.
 * Formula: fitScore = baseScore + (matching extra skills bonus) - (removed matching skills penalty)
 */
const simulateScores = (careerPaths = [], extraSkills = [], removedSkills = []) => {
  const normalize = (s) => (typeof s === 'string' ? s.toLowerCase().trim() : '');
  const extraNorm = extraSkills.map(normalize).filter(Boolean);
  const removedNorm = removedSkills.map(normalize).filter(Boolean);

  return careerPaths.map((cp) => {
    const required = (cp.requiredSkills || []).map(normalize).filter(Boolean);
    const baseScore = typeof cp.fitScore === 'number' ? cp.fitScore : 70;

    const extraMatches = extraNorm.filter((s) =>
      required.some((r) => r.includes(s) || s.includes(r))
    ).length;

    const removedMatches = removedNorm.filter((s) =>
      required.some((r) => r.includes(s) || s.includes(r))
    ).length;

    const overlapBonus = required.length > 0 ? (extraMatches / required.length) * 28 : extraMatches * 4;
    const missingPenalty = required.length > 0 ? (removedMatches / required.length) * 35 : removedMatches * 6;

    const newScore = Math.min(99, Math.max(15, Math.round(baseScore + overlapBonus - missingPenalty)));

    return {
      title: cp.title,
      fitScore: newScore,
      delta: newScore - baseScore,
    };
  });
};

module.exports = { simulateScores };
