
import type { StartupInput } from "@/schemas/startup";

import type { StartupAnalysis } from "@/schemas/analysis";

export const fixtureInput: StartupInput = {
  name: "LedgerAI",
  industry: "Fintech",

  description:
    "LedgerAI is a fictional accounting software startup that uses AI to help small businesses automate bookkeeping.",

  targetCustomer:
    "Small and medium-sized businesses",

  businessModel:
    "B2B SaaS subscription",
};

export const fixtureAnalysis: StartupAnalysis = {
  summary:
    "LedgerAI proposes AI-assisted bookkeeping for SMEs. The concept addresses a plausible need, but commercial validation is not established.",

  businessModelAssessment:
    "A B2B SaaS subscription model is plausible, but pricing, conversion rates and customer retention have not been demonstrated.",

  scores: {
    market: {
      score: 5,
      rationale:
        "The customer segment and use case are clear, but evidence of market demand is missing.",
    },

    product: {
      score: 5,
      rationale:
        "Bookkeeping automation could create value, but product effectiveness has not been verified.",
    },

    defensibility: {
      score: 3,
      rationale:
        "No established switching costs, proprietary datasets or durable competitive advantages were supplied.",
    },
  },

  strengths: [
    "The startup identifies a specific customer segment.",
    "The product addresses a repetitive business workflow.",
  ],

  risks: [
    "The competitive landscape is not validated.",
    "Customer acquisition costs and retention are unknown.",
  ],

  potentialMoat: [
    "Workflow integrations could eventually create switching costs.",
    "Legally obtained proprietary data might support future differentiation.",
  ],

  founderQuestions: [
    "What percentage of customers remain active after twelve months?",
    "What evidence demonstrates differentiation from incumbent accounting platforms?",
  ],

  informationGaps: [
    "No customer traction or retention metrics were supplied.",
    "No customer acquisition cost or competitive benchmarks were supplied.",
  ],

  confidence: "Low",

  verdict:
    "The concept is plausible, but commercial evidence is insufficient to support a strong investment assessment.",

  recommendedNextStep:
    "Conduct customer-reference interviews and request retention evidence before further investment screening.",
};

