
import {
  STARTUP_TEST_CASES,
} from "./test-cases";

export const reliabilityCases = [
  {
    ...STARTUP_TEST_CASES[0],
    expectations: {
      allowedConfidence: ["Medium", "High"],
      minInformationGaps: 2,
      forbidAllPerfectScores: false,
    },
  },
  {
    ...STARTUP_TEST_CASES[1],
    expectations: {
      allowedConfidence: ["Low"],
      minInformationGaps: 3,
      forbidAllPerfectScores: true,
      maxScore: 6,
    },
  },
  {
    ...STARTUP_TEST_CASES[2],
    expectations: {
      allowedConfidence: ["Low"],
      minInformationGaps: 3,
      forbidAllPerfectScores: true,
      maxScore: 6,
    },
  },
] as const;

