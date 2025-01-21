import database from "infra/database";

async function status(request, response) {
  const updatedAt = new Date().toISOString();
  const maxConnections = await database.query("SHOW max_connections;");
  const currentConnections = await database.query({
    text: `SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;`,
    values: [process.env.POSTGRES_DB],
  });
  const pgCurrentVersion = await database.query("SHOW server_version");
  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: pgCurrentVersion.rows[0].server_version,
        max_connections: maxConnections.rows[0].max_connections,
        opened_connections: currentConnections.rows[0].count,
      },
    },
  });
}

export default status;
