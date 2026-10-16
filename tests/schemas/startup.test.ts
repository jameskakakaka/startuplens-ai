
import { describe, expect, it } from "vitest";

import {
  StartupInputSchema,
} from "@/schemas/startup";

const validInput = {
  name: "LedgerAI",
  industry: "FinTech",
  description:
    "LedgerAI automates bookkeeping workflows for small businesses.",
  targetCustomer: "SMEs",
  businessModel: "B2B SaaS",
};

describe("StartupInputSchema", () => {
  it("accepts a valid startup", () => {
    expect(
      StartupInputSchema.safeParse(validInput).success
    ).toBe(true);
  });

  it("rejects an empty name", () => {
    expect(
      StartupInputSchema.safeParse({
        ...validInput,
        name: "",
      }).success
    ).toBe(false);
  });

  it("rejects descriptions shorter than 30 chars", () => {
    expect(
      StartupInputSchema.safeParse({
        ...validInput,
        description: "Short description",
      }).success
    ).toBe(false);
  });

  it("accepts exactly 30 characters", () => {
    expect(
      StartupInputSchema.safeParse({
        ...validInput,
        description: "A".repeat(30),
      }).success
    ).toBe(true);
  });

  it("accepts exactly 3000 characters", () => {
    expect(
      StartupInputSchema.safeParse({
        ...validInput,
        description: "A".repeat(3000),
      }).success
    ).toBe(true);
  });

  it("rejects descriptions longer than 3000 chars", () => {
    expect(
      StartupInputSchema.safeParse({
        ...validInput,
        description: "A".repeat(3001),
      }).success
    ).toBe(false);
  });

  it("trims surrounding whitespace", () => {
    const parsed = StartupInputSchema.parse({
      ...validInput,
      name: "  LedgerAI  ",
      industry: "  FinTech  ",
    });

    expect(parsed.name).toBe("LedgerAI");
    expect(parsed.industry).toBe("FinTech");
  });

  it("rejects missing required fields", () => {
    expect(
      StartupInputSchema.safeParse({
        name: "LedgerAI",
      }).success
    ).toBe(false);
  });
});

