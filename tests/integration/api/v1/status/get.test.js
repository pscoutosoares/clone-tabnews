import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

describe("GET /api/v1/status", () => {
  describe("Annonymous user", () => {
    test("Retrieving current system status", async () => {
      const response = await fetch("http://localhost:3000/api/v1/status");
      expect(response.status).toBe(200);

      const responseBody = await response.json();
      expect(responseBody.updated_at).toBeDefined();

      const updatedAtParsedToIso = new Date(
        responseBody.updated_at,
      ).toISOString();
      expect(responseBody.updated_at).toEqual(updatedAtParsedToIso);

      const max_connections = parseInt(
        responseBody.dependencies.database.max_connections,
      );
      const opened_connections = parseInt(
        responseBody.dependencies.database.opened_connections,
      );
      expect(max_connections).toBeGreaterThan(0);
      expect(opened_connections).toBe(1);
      expect(responseBody.dependencies.database.version).toBe("16.0");
    });
  });
});
