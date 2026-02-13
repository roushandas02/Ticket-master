// src/utils/eventUtils.js
export const normalizeTeamSize = (teamSize) => {
  if (!teamSize) return { min_team_size: 1, max_team_size: 1 };

  // "4"
  if (/^\d+$/.test(teamSize)) {
    const size = Number(teamSize);
    return {
      min_team_size: size,
      max_team_size: size,
    };
  }

  // "2-5"
  if (/^\d+-\d+$/.test(teamSize)) {
    const [min, max] = teamSize.split("-").map(Number);
    return {
      min_team_size: min,
      max_team_size: max,
    };
  }

  return { min_team_size: 1, max_team_size: 1 };
};
