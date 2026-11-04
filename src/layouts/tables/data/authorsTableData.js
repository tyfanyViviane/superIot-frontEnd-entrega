/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";

function Local_Dispositivo({ device, local }) {
  return (
    <MDBox lineHeight={1.25}>
      <MDTypography fontSize="15px" color="dark" fontWeight="medium">
        {local}
      </MDTypography>
      <MDTypography display="block" variant="button">
        {device}
      </MDTypography>
    </MDBox>
  );
}

function RSSI({ rssi }) {
  if (rssi === null || rssi === undefined) {
    return (
      <MDTypography variant="caption" color="text">
        -
      </MDTypography>
    );
  }

  let quality = "";
  let color = "text";

  if (rssi >= -50) {
    quality = "Excelente";
    color = "success";
  } else if (rssi >= -60) {
    quality = "Bom";
    color = "info";
  } else if (rssi >= -70) {
    quality = "Ruim";
    color = "warning";
  } else {
    quality = "Péssimo";
    color = "error";
  }

  return (
    <MDBox lineHeight={1.25} textAlign="center">
      <MDTypography display="block" variant="caption" fontWeight="medium">
        {rssi} dBm
      </MDTypography>
      <MDTypography variant="caption" color={color} fontWeight="bold">
        {quality}
      </MDTypography>
    </MDBox>
  );
}

function Status_Dispositivo({ status }) {
  let color = "secondary";
  let label = "Desconhecido";

  if (status === "online") {
    color = "success";
    label = "Online";
  } else if (status === "offline") {
    color = "dark";
    label = "Offline";
  }

  return (
    <MDBox ml={-1} display="flex" justifyContent="left">
      <MDBadge badgeContent={label} color={color} variant="gradient" size="sm" />
    </MDBox>
  );
}

// A API já manda o tempo relativo ("há 718 h") e a data formatada prontos
function UltimaComunicacao({ relative, formattedDate }) {
  if (!relative && !formattedDate) {
    return (
      <MDTypography variant="caption" color="text">
        -
      </MDTypography>
    );
  }

  return (
    <MDBox lineHeight={1.25} textAlign="center">
      <MDTypography display="block" variant="caption" fontWeight="medium">
        {relative}
      </MDTypography>
      <MDTypography variant="caption" color="text" fontSize="10px">
        {formattedDate}
      </MDTypography>
    </MDBox>
  );
}

function Problema({ problem, severity = "normal" }) {
  if (!problem || problem === "Nenhum" || problem === "Normal" || severity === "normal") {
    return (
      <MDTypography variant="caption" color="success" fontWeight="bold">
        Normal
      </MDTypography>
    );
  }

  const color = severity === "critical" ? "error" : "dark";

  return (
    <MDTypography variant="caption" color={color} fontWeight="bold">
      {problem}
    </MDTypography>
  );
}

// Quebra um texto "linha1\nlinha2" em duas partes
function dividir(texto) {
  const partes = String(texto || "").split("\n");
  return [partes[0] || "", partes[1] || ""];
}

// Recebe os dados da API (vindos do index.js) e devolve { columns, rows }
export default function data(dados = []) {
  const devicesData = dados.map((item) => {
    // "Laboratório 212\nirClient-D8BC38A94716" -> local + device
    const [local, device] = dividir(item.dispositivo);

    // "há 718 h\n04/10/2026, 20:10" -> tempo relativo + data
    const [relative, formattedDate] = dividir(item.ultima_comunicacao);

    // "-86 dBm\nPéssimo" -> número -86 (ou null se vier "-")
    const rssiMatch = String(item.rssi || "").match(/-?\d+/);
    const rssi = rssiMatch ? Number(rssiMatch[0]) : null;

    const problema = item.problema || "Normal";

    return {
      status: String(item.status || "desconhecido").toLowerCase(),
      device,
      local,
      relative,
      formattedDate,
      rssi,
      problema,
      severity: problema === "Normal" ? "normal" : "critical",
    };
  });

  return {
    columns: [
      { Header: "Dispositivo", accessor: "device", align: "center" },
      { Header: "Última comunicação", accessor: "lastSeen", align: "center" },
      { Header: "RSSI", accessor: "rssi", align: "center" },
      { Header: "Problema", accessor: "problem", align: "center" },
      { Header: "Status", accessor: "status", align: "center" },
    ],

    rows: devicesData.map((item) => ({
      status: <Status_Dispositivo status={item.status} />,
      device: <Local_Dispositivo device={item.device} local={item.local} />,
      lastSeen: (
        <UltimaComunicacao relative={item.relative} formattedDate={item.formattedDate} />
      ),
      rssi: <RSSI rssi={item.rssi} />,
      problem: <Problema problem={item.problema} severity={item.severity} />,
    })),
  };
}