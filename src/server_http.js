console.log("hola mundo");
const http = require("http");

const server = http.createServer((req, res) => {
  res.end("server ona");
});

server.listen(8080, () => {
  console.log("escuchando en 8080");
});
