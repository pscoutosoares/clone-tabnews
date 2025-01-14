import database from "infra/database";

async function status(request, response) {
  const updatedAt = new Date().toISOString();
  const maxConnections = await database.query("SHOW max_connections;");
  const currentConnections = await database.query(
    "SELECT sum(numbackends) FROM pg_stat_database;",
  );
  response.status(200).json({
    updated_at: updatedAt,
    max_connections: maxConnections.rows[0].max_connections,
    current_connections: currentConnections.rows[0].sum,
  });
}

export default status;
