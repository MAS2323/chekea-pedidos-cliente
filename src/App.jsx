import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Menu from "./pages/Menu";
import ActualizarPedidos from "./components/ActualizarPedidos";
import { WebViewDataProvider } from "./ContexApi";
import TodosPedidos from "./pages/TodosPedidos";
import PedidoDetalle from "./components/PedidoDetalle";

function App() {
  return (
    <WebViewDataProvider>
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/pedidos" element={<TodosPedidos />} />
        <Route path="/pedido-detalle/:id" element={<PedidoDetalle />} />
        <Route path="/actualizar-pedido/:id" element={<ActualizarPedidos />} />
      </Routes>
    </WebViewDataProvider>
  );
}

export default App;
