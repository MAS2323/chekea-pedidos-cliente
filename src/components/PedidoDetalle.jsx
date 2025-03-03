import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  CircularProgress,
  Modal,
  Box,
  Select,
  MenuItem,
  Snackbar,
} from "@mui/material";
import { API_URL } from "../../config/configApi";

function PedidoDetalle() {
  const { id } = useParams();
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [status, setStatus] = useState("Pendiente");
  const [updateError, setUpdateError] = useState(null); // Nuevo estado para el error de actualización

  useEffect(() => {
    const fetchPedido = async () => {
      try {
        const response = await axios.get(`${API_URL}/pedido/${id}`);
        console.log("Pedido recibido:", response.data);
        setPedido(response.data);
        setStatus(response.data.status || "Pendiente");
      } catch (err) {
        console.error("Error al cargar el pedido:", err);
        setError("Hubo un problema al cargar los detalles del pedido.");
      } finally {
        setLoading(false);
      }
    };
    fetchPedido();
  }, [id]);

  const handleStatusChange = async (event) => {
    const newStatus = event.target.value;
    setStatus(newStatus);
    console.log("Enviando status:", newStatus); // Verifica el valor de status

    try {
      const response = await axios.patch(`${API_URL}/pedidos/${id}/status`, {
        status: newStatus,
      });
      console.log("Respuesta del servidor:", response);
      console.log("Respuesta del servidor:", response.data); // Verifica la respuesta
      setPedido((prevPedido) => ({ ...prevPedido, status: newStatus }));
      window.dispatchEvent(new Event("pedidoActualizado"));
      setUpdateError(null); // Limpiar el error si la actualización es exitosa
    } catch (err) {
      console.error("Error al actualizar el estado:", err);
      setUpdateError(
        "No se pudo actualizar el estado del pedido. Intente nuevamente."
      );
    }
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedImage("");
  };

  if (loading) {
    return <CircularProgress style={styles.loading} />;
  }

  if (error) {
    return <p style={styles.error}>{error}</p>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Detalles del Pedido</h1>
      {pedido ? (
        <div style={styles.details}>
          <p style={styles.info}>
            <strong>Descripción:</strong>{" "}
            {pedido.description || "No disponible"}
          </p>
          <p style={styles.info}>
            <strong>Tiempo:</strong> {pedido.time || "No disponible"}
          </p>
          <p style={styles.info}>
            <strong>Cantidad:</strong> {pedido.quantity || "No disponible"}
          </p>
          <p style={styles.info}>
            <strong>Estado:</strong>
          </p>
          <Select value={status} onChange={handleStatusChange}>
            <MenuItem value="Pendiente">Pendiente</MenuItem>
            <MenuItem value="Procesando">Procesando</MenuItem>
            <MenuItem value="Enviado">Enviado</MenuItem>
            <MenuItem value="Entregado">Entregado</MenuItem>
          </Select>

          {updateError && (
            <Snackbar
              open={true}
              message={updateError}
              autoHideDuration={6000}
              onClose={() => setUpdateError(null)}
            />
          )}

          {pedido.image && pedido.image.length > 0 && (
            <div style={styles.imageContainer}>
              {pedido.image.map((img, index) => (
                <div key={index} style={styles.imageWrapper}>
                  <img
                    src={img?.url || "../assets/img/placeholderImage.png"}
                    alt={`Pedido ${index}`}
                    style={styles.image}
                    onClick={() => handleImageClick(img?.url)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <p style={styles.noPedido}>Pedido no encontrado.</p>
      )}

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box style={styles.modalBox}>
          <img
            src={selectedImage}
            alt="Imagen ampliada"
            style={styles.modalImage}
          />
        </Box>
      </Modal>
    </div>
  );
}

const styles = {
  container: {
    width: "90%",
    maxWidth: "800px",
    margin: "auto",
    padding: "20px",
    textAlign: "center",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#333",
  },
  details: {
    textAlign: "left",
  },
  info: {
    fontSize: "18px",
    color: "#555",
    marginBottom: "10px",
  },
  imageContainer: {
    marginTop: "20px",
    textAlign: "center",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  imageWrapper: {
    margin: "10px",
  },
  image: {
    width: "150px",
    height: "150px",
    objectFit: "cover",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "transform 0.3s ease",
  },
  loading: {
    display: "block",
    margin: "auto",
  },
  error: {
    fontSize: "18px",
    color: "#e74c3c",
  },
  noPedido: {
    fontSize: "18px",
    color: "#888",
  },
  modalBox: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
  },
  modalImage: {
    width: "100%",
    height: "auto",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

export default PedidoDetalle;
