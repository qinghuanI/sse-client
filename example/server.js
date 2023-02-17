var http = require("http");

http
  .createServer(function (req, res) {
    var fileName = "." + req.url;

    let count = 0;

    if (fileName === "./stream") {
      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Access-Control-Allow-Origin": "*",
      });
      res.write("retry: 10000\n");
      res.write("event: connecttime\n");
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
  })
  .listen(8844, "127.0.0.1");
