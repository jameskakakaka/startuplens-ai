
import "server-only";

import OpenAI from "openai";

let client: OpenAI | null = null;

export function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY is not configured.",
    );
  }

  if (!client) {
    client = new OpenAI({
      apiKey,

      timeout: 30_000,

      // No hidden billable retries during development.
      maxRetries: 0,
    });
  }

  return client;
}

