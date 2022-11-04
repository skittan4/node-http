function submitHandler(request, response) {
  let body = "";
  request.on("data", chunk => {
    body += chunk;
  });
  request.on("end", () => {
    const data = new URLSearchParams(body);
    const name = data.get("name");
    response.writeHead(200, { "content-type": "text/html" });
    response.end(`<h1>Hello ${name}</h1>`);
  });
  request.on("error", error => {
    response.writeHead(500, { "content-type": "text/html" });
    response.end("<h1>Server error</h1>");
  });
}

module.exports = submitHandler;
