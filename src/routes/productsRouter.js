import { Router } from "express";
import ProductManager from "../managers/productManager.js";

const router = Router();
const productManager = new ProductManager("./src/data/products.json");

router.get("/", async (req, res) => {
  const products = await productManager.getProducts();
  res.json(products);
});

router.get("/:pid", async (req, res) => {
  const product = await productManager.getProductById(req.params.pid);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: "Producto no encontrado" });
  }
});

router.post("/", async (req, res) => {
  const productData = req.body;
  const newProduct = await productManager.addProduct(productData);
  res.status(201).json(newProduct);
});

router.put("/:pid", async (req, res) => {
  const updatedFields = req.body;
  const updatedProduct = await productManager.updateProduct(
    req.params.pid,
    updatedFields
  );
  res.json(updatedProduct);
});

router.delete("/:pid", async (req, res) => {
  await productManager.deleteProduct(req.params.pid);
  res.status(204).send();
});

export default router;
