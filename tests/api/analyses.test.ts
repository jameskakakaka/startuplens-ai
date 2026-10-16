
import {
  describe,
  expect,
  it,
  vi,
  beforeEach,
} from "vitest";

import {
  fixtureInput,
  fixtureAnalysis,
} from "../fixtures/analysis";

const mocks = vi.hoisted(() => ({
  create: vi.fn(),
  list: vi.fn(),
}));

vi.mock("@/lib/db/analyses", () => ({
  createAnalysisRecord: mocks.create,
  getAnalysisRecords: mocks.list,
}));

import {
  GET,
  POST,
} from "../../src/app/api/analyses/route";

describe("POST /api/analyses", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 201 for a valid analysis", async () => {
    mocks.create.mockResolvedValue({
      id: "123e4567-e89b-42d3-a456-426614174000",
      createdAt: new Date("2026-10-15T10:00:00Z"),
    });

    const request = new Request(
      "http://localhost:3001/api/analyses",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: fixtureInput,
          analysis: fixtureAnalysis,
        }),
      }
    );

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.id).toBeDefined();

    expect(mocks.create).toHaveBeenCalledOnce();
  });

  it("rejects invalid startup input", async () => {
    const request = new Request(
      "http://localhost:3001/api/analyses",
      {
        method: "POST",
        body: JSON.stringify({
          input: {
            ...fixtureInput,
            name: "",
          },
          analysis: fixtureAnalysis,
        }),
      }
    );

    const response = await POST(request);

    expect(response.status).toBe(400);
    expect(mocks.create).not.toHaveBeenCalled();
  });

  it("rejects malformed analysis", async () => {
    const request = new Request(
      "http://localhost:3001/api/analyses",
      {
        method: "POST",
        body: JSON.stringify({
          input: fixtureInput,
          analysis: {
            scores: {},
          },
        }),
      }
    );

    const response = await POST(request);

    expect(response.status).toBe(400);
    expect(mocks.create).not.toHaveBeenCalled();
  });

  it("rejects malformed JSON", async () => {
    const request = new Request(
      "http://localhost:3001/api/analyses",
      {
        method: "POST",
        body: "{invalid",
      }
    );

    const response = await POST(request);

    expect(response.status).toBe(400);
    expect(mocks.create).not.toHaveBeenCalled();
  });

  it("returns 500 when persistence fails", async () => {
    mocks.create.mockRejectedValue(
      new Error("Mock database failure")
    );

    const request = new Request(
      "http://localhost:3001/api/analyses",
      {
        method: "POST",
        body: JSON.stringify({
          input: fixtureInput,
          analysis: fixtureAnalysis,
        }),
      }
    );

    const response = await POST(request);

    expect(response.status).toBe(500);
  });
});

describe("GET /api/analyses", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns saved records", async () => {
    mocks.list.mockResolvedValue([]);

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.records).toEqual([]);
  });

  it("handles database failures", async () => {
    mocks.list.mockRejectedValue(
      new Error("Mock database failure")
    );

    const response = await GET();

    expect(response.status).toBe(500);
  });
});

