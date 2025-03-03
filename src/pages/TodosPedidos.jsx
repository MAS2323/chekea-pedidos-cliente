import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { API_URL } from "../../config/configApi";

function TodosPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si los pedidos ya están en localStorage
    const storedPedidos = JSON.parse(localStorage.getItem("pedidos"));
    if (storedPedidos) {
      setPedidos(storedPedidos);
      setLoading(false);
    } else {
      // Fetch de todos los pedidos desde la API si no están en localStorage
      const fetchPedidos = async () => {
        try {
          const response = await axios.get(`${API_URL}/pedidos`);
          setPedidos(response.data);
          // Guardar los pedidos en localStorage
          localStorage.setItem("pedidos", JSON.stringify(response.data));
        } catch (err) {
          setError("Hubo un problema al cargar los pedidos.");
        } finally {
          setLoading(false);
        }
      };
      fetchPedidos();
    }
  }, []);

  const handlePedidoClick = (pedidoId) => {
    navigate(`/pedido-detalle/${pedidoId}`); // Navegar a la página de detalles
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Todos los Pedidos</h1>
      {pedidos.length === 0 ? (
        <p>No tienes pedidos.</p>
      ) : (
        <ul>
          {pedidos.map((pedido) => (
            <li key={pedido._id} onClick={() => handlePedidoClick(pedido._id)}>
              {pedido.description} - {pedido.time}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TodosPedidos;
