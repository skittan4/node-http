function goodbye(request, response) {
    response.writeHead(200, { "content-type": "text/html" });
    response.end("<h1>GoodBye</h1>");
  }
  module.exports = goodbye;