import React, { useState, useEffect, useCallback, memo } from "react";
import { CircularProgress } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useWebViewData } from "../ContexApi";
import { API_URL } from "../../config/configApi";

function MisPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { webViewData } = useWebViewData();

  const fetchPedidos = useCallback(async () => {
    setLoading(true);
    try {
      const storedPedidos = localStorage.getItem("pedidos");
      if (storedPedidos) {
        setPedidos(JSON.parse(storedPedidos));
        setLoading(false);
      }

      const response = await axios.get(`${API_URL}/pedidos/${webViewData.id}`);
      setPedidos(response.data);
      localStorage.setItem("pedidos", JSON.stringify(response.data));
    } catch (err) {
      console.error("Error al obtener los pedidos:", err);
      setError("Hubo un problema al cargar los pedidos. Inténtalo más tarde.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPedidos();
  }, [fetchPedidos]);

  const handleEliminar = async (id) => {
    try {
      await axios.delete(`${API_URL}/pedidos/${id}`);
      setPedidos((prevPedidos) =>
        prevPedidos.filter((pedido) => pedido._id !== id)
      );
      localStorage.removeItem(`pedido_${id}`);
      alert("Pedido eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar el pedido:", error);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <p style={styles.error}>{error}</p>;
  }

  return (
    <div style={styles.container}>
      {pedidos.length === 0 ? (
        <p style={styles.noPedidos}>No tienes Pedidos.</p>
      ) : (
        <div style={styles.scrollContainer}>
          {pedidos.map((pedido) => (
            <PedidoCard
              key={pedido._id}
              pedido={pedido}
              handleEliminar={handleEliminar}
              navigate={navigate}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const PedidoCard = memo(({ pedido, handleEliminar, navigate }) => {
  const getFirstImage = (images) => {
    if (!images || images.length === 0) {
      return "../assets/img/placeholderImage.png";
    }
    return images[0].url;
  };

  return (
    <div style={styles.card}>
      <img
        src={getFirstImage(pedido.image)}
        alt="Pedido"
        onError={(e) => {
          e.target.src = "../assets/img/placeholderImage.png";
        }}
        style={styles.image}
      />
      <div
        style={styles.details}
        onClick={() => navigate(`/actualizar-pedido/${pedido._id}`)}
      >
        <h3 style={styles.description}>{pedido.description}</h3>
        <p style={styles.info}>⏳Tiempo: {pedido.time}</p>
        <p style={styles.info}>📦Cantidad: {pedido.quantity}</p>
      </div>
      <p style={styles.status}>🔹Estado: {pedido.status}</p>
      <button
        style={styles.deleteButton}
        onClick={(e) => {
          e.stopPropagation(); // Evita la navegación al hacer clic en el botón
          handleEliminar(pedido._id);
        }}
      >
        Eliminar Pedido
      </button>
    </div>
  );
});

const styles = {
  container: {
    width: "90%",
    maxWidth: "600px",
    textAlign: "center",
  },
  error: {
    fontSize: "18px",
    color: "#e74c3c",
  },
  noPedidos: {
    fontSize: "18px",
    color: "#888",
  },
  scrollContainer: {
    maxHeight: "400px",
    overflowY: "auto",
    padding: "10px",
    borderRadius: "10px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    background: "#fff",
  },
  card: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    padding: "15px",
    marginBottom: "10px",
    borderRadius: "10px",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
    background: "#f9f9f9",
    cursor: "pointer",
    transition: "transform 0.2s ease-in-out",
  },
  image: {
    width: "80px",
    height: "80px",
    borderRadius: "10px",
    objectFit: "cover",
  },
  details: {
    flex: 1,
    textAlign: "left",
  },
  description: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "5px",
    color: "#333",
  },
  info: {
    fontSize: "14px",
    color: "#555",
  },
  status: {
    fontSize: "14px",
    color: "#007bff",
    fontWeight: "bold",
  },
  deleteButton: {
    padding: "10px",
    backgroundColor: "#ff4d4d",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
};

export default MisPedidos;
