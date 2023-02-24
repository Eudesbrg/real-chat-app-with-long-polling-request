const http = require("http");
const fs = require("fs");
const url = require("url");
const querystring = require("querystring");

const port = 8080;
const hostname = "localhost";

let messages = ["Hi!"];
let clients = [];

const server = http.createServer(function (req, res) {
  // parse URl
  let url_parts = url.parse(req.url);
  if (url_parts.pathname === "/") {
    // serve file
    fs.readFile("./client.html", function (err, data) {
      res.end(data);
    });
  } else if (url_parts.pathname.slice(0, 5) === "/poll") {
    // polling request
    let count = url_parts.pathname.replace(/[^0-9]*/, "");
    // check if they are a new message
    if (messages.length > count) {
      // we have a new message that we can send
      const response = {
        count: messages.length,
        append: messages.slice(count).join("\n") + "\n",
      };
      res.end(JSON.stringify(response));
    } else {
      // we don't have a new message so we push to waiting for his response.
      clients.push(res);
    }
  } else if (url_parts.pathname.slice(0, 4) === "/msg") {
    // receiving a new message
    let query = querystring.parse(url_parts.query);
    messages.push(query.message);
    // check if we have pending client
    while (clients.length > 0) {
      let client = clients.pop();
      const response = {
        count: messages.length,
        append: query.message + "\n",
      };
      client.end(JSON.stringify(response));
    }
    res.status = 201;
    res.end(JSON.stringify({ status: "ok" }));
  } else if (url_parts.pathname.split("/").includes("static")) {
    fs.readFile("." + url_parts.pathname, function (err, data) {
      res.end(data);
    });
  }
});

server.listen(port, hostname, function () {
  console.log(`Server runing at http://${hostname}:${port}`);
});
