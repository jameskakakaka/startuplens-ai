
import {
  StartupAnalysisSchema,
  type StartupAnalysis,
} from "@/schemas/analysis";

export class AIOutputValidationError extends Error {
  constructor(
    public readonly issues: {
      path: string;
      message: string;
    }[]
  ) {
    super("AI output failed quality validation.");
    this.name = "AIOutputValidationError";
  }
}

export function validateAIResponse(
  response: unknown
): StartupAnalysis {
  const result =
    StartupAnalysisSchema.safeParse(response);

  if (!result.success) {
    const issues = result.error.issues.map(
      (issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })
    );

    throw new AIOutputValidationError(issues);
  }

  return result.data;
}

