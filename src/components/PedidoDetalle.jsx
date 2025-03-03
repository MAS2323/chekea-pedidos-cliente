import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import { API_URL } from "../../config/configApi";

function PedidoDetalle() {
  const { id } = useParams(); // Obtener el ID del pedido desde la URL
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Verificar si el pedido ya está en localStorage
    const storedPedido = JSON.parse(localStorage.getItem(`pedido_${id}`));
    if (storedPedido) {
      setPedido(storedPedido);
      setLoading(false);
    } else {
      // Fetch del detalle del pedido desde la API
      const fetchPedido = async () => {
        try {
          const response = await axios.get(`${API_URL}/pedidos/${id}`);
          setPedido(response.data);
          // Guardar el detalle del pedido en localStorage
          localStorage.setItem(`pedido_${id}`, JSON.stringify(response.data));
        } catch (err) {
          setError("Hubo un problema al cargar los detalles del pedido.");
        } finally {
          setLoading(false);
        }
      };

      fetchPedido();
    }
  }, [id]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Detalles del Pedido</h1>
      {pedido ? (
        <div>
          <p>
            <strong>Descripción:</strong> {pedido.description}
          </p>
          <p>
            <strong>Tiempo:</strong> {pedido.time}
          </p>
          <p>
            <strong>Cantidad:</strong> {pedido.quantity}
          </p>
          {/* Aquí puedes agregar más detalles según el pedido */}
        </div>
      ) : (
        <p>Pedido no encontrado.</p>
      )}
    </div>
  );
}

export default PedidoDetalle;
