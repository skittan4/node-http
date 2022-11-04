const submitHandler = require("./handlers/submit");

const homeHandler = require("./handlers/home.js");

const goodbyeHandler = require("./handlers/goodbye.js");

const missingHandler = require("./handlers/missing404.js");


function router(request, response) {
    const url = request.url;
    const method = request.method;
    if (url === "/") {homeHandler(request, response);}

    else if (method === "POST" && url === "/submit") {submitHandler(request, response);}

    else if (url === "/goodbye") {goodbyeHandler(request, response);}

    else { missingHandler(request, response);}

 
  }
module.exports = router
