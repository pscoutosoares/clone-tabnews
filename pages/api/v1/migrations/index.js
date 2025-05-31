import { createRouter } from "next-connect";
import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database";
import { MethodNotAllowedError, InternalServerError } from "infra/errors";
const router = createRouter();

router.get(getHandler);
router.post(postHandler);

export default router.handler({
  onNoMatch: onNoMatchHandler,
  onError: onErrorHandler,
});

function onNoMatchHandler(request, response) {
  const publicErrorObject = new MethodNotAllowedError();
  response.status(publicErrorObject.statusCode).json(publicErrorObject);
}

function onErrorHandler(error, request, response) {
  const publicErrorObject = new InternalServerError({
    cause: error,
  });

  console.log("\n Erro dentro do catch do next-connect:");
  console.error(publicErrorObject);

  response.status(500).json(publicErrorObject);
}

async function getHandler(request, response) {
  const dbClient = await database.getNewClient();
  const migrationDefaultConfig = {
    dbClient: dbClient,
    direction: "up",
    dryRun: true,
    dir: resolve("infra", "migrations"),
    verbose: true,
    migrationsTable: "pgmigrations",
  };

  const pendingMigrations = await migrationRunner(migrationDefaultConfig);
  dbClient?.end();

  return response.status(200).json(pendingMigrations);
}

async function postHandler(request, response) {
  const dbClient = await database.getNewClient();
  const migrationDefaultConfig = {
    dbClient: dbClient,
    direction: "up",
    dryRun: true,
    dir: resolve("infra", "migrations"),
    verbose: true,
    migrationsTable: "pgmigrations",
  };

  const migratedMigrations = await migrationRunner({
    ...migrationDefaultConfig,
    dryRun: false,
  });
  dbClient?.end();
  if (migratedMigrations.length > 0) {
    return response.status(201).json(migratedMigrations);
  }
  return response.status(200).json(migratedMigrations);
}
