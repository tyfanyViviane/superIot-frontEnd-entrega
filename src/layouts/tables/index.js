import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
 
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
 
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
 
import dispositivosTableData from "layouts/tables/data/authorsTableData";
 
function ContadorDispositivo() {
  const [contador, setContador] = useState(0);
 
  return (
    <MDBox display="flex" alignItems="center" justifyContent="center" gap={1}>
      <MDButton
        variant="gradient"
        color="error"
        size="small"
        onClick={() => setContador((prev) => prev - 1)}
      >
        -
      </MDButton>
      <MDTypography variant="button" fontWeight="bold">
        {contador}
      </MDTypography>
      <MDButton
        variant="gradient"
        color="success"
        size="small"
        onClick={() => setContador((prev) => prev + 1)}
      >
        +
      </MDButton>
    </MDBox>
  );
}
 
function Tables() {
  const [dados, setDados] = useState([]);
 
  useEffect(() => {
    fetch("http://localhost:5000/dispositivos")
      .then((res) => {
        if (!res.ok) throw new Error(`Erro na requisição: ${res.status}`);
        return res.json();
      })
      .then((json) => {
        // Aceita caso o backend retorne [ {...} ] ou { dados: [ {...} ] }
        const listaBruta = Array.isArray(json) ? json : json.dados || [];
 
        // Mantém todos os campos que a API enviar (dispositivo, rssi, status, etc.)
        setDados(listaBruta);
      })
      .catch((error) => console.error("Erro ao carregar API:", error));
  }, []);
 
  // Passa o estado manipulado para gerar colunas e linhas
 const { columns, rows } = dispositivosTableData(dados);
 
  // Adiciona a coluna do contador às colunas existentes
  const colunasComContador = [
    ...columns,
    { Header: "Contador", accessor: "contador", align: "center" },
  ];
 
  // Injeta o componente interativo em cada linha da tabela
  const linhasComContador = rows.map((linha) => ({
    ...linha,
    contador: <ContadorDispositivo />,
  }));
 
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Tabela de Dispositivos IoT
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns: colunasComContador, rows: linhasComContador }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}
 
export default Tables;