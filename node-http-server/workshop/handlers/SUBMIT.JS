function submitHandler(request, response) {

    let body = "";
  // callback runs every time the stream has the next bit of data
  request.on("data", chunk => {body += chunk;});
  // callback runs when request finishes and we have all the data
  request.on("end", () => {
    console.log(body)
    const data = new URLSearchParams(body);
    const name = data.get("name");
    console.log(name); // oli

    //     list = JSON.parse(body)  // for cases where the input is json
    //   console.log (list.name)

    response.writeHead(200, { "content-type": "text/html" });
    response.end(`<h1>Hello ${name}</h1>`);

}); 
  // we should have the whole request body now
  
    // response.writeHead(200, { "content-type": "text/html" });
    // response.end("<h1>Thank you for submitting</h1>");
  }
  
  module.exports = submitHandler;