import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <UpdatedAt />
      <h1>Database</h1>
      <DatabaseStatus />
    </>
  );
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });
  JSON.stringify(data, null, 2);
  let UpdatedAtText = "Carregando...";
  console.log(data);
  if (!isLoading && data) {
    UpdatedAtText = new Date(data.updated_at).toLocaleString("pt-br");
  }

  return <div>Última atualização: {UpdatedAtText} </div>;
}

function DatabaseStatus() {
  const { isLoading, data } = useSWR("api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });
  JSON.stringify(data, null, 2);
  let version,
    openConnections,
    maxConnections = "Carregando...";

  console.log(data);
  if (!isLoading && data) {
    version = data.dependencies.database.version;
    openConnections = data.dependencies.database.opened_connections;
    maxConnections = data.dependencies.database.max_connections;
  }

  return (
    <div>
      <div>Versão: {version} </div>
      <div>Conexões abertas: {openConnections} </div>
      <div>Conexões máximas: {maxConnections} </div>
    </div>
  );
}
