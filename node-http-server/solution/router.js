const homeHandler = require("./handlers/home");
const goodbyeHandler = require("./handlers/goodbye");
const helloHandler = require("./handlers/hello");
const submitHandler = require("./handlers/submit");
const missingHandler = require("./handlers/missing");

function router(request, response) {
  const url = request.url;
  const method = request.method;
  if (url === "/") {
    homeHandler(request, response);
  } else if (url === "/goodbye") {
    goodbyeHandler(request, response);
  } else if (url === "/hello") {
    helloHandler(request, response);
  } else if (method === "POST" && url === "/submit") {
    submitHandler(request, response);
  } else {
    missingHandler(request, response);
  }
}

module.exports = router;
