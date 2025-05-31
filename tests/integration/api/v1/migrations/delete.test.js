const ENDPOINT_URL = "http://localhost:3000/api/v1/migrations";

describe("DELETE /api/v1/migrations", () => {
  test("DELETE to /api/v1/migrations should return 405", async () => {
    const response1 = await fetch(ENDPOINT_URL, {
      method: "DELETE",
    });
    expect(response1.status).toBe(405);
  });
});
