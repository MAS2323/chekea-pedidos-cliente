import React, { useRef, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import { useWebViewData } from "../ContexApi";
import { API_URL } from "../../config/configApi";

function SolicitarPedido() {
  const { webViewData } = useWebViewData(); // Get context values

  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [time, setTime] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const id = useRef(localStorage.getItem("userId")); // Evitar re-renders innecesarios

  console.log(webViewData);
  const handleImagenChange = useCallback(
    (e) => {
      const files = Array.from(e.target.files);
      if (images.length + files.length > 5) {
        setErrorMessage("Solo puedes subir un máximo de 5 imágenes.");
        return;
      }
      setImages((prevImages) => [...prevImages, ...files]);
      setErrorMessage("");
    },
    [images]
  );

  const eliminarImagen = useCallback((index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  }, []);

  const enviarSolicitud = useCallback(
    async (e) => {
      e.preventDefault();
      if (!description || !quantity || !time || images.length === 0) {
        alert("Por favor, completa todos los campos.");
        return;
      }
      setLoading(true);
      const formData = new FormData();
      formData.append("description", description);
      formData.append("id", webViewData?.id);
      formData.append("quantity", quantity);
      formData.append("time", time);
      images.forEach((img) => formData.append("images", img));
      try {
        await axios.post(`${API_URL}/pedidos`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Pedido solicitado correctamente.");
        setDescription("");
        setQuantity("");
        setTime("");
        setImages([]);
      } catch (error) {
        console.error("Error al enviar la solicitud:", error);
        alert("Hubo un error al enviar el pedido.");
      } finally {
        setLoading(false);
      }
    },
    [description, quantity, time, images]
  );

  const previewImages = useMemo(
    () =>
      images.map((image, index) => (
        <div key={index} style={styles.imageContainer}>
          <img
            src={URL.createObjectURL(image)}
            alt={`Imagen ${index + 1}`}
            style={styles.imagePreview}
          />
          <button
            type="button"
            onClick={() => eliminarImagen(index)}
            style={styles.deleteButton}
          >
            ❌
          </button>
        </div>
      )),
    [images, eliminarImagen]
  );

  const submitButton = useMemo(
    () =>
      loading ? (
        <CircularProgress />
      ) : (
        <button type="submit" style={styles.submitButton} disabled={loading}>
          Enviar Solicitud
        </button>
      ),
    [loading]
  );

  return (
    <div style={styles.container}>
      {errorMessage && <p style={styles.errorText}>{errorMessage}</p>}
      <h1>{webViewData ? webViewData.id : "No hay"}</h1>
      <h1>{webViewData?.notificacion ? "true" : "false"}</h1>
      <form onSubmit={enviarSolicitud} style={styles.form}>
        <textarea
          placeholder="Descripción del Pedido"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          style={styles.input}
        ></textarea>
        <input
          type="text"
          placeholder="Cantidad"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Tiempo Estimado (días)"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
          style={styles.input}
        />
        <div style={styles.imageGrid}>{previewImages}</div>
        <label style={styles.imageLabel}>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImagenChange}
            style={styles.fileInput}
          />
          <div style={styles.avatarPlaceholder}>+</div>
        </label>
        {submitButton}
      </form>
    </div>
  );
}
const styles = {
  container: {
    width: "90vw",
    textAlign: "center",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "15px",
  },
  form: {
    width: "80vw",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "8px 0",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  fileInput: {
    display: "none",
  },
  imageLabel: {
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    backgroundColor: "#f0f0f0",
    border: "2px dashed #ccc",
    marginBottom: "10px",
    overflow: "hidden",
    position: "relative",
  },
  avatarPlaceholder: {
    fontSize: "40px",
    color: "#aaa",
    fontWeight: "bold",
  },
  imageGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    justifyContent: "center",
    marginBottom: "10px",
  },
  imageContainer: {
    position: "relative",
    display: "inline-block",
  },
  imagePreview: {
    width: "80px",
    height: "80px",
    objectFit: "cover",
    borderRadius: "50%",
    border: "2px solid #ccc",
  },
  deleteButton: {
    position: "absolute",
    top: "-8px",
    right: "-8px",
    background: "rgba(255, 255, 255, 0.8)",
    color: "white",
    border: "none",
    borderRadius: "50%",
    width: "24px",
    height: "24px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  submitButton: {
    marginTop: "10px",
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
  loadingText: {
    fontSize: "16px",
    color: "#ff6600",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  errorText: {
    fontSize: "14px",
    color: "red",
    fontWeight: "bold",
    marginBottom: "10px",
  },
};

export default SolicitarPedido;
