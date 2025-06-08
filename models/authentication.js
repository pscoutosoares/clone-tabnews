import user from "models/user.js";
import { UnauthorizedError, NotFoundError } from "infra/errors";
import password from "models/password";

async function getAuthenticatedUser(providedEmail, providedPassword) {
  try {
    const storedUser = await getUserByEmail(providedEmail);
    await validatePassword(providedPassword, storedUser.password);
    return storedUser;
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw new UnauthorizedError({
        message: "Dados de autenticação não conferem.",
        action: "Verifique se os dados enviados estão corretos.",
      });
    }
    throw error;
  }
}

async function getUserByEmail(providedEmail) {
  try {
    const returnUser = await user.findOneByEmail(providedEmail);
    return returnUser;
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw new UnauthorizedError({
        message: "Dados de autenticação não conferem.",
        action: "Verifique se os dados enviados estão corretos.",
      });
    }
    throw error;
  }
}

async function validatePassword(providedPassword, storedPassword) {
  const correctPasswordMatch = await password.compare(
    providedPassword,
    storedPassword,
  );
  if (!correctPasswordMatch) {
    throw new UnauthorizedError({
      message: "Senha não confere.",
      action: "Verifique se este dado está correto.",
    });
  }
  return correctPasswordMatch;
}

const session = {
  getAuthenticatedUser,
};

export default session;
