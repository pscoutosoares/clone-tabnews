import session from "models/session";
import orchestrator from "tests/orchestrator.js";
import { version as uuidVersion } from "uuid";
beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

const ENDPOINT_URL = "http://localhost:3000/api/v1/sessions";

describe("POST /api/v1/sessions", () => {
  describe("Anonymous user", () => {
    test("With incorrect ´email´ but corrrect ´password´", async () => {
      await orchestrator.createUser({
        password: "correct-password",
      });
      const response = await fetch(ENDPOINT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "wrong-email@test.com",
          password: "correct-password",
        }),
      });
      expect(response.status).toBe(401);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "UnauthorizedError",
        message: "Dados de autenticação não conferem.",
        action: "Verifique se os dados enviados estão corretos.",
        status_code: 401,
      });
    });
    test("With correct ´email´ but incorrrect ´password´", async () => {
      await orchestrator.createUser({
        email: "correct@email.com",
      });
      const response = await fetch(ENDPOINT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "correct@email.com",
          password: "incorrect-password",
        }),
      });
      expect(response.status).toBe(401);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "UnauthorizedError",
        message: "Dados de autenticação não conferem.",
        action: "Verifique se os dados enviados estão corretos.",
        status_code: 401,
      });
    });
    test("With incorrect ´email´ and incorrrect ´password´", async () => {
      await orchestrator.createUser({});
      const response = await fetch(ENDPOINT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "incorrect-email@email.com",
          password: "incorrect-password",
        }),
      });
      expect(response.status).toBe(401);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "UnauthorizedError",
        message: "Dados de autenticação não conferem.",
        action: "Verifique se os dados enviados estão corretos.",
        status_code: 401,
      });
    });
    test("With both correct ´email´ and ´password´", async () => {
      const validUser = await orchestrator.createUser({
        email: "new-correct@email.com",
        password: "new-correct-password",
      });
      const response = await fetch(ENDPOINT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "new-correct@email.com",
          password: "new-correct-password",
        }),
      });
      expect(response.status).toBe(201);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
        expires_at: responseBody.expires_at,
        id: responseBody.id,
        token: responseBody.token,
        user_id: validUser.id,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
      expect(Date.parse(responseBody.expires_at)).not.toBeNaN();

      const createdAt = new Date(responseBody.created_at).setMilliseconds(0);
      const expiresAt = new Date(responseBody.expires_at).setMilliseconds(0);
      expect(expiresAt - createdAt).toBe(
        session.EXPIRATION_DATE_IN_MILLISECONDS,
      );
    });
  });
});
