


export const STARTUP_ANALYSIS_RUBRIC = `
SCORING FRAMEWORK

Evaluate MARKET, PRODUCT, and DEFENSIBILITY
independently on an integer scale of 1 to 10.

GENERAL RULES:
- High scores require strong supplied evidence.
- Plausible claims are not verified evidence.
- Missing information should limit confidence.
- Do not invent numbers, customers, revenue,
  market size, growth rates, or competitors.
- Every score requires a specific rationale.
- Distinguish current evidence from hypotheses.
- A clear pitch is not evidence of product-market fit.

MARKET ATTRACTIVENESS

Evaluate:
- severity and frequency of customer pain
- clarity of target customer
- evidence of customer demand
- market opportunity
- willingness to pay

1-3:
Weak or unclear customer pain.
Little evidence of demand or market opportunity.

4-6:
Plausible market need, but important
uncertainty remains.

7-8:
Clear customer pain and credible market
opportunity supported by supplied evidence.

9-10:
Exceptional evidence of strong demand,
customer willingness to pay, and
market opportunity.

Never assign 9-10 without unusually
strong evidence.

PRODUCT QUALITY

Evaluate:
- clarity of the problem
- usefulness of the solution
- product differentiation
- demonstrated customer value
- product validation

1-3:
Unclear solution or weak customer value.

4-6:
Plausible solution, but differentiation
or customer validation is uncertain.

7-8:
Strong value proposition with credible
supplied evidence of customer usefulness.

9-10:
Exceptional evidence of product value,
validation, and differentiation.

A product description alone does not
justify a score above 6.

DEFENSIBILITY

Evaluate:
- switching costs
- proprietary data
- network effects
- technical advantage
- distribution advantage
- existing barriers to competition

1-3:
Limited demonstrated competitive protection.

4-6:
Potential advantages exist, but
durability is uncertain.

7-8:
Meaningful defensibility supported by
concrete supplied evidence.

9-10:
Exceptional and difficult-to-replicate
competitive advantages supported by
strong evidence.

Do not treat hypothetical future moats
as existing defensibility.


CONFIDENCE CALIBRATION

Confidence measures how strongly the
supplied evidence supports the analysis.

It does NOT measure the model's subjective
certainty, writing fluency, or optimism.

HIGH:
Enough specific, relevant supplied information
exists to support most material conclusions.

Important topics such as customer demand,
product validation, competition, and business
performance are supported by concrete evidence.

Some uncertainties may remain.

MEDIUM:
Some conclusions are supported by supplied
information, but major uncertainties remain.

The analysis can make qualified assessments,
but cannot confidently validate the overall
business opportunity.

LOW:
Information is too limited for strong conclusions.

Critical evidence about customers, traction,
product validation, or competitive position
is missing.

CONFIDENCE RULES:
- Evaluate evidence, not the strength of the pitch.
- A detailed description is not necessarily evidence.
- Do not infer traction, revenue, or retention.
- Missing critical evidence should lower confidence.
- With only a basic product description, use LOW.
- Self-reported metrics are not independently verified.
- HIGH does not mean the startup is a good investment.
- Scores and confidence are different concepts.

INFORMATION GAPS

Identify missing decision-relevant
information such as:
- customer traction
- retention and churn
- CAC and acquisition channels
- revenue and unit economics
- competitors and differentiation
- founding team
- distribution and sales process

Only mark something missing if it was
not supplied in the input.

EXPLANATION RULES

For each score:
- Explain what supports the score.
- Explain what evidence is missing.
- Do not fabricate supporting evidence.
- Keep the rationale concise and specific.

NEXT STEP

Recommend one concrete due-diligence
action that addresses the most important
uncertainty.
`;

