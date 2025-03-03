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
    const storedPedidos = JSON.parse(localStorage.getItem("pedidos"));
    if (storedPedidos) {
      setPedidos(storedPedidos);
      setLoading(false);
    } else {
      const fetchPedidos = async () => {
        try {
          const response = await axios.get(`${API_URL}/pedidos`);
          setPedidos(response.data);
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
    navigate(`/pedido-detalle/${pedidoId}`);
  };

  if (loading) {
    return <CircularProgress style={styles.loading} />;
  }

  if (error) {
    return <p style={styles.error}>{error}</p>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Todos los Pedidos</h1>
      {pedidos.length === 0 ? (
        <p style={styles.noPedidos}>No tienes pedidos.</p>
      ) : (
        <div style={styles.scrollContainer}>
          {pedidos.map((pedido) => (
            <div
              key={pedido._id}
              style={styles.card}
              onClick={() => handlePedidoClick(pedido._id)}
            >
              <img
                src={
                  pedido.image?.[0]?.url || "../assets/img/placeholderImage.png"
                }
                alt="Pedido"
                onError={(e) => {
                  e.target.src = "../assets/img/placeholderImage.png";
                }}
                style={styles.image}
              />
              <div style={styles.details}>
                <h3 style={styles.description}>{pedido.description}</h3>
                <p style={styles.info}>⏳ Tiempo: {pedido.time}</p>
                <p style={styles.info}>📦 Cantidad: {pedido.quantity}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    width: "90%",
    maxWidth: "600px",
    textAlign: "center",
    margin: "auto",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#333",
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
  loading: {
    display: "block",
    margin: "auto",
  },
};

export default TodosPedidos;
