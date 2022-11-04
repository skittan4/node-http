# Node HTTP server

Node is most often used to create HTTP servers for the web. It has some nice built-in tools that help us do this.

## Workshop prep

1. Clone this repo
1. Open `workshop/server.js` in your editor
1. Run `node workshop/server.js` in your terminal to execute your code. The server will keep running until you tell it to stop
1. When you make changes you need to stop your Node process by running `ctrl-c` in your terminal, then re-run `node workshop/server.js`

Follow along with each example in your own editor.

## Creating a server

The built-in `http` module has a `createServer` method.

```js
const http = require("http");

const server = http.createServer();
```

## Handling requests

Our server currently does nothing. We need to pass a "handler function" to `createServer`. This function will be run whenever the server receives a request. This is similar to `addEventListener` in the browser.

The handler will be passed two arguments: an object representing the incoming request, and an object representing the response that will eventually be sent.

```js
const http = require("http");

const server = http.createServer((request, response) => {
  response.end("hello");
});
```

We can use the `end` method on the response object to tell Node to send the response. Whatever we pass here will be sent as the response body.

## Starting the server

Our Node program has a functioning server, but that server isn't currently listening for requests. We need to tell it to do so, and what port it should listen on:

```js
const http = require("http");
const PORT = 3000;

const server = http.createServer((request, response) => {
  response.end("hello");
});

server.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
```

We use the `listen` method of the server object. This takes the port number to listen on, and an optional callback to run when it starts listening. This callback is a good place to log something so you know the server has started.

Now we can run the program in our terminal with `node workshop/server.js`. The server will start and you should see "Server listening on http://localhost:3000" logged.

**Note**: The Node process will continue running until you tell it to stop by typing `ctrl-c`. The server won't pick up any code changes until you restart it.

## Sending requests

We can now send HTTP requests to our server and we should see the "hello" response. You can open http://localhost:3000 in your browser to send a `GET` request and see the response. It's helpful to open the network tab of devtools so you can see all the details of the request and response.

The server currently returns "hello" as plaintext no matter what request we send it (try visiting random endpoints like http://localhost:3000/shenanigans). Lets make it more interesting.

## The response

HTTP responses need a few different things:

1. A status code (e.g. `200` for success or `404` for not found)
1. Headers to provide info about the response
1. A body (the response data itself)

### Status code

We're currently only providing the body. Node will set the status code to `200` by default, but it's best to be explicit.

```js
const server = http.createServer((request, response) => {
  response.statusCode = 200;
  response.end("Hello");
});
```

### Headers

We should set headers describing our response. For example here we're sending the body as regular text, so we should tell the browser that using the `content-type` header.

```js
const server = http.createServer((request, response) => {
  response.statusCode = 200;
  response.setHeader("content-type", "text/plain");
  response.end("Hello");
});
```

### JSON body

We aren't limited to a plaintext response. Lets send some JSON instead.

```js
const server = http.createServer((request, response) => {
  response.statusCode = 200;
  response.setHeader("content-type", "application/json");
  response.end(JSON.stringify({ message: "Hello" }));
});
```

It's important to note that our response has to be a string, which is why we stringify our object.

### HTML body

Browsers don't handle JSON that well. Web pages are made of HTML, so let's change our response to that.

```js
const server = http.createServer((request, response) => {
  response.statusCode = 200;
  response.setHeader("content-type", "text/html");
  response.end("<h1>Hello</h1>");
});
```

### Simplifying headers

If we wanted to set more headers we'd end up with a lot of `setHeader` calls. Node has a method for setting the status code _and_ all the headers at once: `response.writeHead`.

```js
const server = http.createServer((request, response) => {
  response.writeHead(200, { "content-type": "text/html" });
  response.end("<h1>Hello</h1>");
});
```

We provide the status code as the first argument and an object of headers as the second.

## The request

So far we've only looked at the response argument of our handler function. Let's log a few properties of the request object.

```js
const server = http.createServer((request, response) => {
  console.log(request.method, request.url);
  response.writeHead(200, { "content-type": "text/html" });
  response.end("<h1>Hello</h1>");
});
```

Now when you refresh http://localhost:3000 in your browser you should see `GET /` logged in your terminal. Now visit http://localhost:3000/goodbye in your browser. You should see `GET /goodbye` logged in your terminal.

We can use the method and URL of the request to determine what response to send.

## Routing

Lets create another page for our site that displays a different message at `/goodbye`.

```js
const server = http.createServer((request, response) => {
  const url = request.url;
  if (url === "/") {
    response.writeHead(200, { "content-type": "text/html" });
    response.end("<h1>Hello</h1>");
  } else if (url === "/goodbye") {
    response.writeHead(200, { "content-type": "text/html" });
    response.end("<h1>Goodbye</h1>");
  }
});
```

Visit http://localhost:3000/goodbye in your browser and you should see the "Goodbye" title.

### Redirects

Sometimes we want to _redirect_ the request to another URL. You can set the `"location"` header to the new URL and the browser should follow it. The correct status code for a redirect is usually `302` (`301` is for _permanently_ moved pages).

For example to to redirect `"/hello"` to `"/"`:

```js
const server = http.createServer((request, response) => {
  const url = request.url;
  if (url === "/") {
    response.writeHead(200, { "content-type": "text/html" });
    response.end("<h1>Hello</h1>");
  } else if (url === "/goodbye") {
    response.writeHead(200, { "content-type": "text/html" });
    response.end("<h1>Goodbye</h1>");
  } else if (url === "/hello") {
    response.writeHead(302, { location: "/" });
    response.end();
  }
});
```

### Missing resources

Now that we have routing for different pages it's possible to send requests for resources that don't exist. For example visit http://localhost:3000/uhoh in your browser. The request will hang as the browser never receives a response.

We should add a case to our `if` statement to send a response when the URL doesn't match.

```js
const server = http.createServer((request, response) => {
  const url = request.url;
  if (url === "/") {
    response.writeHead(200, { "content-type": "text/html" });
    response.end("<h1>Hello</h1>");
  } else if (url === "/goodbye") {
    response.writeHead(200, { "content-type": "text/html" });
    response.end("<h1>Goodbye</h1>");
  } else if (url === "/home") {
    response.writeHead(302, { location: "/" });
    response.end();
  } else {
    response.writeHead(404, { "content-type": "text/html" });
    response.end("<h1>Not found</h1>");
  }
});
```

Now our server will send a `404` response for any request it doesn't recognise, and the user will see a "Not found" message.

## Modularisation

Our router function is getting a bit messy, and we only have very minimal code inside each branch. Since Node has a module system we can easily split our code up into multiple files so it's easier to manage.

Create a new folder `workshop/handlers`. We'll create a new file in here for each branch of our router. Start by creating a `home.js`:

```js
// workshop/handlers/home.js
function homeHandler(request, response) {
  response.writeHead(200, { "content-type": "text/html" });
  response.end("<h1>Hello</h1>");
}

module.exports = homeHandler;
```

Don't forget we have to export anything we want to use in another file. We can now import and use this function in our `workshop/server.js`:

```js
const homeHandler = require("./handlers/home");

const server = http.createServer((request, response) => {
  const url = request.url;
  if (url === "/") {
    homeHandler(request, response);
  }
  // ...
});
```

Visit http://localhost:3000 again and you should still see the "Hello" title. Now extract the other branches of your router's `if` statement to their own handler files. You should end up with a router that looks like this:

```js
const homeHandler = require("./handlers/home");
const goodbyeHandler = require("./handlers/goodbye");
const helloHandler = require("./handlers/hello");
const missingHandler = require("./handlers/missing");

const server = http.createServer((request, response) => {
  const url = request.url;
  if (url === "/") {
    homeHandler(request, response);
  } else if (url === "/goodbye") {
    goodbyeHandler(request, response);
  } else {
    missingHandler(request, response);
  }
});
```

We can also extract our router function into another file. It's good to separate our concerns: `server.js` is for creating and starting the HTTP server, and `router.js` will be for determining which handler should be called based on the URL.

Create a `router.js` file and copy your router function into it. Don't forget to move all your handler imports too.

### Request method

So far our server treats every request method the same. We can handle other HTTP methods by checking the `request.method` property. Let's add a new route `POST /submit`. Create a new file `workshop/handlers/submit.js` and create the handler function:

```js
function submitHandler(request, response) {
  response.writeHead(200, { "content-type": "text/html" });
  response.end("<h1>Thank you for submitting</h1>");
}

module.exports = submitHandler;
```

Then we need to import this in `workshop/router.js` and add a branch to our `if` statement that checks both the method _and_ the URL:

```js
const submitHandler = require("./handlers/submit");

function router(request, response) {
  const url = request.url;
  const method = request.method;
  if (url === "/") {
    // ...
  } else if (method === "POST" && url === "/submit") {
    submitHandler(request, response);
  }
  // ...
}
```

Try loading http://localhost:3000/submit in your browser. You should see the "Not found" page, because browsers send `GET` requests, not `POST`s. Instead run `curl -X POST localhost:3000/submit` in a new terminal tab/window (or use Postman to send a `POST` request if you prefer). You should see the `<h1>Thank you for submitting</h1>` response.

#### Request body

The point of a `POST` request is to _send_ data, using the request body. Node uses a concept called "streams" for requests and responses. This allows your code to start executing before the server has received the entire request (because the request could be very large and take a long time to complete).

The downside of this is that it's slightly more complicated to access a request body. We have to attach event listeners to the request to notify us when we get the next "chunk" of data, and when the request is complete:

```js
function submitHandler(request, response) {
  let body = "";
  // callback runs every time the stream has the next bit of data
  request.on("data", chunk => {
    body += chunk;
  });
  // callback runs when request finishes and we have all the data
  request.on("end", () => {
    console.log(body); // we should have the whole request body now
    response.writeHead(200, { "content-type": "text/html" });
    response.end("<h1>Thank you for submitting</h1>");
  });
}
```

Replace your `submitHandler` with this, then send another `POST` request, but this time add a body: `curl -X POST localhost:3000/submit -d 'name=oli&email=hello@oliverjam.es'`.

You should see `"name=oli&email=hello@oliverjam.es"` logged by your server. This body is [form-encoded](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST) (technically `x-www-form-urlencoded`, the default encoding for HTML form submissions). We need to parse it before we can use it:

```js
const data = new URLSearchParams(body);
const name = data.get("name");
console.log(name); // oli
```

It's important to know how the incoming data is encoded—the `content-type` header should tell you this if the client sending the request is configured correctly. For example if the request body was sent as JSON you would have to `JSON.parse` it.

##### Error-handling

It's also a good idea to add an error-handler, in case something goes wrong with your request stream:

```js
request.on("error", error => {
  // send an error response
});
```

## Dynamic responses

So far our responses are all static strings. Since we can now accept user input it would be nice to send a dynamic response using that input. JavaScript's template literals are useful for this: we can "interpolate" values into a string before sending it as the response.

```js
const name = "oli";
response.end(`<h1>Hello ${name}</h1>`);
```

Use a template literal to make your `submitHandler` response dynamic—it should send back an `h1` containing whatever name was submitted as the `POST` body. For example `curl -X POST localhost:3000/submit -d 'name=oli&email=hello@oliverjam.es'` should receive a response of `<h1>Hello oli</h1>`.
