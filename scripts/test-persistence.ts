
import {
  fixtureInput,
  fixtureAnalysis,
} from "../src/lib/db/analysis-fixture";

const BASE_URL = "http://localhost:3001";

async function main() {
  // 1. Save
  const saveResponse = await fetch(
    `${BASE_URL}/api/analyses`,
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

  const saved = await saveResponse.json();

  if (saveResponse.status !== 201) {
    throw new Error(
      `Save failed: ${JSON.stringify(saved)}`
    );
  }

  console.log("SAVE SUCCESS:", saved);

  const id: string = saved.id;

  // 2. List
  const listResponse = await fetch(
    `${BASE_URL}/api/analyses`
  );

  const list = await listResponse.json();

  if (!listResponse.ok) {
    throw new Error("History request failed.");
  }

  console.log(
    "HISTORY RECORDS:",
    list.records.length
  );

  // 3. Read detail
  const detailResponse = await fetch(
    `${BASE_URL}/api/analyses/${id}`
  );

  const detail = await detailResponse.json();

  if (!detailResponse.ok) {
    throw new Error("Detail request failed.");
  }

  console.log(
    "DETAIL:",
    detail.record.startupName,
    detail.record.analysis.scores
  );

  // 4. Delete
  const deleteResponse = await fetch(
    `${BASE_URL}/api/analyses/${id}`,
    { method: "DELETE" }
  );

  if (deleteResponse.status !== 204) {
    throw new Error("Delete failed.");
  }

  console.log("DELETE SUCCESS");

  // 5. Verify deletion
  const verifyResponse = await fetch(
    `${BASE_URL}/api/analyses/${id}`
  );

  if (verifyResponse.status !== 404) {
    throw new Error(
      "Deleted record should return 404."
    );
  }

  console.log("ALL PERSISTENCE CHECKS PASSED");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

