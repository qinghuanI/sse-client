const http = require("http");

let count = 0;

const port = 8844;
const hostname = "127.0.0.1";

const server = http.createServer(function (req, res) {
  let interval;
  if (req.url === "/stream") {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
    });
    res.write("retry: 10000\n");
    res.write("event: message\n");
    res.write("data: " + ++count + "\n\n");
    res.write("data: " + ++count + "\n\n");

    interval = setInterval(function () {
      res.write("data: " + ++count + "\n\n");
    }, 1000);

    req.connection.addListener(
      "close",
      function () {
        clearInterval(interval);
      },
      false
    );
  }
});

server.listen(port, hostname);
