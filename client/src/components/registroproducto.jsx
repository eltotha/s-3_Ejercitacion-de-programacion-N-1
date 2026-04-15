import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  MenuItem,
  Alert,
} from "@mui/material";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const RegistroProducto = ({ onRegistroExitoso }) => {
  const [form, setForm] = useState({
    codigo_producto: uuidv4(),
    nombre_producto: "",
    cantidad: "",
    tipo_compra: "unidad",
    precio_unitario: "",
    proveedor: "",
    color: "",
    dimensiones: "",
    fecha_Registrarproducto: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    setImageFile(file || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cantidad = Number(form.cantidad);
    const precioUnitario = Number(form.precio_unitario);

    if (isNaN(cantidad) || cantidad < 0) {
      setError("La cantidad debe ser un número mayor o igual a 0.");
      setMensaje("");
      return;
    }

    if (isNaN(precioUnitario) || precioUnitario < 0) {
      setError("El precio unitario debe ser un número mayor o igual a 0.");
      setMensaje("");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:3001/api/registrar-producto",
        {
          codigo_producto: form.codigo_producto || "",
          nombre_producto: form.nombre_producto || "",
          cantidad,
          tipo_compra: form.tipo_compra || "unidad",
          precio_unitario: precioUnitario,
          proveedor: form.proveedor || "",
          color: form.color || "",
          dimensiones: form.dimensiones || "",
          fecha_Registrarproducto: form.fecha_Registrarproducto || "",
          nombre_imagen: imageFile ? imageFile.name : null,
        }
      );

      setMensaje(res.data.message);
      setError("");

      // Limpiar formulario
      setForm({
        codigo_producto: "",
        nombre_producto: "",
        cantidad: "",
        tipo_compra: "unidad",
        precio_unitario: "",
        proveedor: "",
        color: "",
        dimensiones: "",
        fecha_Registrarproducto: "",
      });
      setImageFile(null);

      // Actualizar tabla
      if (onRegistroExitoso) onRegistroExitoso();

    } catch (err) {
      setError(err.response?.data?.error || "Error al registrar");
      setMensaje("");
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        borderRadius: 3,
        bgcolor: "#ffffff",
        boxShadow: 2,
      }}
    >
      <Typography
        variant="h5"
        sx={{
          mb: 3,
          fontWeight: "bold",
          color: "#2c3e50",
          textAlign: "center",
        }}
      >
        📦 Registrar Nuevo Producto
      </Typography>

      {mensaje && <Alert severity="success">{mensaje}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Código"
              name="codigo_producto"
              value={form.codigo_producto}
              disabled
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              label="Nombre del producto"
              name="nombre_producto"
              value={form.nombre_producto}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              required
              type="number"
              label="Cantidad"
              name="cantidad"
              value={form.cantidad}
              onChange={handleChange}
              slotProps={{ input: { min: 0, step: 1 } }}
              helperText="Ingrese la cantidad (ej: 10)"
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              select
              fullWidth
              label="Tipo de compra"
              name="tipo_compra"
              value={form.tipo_compra}
              onChange={handleChange}
            >
              <MenuItem value="unidad">Unidad</MenuItem>
              <MenuItem value="docena">Docena</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              required
              type="number"
              label="Precio unitario"
              name="precio_unitario"
              value={form.precio_unitario}
              onChange={handleChange}
              slotProps={{ input: { min: 0, step: 0.01 } }}
              helperText="Ingrese el precio por unidad (ej: 19.99)"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Proveedor"
              name="proveedor"
              value={form.proveedor}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Color"
              name="color"
              value={form.color}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Dimensiones"
              name="dimensiones"
              value={form.dimensiones}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{ height: "100%", textTransform: "none" }}
            >
              {imageFile ? "Imagen seleccionada: " + imageFile.name : "Seleccionar imagen"}
              <input
                type="file"
                name="nombre_imagen"
                accept="image/*"
                hidden
                onChange={handleFileChange}
              />
            </Button>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="datetime-local"
              label="Fecha"
              name="fecha_Registrarproducto"
              slotProps={{ inputLabel: { shrink: true } }}
              value={form.fecha_Registrarproducto}
              onChange={handleChange}
            />
          </Grid>
        </Grid>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            mt: 3,
            py: 1.5,
            fontSize: "16px",
            fontWeight: "bold",
            bgcolor: "#2ecc71",
            "&:hover": { bgcolor: "#27ae60" },
          }}
        >
          Registrar Producto
        </Button>
      </Box>
    </Paper>
  );
};

export default RegistroProducto;