import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Menu from "./pages/Menu";
import ActualizarPedidos from "./components/ActualizarPedidos";
import { WebViewDataProvider } from "./ContexApi";

function App() {
  return (
    <WebViewDataProvider>
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/actualizar-pedido/:id" element={<ActualizarPedidos />} />
      </Routes>
    </WebViewDataProvider>
  );
}

export default App;
