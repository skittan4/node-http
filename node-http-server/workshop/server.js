

const http = require("http");
const PORT = 3000;
// const server = http.createServer((request, response) => {
//     response.statusCode = 200;
//     response.setHeader("content-type", "text/plain");
//     response.end(JSON.stringify({ message: "Hello" }));
//   });

  // const server = http.createServer((request, response) => {
  //   const url = request.url;
  //   if (url === "/") {
  //     response.writeHead(200, { "content-type": "text/html" });
  //     response.end("<h1>Hello</h1>");
  //   } else if (url === "/goodbye") {
  //     response.writeHead(200, { "content-type": "text/html" });
  //     response.end("<h1>Goodbye</h1>");
  //   }
  // });

  

const router = require("./router.js")

const server = http.createServer(router);

  server.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));


  // function x() {
  //   console.log(`Listening on http://localhost:${PORT}`)
  // }