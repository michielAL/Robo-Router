var http = require("http");
var auth = require("http-auth");
var digest = auth({
  authRealm: "Private area",
  authFile: __dirname + "/htpasswd",
  authType: "digest"
});
var server = http.createServer(function(request, response) {
    console.log(request);
    digest.apply(request, response, function(username) {
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write("Hello " + username);
    response.end();
  });
});
server.listen(80);
console.log("Server is listening");

