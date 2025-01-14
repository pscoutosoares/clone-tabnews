test("GET to /api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);

  const responseBody = await response.json();
  expect(responseBody.updated_at).toBeDefined();

  const updatedAtParsedToIso = new Date(responseBody.updated_at).toISOString();
  expect(responseBody.updated_at).toEqual(updatedAtParsedToIso);

  const max_connections = parseInt(responseBody.max_connections);
  const current_connections = parseInt(responseBody.current_connections);
  expect(max_connections).toBeGreaterThan(0);
  expect(current_connections).toBeGreaterThan(0);
  expect(current_connections).toBeLessThanOrEqual(max_connections);
});
