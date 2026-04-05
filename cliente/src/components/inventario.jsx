import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddBoxIcon from "@mui/icons-material/AddBox";
import RegistroProducto from "./RegistroProducto";
import "../style/inventario.css";

const Inventario = () => {
  const [busqueda, setBusqueda] = useState("");
  const [productos, setProductos] = useState([]);
  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    buscarProductos();
  }, []);

  const buscarProductos = async (termino = "") => {
    try {
      setCargando(true);
      const response = await fetch(
        `http://localhost:3001/api/productos?search=${termino}`
      );
      if (!response.ok) throw new Error("Error al obtener productos");
      const data = await response.json();
      setProductos(data);
      setError("");
    } catch (error) {
      setError(error.message);
      console.error("Error buscando productos:", error);
    } finally {
      setCargando(false);
    }
  };

  const manejarBusqueda = (e) => setBusqueda(e.target.value);

  const manejarSubmitBusqueda = (e) => {
    e.preventDefault();
    buscarProductos(busqueda);
    setBusqueda("");
  };

  const actualizarInventario = () => {
    buscarProductos();
    setMostrarRegistro(false);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: "bold",
            color: "primary.main",
            textAlign: "center",
            textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          🛍 Gestión de Inventario
        </Typography>

        <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
          <Paper
            component="form"
            onSubmit={manejarSubmitBusqueda}
            sx={{ flexGrow: 1 }}
          >
            <TextField
              fullWidth
              variant="outlined"
              label="Buscar productos por nombre o código"
              value={busqueda}
              onChange={manejarBusqueda}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton type="submit" color="primary">
                      <SearchIcon fontSize="large" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Paper>

          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddBoxIcon />}
            onClick={() => setMostrarRegistro(!mostrarRegistro)}
            sx={{ height: 56, px: 4 }}
          >
            {mostrarRegistro ? "Ocultar Registro" : "Nuevo Producto"}
          </Button>
        </Box>

        {error && (
          <Typography color="error" sx={{ textAlign: "center", mb: 2 }}>
            ⚠ {error}
          </Typography>
        )}

        {cargando ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress size={60} />
          </Box>
        ) : (
          <TableContainer
            component={Paper}
            sx={{ maxHeight: "60vh", boxShadow: 3 }}
          >
            <Table stickyHeader aria-label="tabla de inventario">
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{ fontWeight: "bold", bgcolor: "background.paper" }}
                  >
                    Código
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: "bold", bgcolor: "background.paper" }}
                  >
                    Nombre
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: "bold", bgcolor: "background.paper" }}
                  >
                    Cantidad
                  </TableCell>

                  <TableCell
                    sx={{ fontWeight: "bold", bgcolor: "background.paper" }}
                  >
                    Tipo Compra
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: "bold", bgcolor: "background.paper" }}
                  >
                    P. Unitario
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: "bold", bgcolor: "background.paper" }}
                  >
                    P. Total
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: "bold", bgcolor: "background.paper" }}
                  >
                    Proveedor
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: "bold", bgcolor: "background.paper" }}
                  >
                    Color
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: "bold", bgcolor: "background.paper" }}
                  >
                    Dimensiones
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {productos.map((producto) => (
                  <TableRow
                    key={producto.id}
                    hover
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>{producto.codigo_producto}</TableCell>
                    <TableCell sx={{ maxWidth: 300 }}>
                      {producto.nombre_producto}
                    </TableCell>
                    <TableCell>{producto.cantidad}</TableCell>
                    <TableCell>{producto.tipo_compra}</TableCell>
                    <TableCell>
                      ${parseFloat(producto.precio_unitario).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      ${parseFloat(producto.precio_total).toFixed(2)}
                    </TableCell>

                    <TableCell>{producto.proveedor}</TableCell>
                    <TableCell>{producto.color}</TableCell>
                    <TableCell>{producto.dimensiones}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
      {mostrarRegistro && (
        <Box
          sx={{ mt: 6, borderTop: "2px solid", borderColor: "divider", pt: 4 }}
        >
          <RegistroProducto onRegistroExitoso={actualizarInventario} />
        </Box>
      )}
    </Container>
  );
};
export default Inventario;
