const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const app = express();
const PORT = 3001;

// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123qwe", // Cambia por la contraseña de tu base de datos
  port: "3306", // Cambia según tu configuración
  database: "empresasublimacion_bordados", // Asegúrate de que este sea el nombre correcto
});

// Conectar a la base de datos
db.connect((err) => {
  if (err) {
    console.error("Error al conectar a la base de datos:", err);
    return;
  }
  
  console.log("Conexión exitosa a la base de datos");
});

// Middleware
app.use(cors());
app.use(express.json());

// Ruta para el inicio de sesión 
app.post("/api/login", (req, res) => {
  const { nombre_usuario, contrasena } = req.body;

  if (!nombre_usuario || !contrasena) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  const SQL_QUERY = `
    SELECT * FROM usuarios_login
    WHERE nombre_usuario = ? AND contrasena = ?
  `;

  db.query(SQL_QUERY, [nombre_usuario, contrasena], (err, result) => {
    if (err) {
      console.error("Error al consultar el usuario:", err);
      return res.status(500).json({ error: "Error en el servidor" });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: "Usuario o contraseña incorrectos" });
    }

    res.status(200).json({
      message: "Inicio de sesión exitoso",
      usuario: result[0],
    });
  });
});

// Ruta para registrar cliente
app.post("/api/registrar-cliente", (req, res) => {
  const { nombre, apellido, telefono } = req.body;

  if (!nombre || !apellido || !telefono) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  const SQL_INSERT = `
    INSERT INTO clientes (nombre, apellido, telefono) VALUES (?, ?, ?)
  `;

  db.query(SQL_INSERT, [nombre, apellido, telefono], (err, result) => {
    if (err) {
      console.error("Error al insertar el cliente:", err);
      return res.status(500).json({ error: "Error al guardar el cliente" });
    }

    res.status(201).json({
      message: "Cliente registrado exitosamente",
      id: result.insertId, // Clave cambiada a 'id'
    });
  });
});

app.get("/api/clientes", (req, res) => {
  const query = "SELECT * FROM clientes";

  db.query(query, (err, result) => {
    if (err) {
      console.log("Entró al bloque de error"); // Agrega este log temporalmente
      console.error("Error al recuperar los clientes:", err); // Cambiado "error" por "err"
      return res.status(500).json({ error: "Error al recuperar los clientes" });
    }

    console.log("Consulta realizada correctamente"); // Log temporal
    res.status(200).json(result);
  });
});

// Ruta para obtener productos del inventario con búsqueda opcional
app.get("/api/productos", (req, res) => {
  const search = req.query.search ? `%${req.query.search}%` : "%";

  const SQL_QUERY = `
    SELECT * FROM Registrarproducto
    WHERE nombre_producto LIKE ? OR codigo_producto LIKE ?
  `;

  db.query(SQL_QUERY, [search, search], (err, result) => {
    if (err) {
      console.error("Error al obtener los productos:", err);
      return res
        .status(500)
        .json({ error: "Error al recuperar los productos" });
    }

    res.status(200).json(result);
  });
});

// Agregar después de la ruta de registrar-producto
app.post("/api/registrar-factura", (req, res) => {
  const {
    id_cliente,
    id_producto,
    cantidad,
    precio_unitario,
    anticipo,
    fecha_pedido,
    fecha_entrega,
  } = req.body;

  const precio_total = cantidad * precio_unitario;
  const saldo = precio_total - anticipo;

  const SQL_INSERT = `
    INSERT INTO facturas ( id_cliente, id_producto, cantidad,
      precio_unitario, precio_total, anticipo,
      saldo,
      fecha_pedido, fecha_entrega
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    SQL_INSERT,
    [
      id_cliente,
      id_producto,
      cantidad,
      precio_unitario,
      precio_total,

      anticipo,
      saldo,
      fecha_pedido,
      fecha_entrega,
    ],
    (err, result) => {
      if (err) {
        console.error("Error al registrar factura:", err);
        return res.status(500).json({ error: "Error al guardar la factura" });
      }

      res.status(201).json({
        message: "Factura registrada exitosamente",
        facturaId: result.insertId,
      });
    }
  );
});

//REGISTRAR PRODUCTO
app.post("/api/registrar-producto", (req, res) => {
  const {
    codigo_producto,
    nombre_producto,
    cantidad,

    tipo_compra,
    precio_unitario,
    proveedor,
    color,
    dimensiones,
    fecha_Registrarproducto,
  } = req.body;

  if (!nombre_producto || !cantidad || !tipo_compra || !precio_unitario) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  // Convertir a unidades aquí
  const cantidadEnUnidades =
    tipo_compra === "docena" ? cantidad * 12 : cantidad;

  const precio_total = precio_unitario * cantidadEnUnidades;

  const fecha_registro =
    fecha_Registrarproducto ||
    new Date().toISOString().slice(0, 19).replace("T", " ");

  const SQL_INSERT = `
    INSERT INTO Registrarproducto (
      codigo_producto, nombre_producto,
      cantidad, tipo_compra,
      precio_unitario, precio_total, proveedor,
      fecha_Registrarproducto, color,
      dimensiones
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    SQL_INSERT,
    [
      codigo_producto || null,
      nombre_producto,
      cantidadEnUnidades, // Guardamos en unidades tipo_compra,
      precio_unitario,
      precio_total,
      proveedor || null,
      fecha_registro,
      color || null,
      dimensiones || null,
    ],
    (err, result) => {
      if (err) {
        console.error("Error al insertar el producto:", err);
        return res
          .status(500)
          .json({ error: "Error al registrar el producto" });
      }
      res.status(201).json({
        message: "Producto registrado exitosamente",
        productoId: result.insertId,
      });
    }
  );
});

app.get("/api/facturas", (req, res) => {
  const SQL_QUERY = `
    SELECT
      f.id AS factura_id, f.id_cliente, f.id_producto,
      f.cantidad,
      f.precio_unitario, f.precio_total, f.anticipo, f.saldo,
      f.fecha_pedido, f.fecha_entrega,
      c.nombre AS cliente_nombre, c.apellido AS cliente_apellido, c.telefono AS cliente_telefono,
      p.nombre_producto, p.color, p.dimensiones
    FROM facturas f
    LEFT JOIN clientes c ON f.id_cliente = c.id_cliente
    LEFT JOIN Registrarproducto p ON f.id_producto = p.id ORDER BY f.fecha_pedido DESC
  `;

  db.query(SQL_QUERY, (err, results) => {
    if (err) {
      console.error("Error al obtener facturas:", err);
      return res
        .status(500)
        .json({ error: "Error al obtener el historial de facturas" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "No hay facturas registradas" });
    }

    const formattedResults = results.map((factura) => ({
      id: factura.factura_id,
      cliente: {
        id: factura.id_cliente,
        nombre: factura.cliente_nombre || "N/A",
        apellido: factura.cliente_apellido || "",
        telefono: factura.cliente_telefono || "N/A",
      },
      producto: {
        nombre: factura.nombre_producto || "Personalizado",
        color: factura.color || "N/A",
        dimensiones: factura.dimensiones || "N/A",
      },
      cantidad: factura.cantidad,
      precio_unitario: factura.precio_unitario,
      precio_total: factura.precio_total,
      anticipo: factura.anticipo,
      saldo: factura.saldo,
      fecha_pedido: factura.fecha_pedido,
      fecha_entrega: factura.fecha_entrega,
    }));

    res.status(200).json(formattedResults);
  });
});
// Agregar estas rutas en tu archivo Node.js

// Libro Diario
app.get("/api/libro-diario", (req, res) => {
  const query = "SELECT * FROM libro_diario ORDER BY fecha DESC";
  
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Libro Mayor
app.get("/api/libro-mayor", (req, res) => {
  const query = `
    SELECT pc.codigo_cuenta, pc.nombre_cuenta, SUM(lm.debe) AS total_debe, SUM(lm.haber) AS 
      total_haber, SUM(lm.saldo) AS saldo_total
    FROM libro_mayor lm
    JOIN plan_cuentas pc ON lm.id_cuenta = pc.id_cuenta GROUP BY pc.codigo_cuenta, pc.nombre_cuenta
  `;
  
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Balance General
app.get("/api/balance-general", (req, res) => {
  const query = `
    SELECT codigo_cuenta, nombre_cuenta, tipo,
      SUM(CASE WHEN tipo = 'activo' THEN saldo ELSE 0 END) AS activos, SUM(CASE WHEN tipo = 'pasivo' THEN 
      saldo ELSE 0 END) AS pasivos, SUM(CASE WHEN tipo = 'patrimonio' THEN saldo ELSE 0 END) AS 
      patrimonio
    FROM plan_cuentas
    LEFT JOIN libro_mayor ON plan_cuentas.id_cuenta = libro_mayor.id_cuenta GROUP BY codigo_cuenta, 
      nombre_cuenta, tipo
  `;
  
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Estado de Resultados
app.get("/api/estado-resultados", (req, res) => {
  const query = `
    SELECT pc.codigo_cuenta, pc.nombre_cuenta, SUM(lm.saldo) AS total FROM plan_cuentas pc
    LEFT JOIN libro_mayor lm ON pc.id_cuenta = lm.id_cuenta WHERE pc.tipo IN ('ingreso', 'gasto')
    GROUP BY pc.codigo_cuenta, pc.nombre_cuenta, pc.tipo
  `;
  
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});