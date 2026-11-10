/**
 * Builds the system and user messages for the LLM career recommendation call.
 * Enforces structured schema including salary, growth outlook, and market demand.
 */
const buildSystemPrompt = () => {
  return `You are an elite career development strategist and AI talent counselor with 20+ years of cross-industry expertise in technology, business, engineering, and creative sectors.

Analyze the user's detailed background (education, technical & soft skills, core interests, experience, work preferences, and long-term goal).

Return ONLY valid JSON matching this exact schema (no markdown fences, no surrounding commentary):
{
  "summary": "A high-impact 2-3 sentence executive summary of the candidate's core strengths, transferable advantages, and high-potential trajectory.",
  "careerPaths": [
    {
      "title": "Specific career title (e.g. Cloud Native Solutions Architect)",
      "fitScore": 92,
      "reasons": [
        "Concrete rationale 1 referencing user's actual skills/background",
        "Concrete rationale 2 referencing domain interest & trajectory",
        "Concrete rationale 3 referencing market positioning"
      ],
      "requiredSkills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5"],
      "missingSkills": ["High-value skill gap 1", "High-value skill gap 2", "High-value skill gap 3"],
      "learningRoadmap": [
        "Phase 1 (Month 1): Core Foundations & Essential Tooling",
        "Phase 2 (Month 2-3): Practical Implementation & End-to-End Projects",
        "Phase 3 (Month 4-5): Advanced Architecture, Scale & Optimization",
        "Phase 4 (Month 6): Portfolio Presentation, Networking & Interview Prep"
      ],
      "resources": [
        { "title": "Authoritative Resource Name", "url": "https://..." }
      ],
      "salaryRange": "$95,000 - $145,000 / yr (or regional equivalent)",
      "growthOutlook": "+22% growth (Much faster than average)",
      "demandLevel": "Very High",
      "topCompanies": ["Company A", "Company B", "Company C", "Company D"]
    }
  ]
}

Strict Rules:
- Return EXACTLY 4 careerPaths, sorted by fitScore in descending order (highest fit first).
- fitScores must realistically reflect the user's actual skills overlap and career goals (range 45 - 98).
- Ensure missingSkills are actionable and directly address the required gap for this role.
- Each learningRoadmap must contain 4-6 phased, chronological milestones.
- Resources must point to credible real platforms (e.g. coursera.org, roadmap.sh, freecodecamp.org, edx.org, official docs).
- Do not output anything outside the JSON object.`;
};

const buildUserMessage = (profile) => {
  const eduStr = Array.isArray(profile.education) && profile.education.length > 0
    ? profile.education.map(e => `${e.degree || 'Degree'} from ${e.institution || 'University'} (${e.year || 'N/A'})`).join('; ')
    : 'Not specified';

  return `Candidate Profile for Career Evaluation:
- Education History: ${eduStr}
- Core Skills: ${profile.skills?.join(', ') || 'Not specified'}
- Areas of Interest: ${profile.interests?.join(', ') || 'General growth'}
- Years of Experience: ${profile.experienceYears ?? 0} year(s)
- Preferred Work Style: ${profile.workStyle || 'hybrid'}
- Target Domains: ${profile.preferredDomains?.join(', ') || 'Open to all high-growth fields'}
- Career Vision & Ambition: ${profile.careerGoal || 'Seeking highest-fit growth path'}`;
};

module.exports = { buildSystemPrompt, buildUserMessage };
