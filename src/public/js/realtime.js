const socket = io();

const list = document.getElementById("productList");
const form = document.getElementById("addForm");

socket.on("products", (products) => {
  list.innerHTML = "";
  products.forEach((p) => {
    const li = document.createElement("li");
    li.innerHTML = `
            <strong>${p.title}</strong> - $${p.price}
            <button onclick="deleteProduct(${p.id})">Eliminar</button>
        `;
    list.appendChild(li);
  });
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  data.price = parseFloat(data.price);
  data.stock = parseInt(data.stock || "0");
  data.thumbnails = [];
  socket.emit("addProduct", data);
  form.reset();
});

function deleteProduct(id) {
  socket.emit("deleteProduct", id);
}
