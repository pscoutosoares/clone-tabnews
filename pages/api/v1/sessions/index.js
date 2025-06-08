import { createRouter } from "next-connect";
import controller from "infra/controller";
import session from "models/session";
import authentication from "models/authentication";
const router = createRouter();

router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function postHandler(request, response) {
  const userInputValues = request.body;

  const authenticatedUser = await authentication.getAuthenticatedUser(
    userInputValues.email,
    userInputValues.password,
  );

  const createdSession = await session.create(authenticatedUser.id);

  return response.status(201).json(createdSession);
}
