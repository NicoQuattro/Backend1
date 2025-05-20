import express from "express";
import { Server } from "socket.io";
import handlebars from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";
import productsRouter from "./routes/productsRouter.js";
import cartsRouter from "./routes/cartsRouter.js";
import viewsRouter from "./routes/viewsRouter.js";
import ProductManager from "./managers/productManager.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8080;

// Static & JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/static", express.static(path.join(__dirname, "public")));

// Handlebars config
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Routes
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

// HTTP Server
const httpServer = app.listen(PORT, () => {
  console.log(`Servidor en puerto ${PORT}`);
});

// Socket.io
const io = new Server(httpServer);
const productManager = new ProductManager(
  path.join(__dirname, "data/products.json")
);

io.on("connection", async (socket) => {
  console.log("Cliente conectado");

  const products = await productManager.getProducts();
  socket.emit("products", products);

  socket.on("addProduct", async (data) => {
    await productManager.addProduct(data);
    const updated = await productManager.getProducts();
    io.emit("products", updated);
  });

  socket.on("deleteProduct", async (id) => {
    await productManager.deleteProduct(id);
    const updated = await productManager.getProducts();
    io.emit("products", updated);
  });
});

export { io };
