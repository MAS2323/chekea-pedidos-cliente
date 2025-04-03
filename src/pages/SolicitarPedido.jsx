import React, { useRef, useState, useCallback } from "react";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import { useWebViewData } from "../ContexApi";
import { API_URL } from "../../config/configApi";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

function SolicitarPedido() {
  const { webViewData } = useWebViewData();
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [time, setTime] = useState("");
  const [phone, setPhone] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const id = useRef(localStorage.getItem("userId"));

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
      if (!description || !quantity || !time || !phone || images.length === 0) {
        alert("Por favor, completa todos los campos.");
        return;
      }
      setLoading(true);
      const formData = new FormData();
      formData.append("description", description);
      formData.append("id", webViewData?.id);
      formData.append("quantity", quantity);
      formData.append("time", time);
      formData.append("phone", phone);
      images.forEach((img) => formData.append("images", img));
      try {
        await axios.post(`${API_URL}/pedidos`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Pedido solicitado correctamente.");
        setDescription("");
        setQuantity("");
        setTime("");
        setPhone("");
        setImages([]);
      } catch (error) {
        console.error("Error al enviar la solicitud:", error);
        alert("Hubo un error al enviar el pedido.");
      } finally {
        setLoading(false);
      }
    },
    [description, quantity, time, phone, images]
  );

  return (
    <div style={styles.container}>
      {errorMessage && <p style={styles.errorText}>{errorMessage}</p>}
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
        <div style={styles.phoneInputContainer}>
          <PhoneInput
            country={"us"}
            value={phone}
            onChange={(value) => setPhone(value)}
            inputStyle={styles.phoneInput}
            buttonStyle={styles.dropdownButton}
            dropdownStyle={styles.dropdownStyle}
            containerStyle={styles.phoneContainer}
            placeholder="Número de teléfono / Whatsapp"
            enableSearch
            searchPlaceholder="Buscar país"
          />
        </div>
        <div style={styles.imageGrid}>
          {images.map((image, index) => (
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
          ))}
        </div>
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
        {loading ? (
          <CircularProgress />
        ) : (
          <button type="submit" style={styles.submitButton} disabled={loading}>
            Enviar Solicitud
          </button>
        )}
      </form>
    </div>
  );
}

const styles = {
  container: {
    width: "90vw",
    maxWidth: "500px",
    margin: "0 auto",
    padding: "20px",
    textAlign: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },
  form: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "15px",
  },
  input: {
    width: "100%",
    padding: "12px 15px",
    margin: "5px 0",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "16px",
    backgroundColor: "#fff",
    boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.1)",
    transition: "border 0.3s ease",
  },
  phoneInputContainer: {
    width: "100%",
    margin: "5px 0",
  },
  phoneContainer: {
    width: "100%",
  },
  phoneInput: {
    width: "100%",
    height: "auto",
    padding: "12px 15px 12px 60px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "16px",
    backgroundColor: "#fff",
    boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.1)",
    transition: "border 0.3s ease",
  },
  dropdownButton: {
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "8px 0 0 8px",
    padding: "0 10px",
    height: "100%",
  },
  dropdownStyle: {
    borderRadius: "8px",
    marginTop: "5px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },
  fileInput: {
    display: "none",
  },
  imageLabel: {
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100px",
    height: "100px",
    borderRadius: "8px",
    backgroundColor: "#f0f0f0",
    border: "2px dashed #ccc",
    overflow: "hidden",
    position: "relative",
    transition: "all 0.3s ease",
    "&:hover": {
      borderColor: "#4CAF50",
      backgroundColor: "#e8f5e9",
    },
  },
  avatarPlaceholder: {
    fontSize: "36px",
    color: "#aaa",
    fontWeight: "bold",
  },
  imageGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    justifyContent: "center",
    margin: "10px 0",
  },
  imageContainer: {
    position: "relative",
    display: "inline-block",
  },
  imagePreview: {
    width: "80px",
    height: "80px",
    objectFit: "cover",
    borderRadius: "8px",
    border: "2px solid #ddd",
  },
  deleteButton: {
    position: "absolute",
    top: "-5px",
    right: "-5px",
    background: "#ff4444",
    color: "white",
    border: "none",
    borderRadius: "50%",
    width: "20px",
    height: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "10px",
    cursor: "pointer",
    padding: 0,
  },
  submitButton: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: "1px",
    transition: "background-color 0.3s ease",
    "&:hover": {
      backgroundColor: "#388E3C",
    },
    "&:disabled": {
      backgroundColor: "#a5d6a7",
      cursor: "not-allowed",
    },
  },
  errorText: {
    fontSize: "14px",
    color: "#ff4444",
    fontWeight: "bold",
    marginBottom: "10px",
    textAlign: "center",
  },
};

export default SolicitarPedido;
