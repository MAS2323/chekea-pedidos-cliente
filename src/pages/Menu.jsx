import React, { useState, useEffect } from "react";
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Box,
  Container,
} from "@mui/material";
import RequestPageIcon from "@mui/icons-material/RequestPage";
import ListAltIcon from "@mui/icons-material/ListAlt";
import SolicitarPedido from "./SolicitarPedido";
import { CircularProgress } from "@mui/material";
import MisPedidos from "./MisPedidos";
import "../App.css";
import { useWebViewData } from "../ContexApi";
function Menu() {
  const { webViewData } = useWebViewData(); // acceso a los datos
  const [vista, setVista] = useState(
    () => localStorage.getItem("vista") || "solicitar"
  );

  useEffect(() => {
    localStorage.setItem("vista", vista);
  }, [vista]); // Added webViewData in the dependency to ensure sync
  // if (!webViewData?.id) {
  //   return (
  //     <Box
  //       sx={{
  //         display: "flex",
  //         justifyContent: "center",
  //         alignItems: "center",
  //         height: "100vh",
  //       }}
  //     >
  //       <CircularProgress />
  //     </Box>
  //   );
  // }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      {/* Contenedor desplazable */}
      <Container
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: { xs: 2, md: 4 },
          maxWidth: "900px",
          overflow: "auto", // Permite el desplazamiento interno
          maxHeight: "calc(100vh - 60px)", // Resta la altura de la barra de navegación
        }}
      >
        {vista === "solicitar" ? <SolicitarPedido /> : <MisPedidos />}
      </Container>

      {/* Barra de Navegación Inferior */}
      <Paper
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "white",
          borderTop: "1px solid #ddd",
        }}
        elevation={3}
      >
        <BottomNavigation
          value={vista}
          onChange={(event, newValue) => setVista(newValue)}
          showLabels
          sx={{
            height: 60,
            "& .MuiBottomNavigationAction-root": {
              color: "#666",
              "&.Mui-selected": {
                color: "#1976d2",
              },
            },
          }}
        >
          <BottomNavigationAction
            label="Solicitar"
            value="solicitar"
            icon={<RequestPageIcon fontSize="medium" />}
          />
          <BottomNavigationAction
            label="Mis Pedidos"
            value="mis-pedidos"
            icon={<ListAltIcon fontSize="medium" />}
          />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}

export default Menu;
