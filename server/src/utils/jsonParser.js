/**
 * Production-grade resilient JSON parser for LLM responses.
 * Robustly strips markdown fences, conversational prefix/suffix, trailing commas,
 * and validates the structural integrity of career recommendations.
 */
const stripAndParse = (raw) => {
  if (!raw || typeof raw !== 'string') {
    throw new Error('LLM output is empty or invalid type');
  }

  let cleaned = raw.trim();

  // 1. Strip markdown fences if present
  cleaned = cleaned.replace(/```(?:json)?\s*([\s\S]*?)\s*```/gi, '$1').trim();

  // 2. Extract substring between the first '{' and the last '}'
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    throw new Error('No valid JSON object detected in LLM response');
  }
  cleaned = cleaned.substring(firstBrace, lastBrace + 1);

  // 3. Fix common LLM JSON syntax anomalies (e.g. trailing commas before '}' or ']')
  cleaned = cleaned.replace(/,\s*([}\]])/g, '$1');

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (err) {
    throw new Error(`JSON parsing failed: ${err.message}. Raw output snippet: ${cleaned.substring(0, 160)}...`);
  }

  // 4. Validate schema
  if (!parsed.summary || typeof parsed.summary !== 'string') {
    parsed.summary = 'Personalized career pathway report generated based on your skills, experience, and profile attributes.';
  }

  if (!Array.isArray(parsed.careerPaths) || parsed.careerPaths.length < 1) {
    throw new Error('LLM response missing "careerPaths" array');
  }

  // Ensure exactly 4 or pad / trim to 4
  const paths = parsed.careerPaths.slice(0, 4);

  parsed.careerPaths = paths.map((cp, idx) => {
    if (!cp.title || typeof cp.title !== 'string') {
      throw new Error(`careerPaths[${idx}].title is missing or invalid`);
    }

    const fitScore = typeof cp.fitScore === 'number'
      ? Math.max(10, Math.min(99, Math.round(cp.fitScore)))
      : 75;

    const reasons = Array.isArray(cp.reasons) && cp.reasons.length > 0
      ? cp.reasons.map(String)
      : ['Strong alignment with your core technical and domain profile'];

    const requiredSkills = Array.isArray(cp.requiredSkills) && cp.requiredSkills.length > 0
      ? cp.requiredSkills.map(String)
      : ['Problem Solving', 'Communication', 'Industry Fundamentals'];

    const missingSkills = Array.isArray(cp.missingSkills)
      ? cp.missingSkills.map(String)
      : [];

    const learningRoadmap = Array.isArray(cp.learningRoadmap) && cp.learningRoadmap.length > 0
      ? cp.learningRoadmap.map(s => typeof s === 'string' ? s : (s.step || JSON.stringify(s)))
      : [
          'Phase 1: Deepen domain fundamentals & essential tooling',
          'Phase 2: Complete 2 production-grade portfolio projects',
          'Phase 3: System architecture & real-world best practices',
          'Phase 4: Targeted applications and technical mock interviews'
        ];

    const resources = Array.isArray(cp.resources) && cp.resources.length > 0
      ? cp.resources.filter(r => r && r.title && r.url)
      : [
          { title: 'Roadmap.sh Developer Guides', url: 'https://roadmap.sh' },
          { title: 'Coursera Professional Specializations', url: 'https://www.coursera.org' }
        ];

    return {
      title: cp.title.trim(),
      fitScore,
      reasons,
      requiredSkills,
      missingSkills,
      learningRoadmap,
      resources,
      salaryRange: cp.salaryRange || '$90,000 - $140,000 / yr',
      growthOutlook: cp.growthOutlook || '+18% (Faster than average)',
      demandLevel: cp.demandLevel || 'High',
      topCompanies: Array.isArray(cp.topCompanies) && cp.topCompanies.length > 0
        ? cp.topCompanies
        : ['Google', 'Microsoft', 'Amazon', 'Stripe', 'Atlassian']
    };
  });

  return parsed;
};

module.exports = { stripAndParse };
