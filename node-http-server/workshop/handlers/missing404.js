function error(request, response) {
    response.writeHead(404, { "content-type": "text/html" });
    response.end("<h1>page not found</h1>");
  }
  module.exports = error;