import React, { useState, useEffect, useCallback, memo } from "react";
import { CircularProgress } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useWebViewData } from "../ContexApi";

const API_URL = "http://localhost:3000";

function MisPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { webViewData } = useWebViewData(); // valores

  const fetchPedidos = useCallback(async () => {
    const storedPedidos = localStorage.getItem("pedidos");
    if (storedPedidos) {
      setPedidos(JSON.parse(storedPedidos));
      setLoading(false);
    } else {
      try {
        const response = await axios.get(`${API_URL}/pedidos/user`);
        setPedidos(response.data);
        localStorage.setItem("pedidos", JSON.stringify(response.data));
      } catch (err) {
        console.error("Error al obtener los pedidos:", err);
        setError(
          "Hubo un problema al cargar los pedidos. Inténtalo más tarde."
        );
      } finally {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchPedidos();
  }, [fetchPedidos]);
  // Manejar la eliminación del pedido
  const handleEliminar = async () => {
    setisSubir(true);

    try {
      await axios.delete(`${API_URL}/pedidos/${id}`);
      alert("Pedido eliminado correctamente");
      navigate("/");
    } catch (error) {
      console.error("Error al eliminar el pedido:", error);
    } finally {
      setisSubir(false);
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
            <PedidoCard key={pedido._id} pedido={pedido} navigate={navigate} />
          ))}
        </div>
      )}
    </div>
  );
}

// Mini component for the pedido card
const PedidoCard = memo(({ pedido, navigate }) => {
  const getFirstImage = (images) => {
    if (!images || images.length === 0) {
      return "../assets/img/placeholderImage.png";
    }
    return images[0].url;
  };

  return (
    <div
      style={styles.card}
      onClick={() => navigate(`/actualizar-pedido/${pedido._id}`)}
    >
      {/* Mostrar la primera imagen del pedido */}
      <img
        src={getFirstImage(pedido.image)}
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
      <div>
        <button
          style={styles.deleteButton}
          onClick={() => {
            localStorage.clear(`pedido_${id}`);
            handleEliminar();
          }}
        >
          Eliminar Pedido
        </button>
      </div>
    </div>
  );
});

const styles = {
  container: {
    width: "90%",
    maxWidth: "600px",
    textAlign: "center",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "10px",
    color: "#333",
  },
  loading: {
    fontSize: "18px",
    color: "#555",
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
  cardHover: {
    transform: "scale(1.02)",
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
  deleteButton: {
    flex: 1,
    padding: "10px",
    marginLeft: "5px",
    backgroundColor: "#ff4d4d",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
};

export default MisPedidos;
