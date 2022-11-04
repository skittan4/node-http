function homeHandler(request, response) {
  response.writeHead(200, { "content-type": "text/html" });
  response.end("<h1>Hello</h1>");
}

module.exports = homeHandler;
