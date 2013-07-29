var http = require("http");
var url = require("url");

function init(route,proces,select,show_device){
	function onRequest(request, response) {
		var pathname = url.parse(request.url).pathname;
		
console.log("***\n");
request.on('data', function(chunk) {
         //     console.log("Received body data:");
         //     console.log(chunk.toString());
            });
//console.log("***\n");

		console.log("Request received for "+pathname+".");
	
		route(pathname,response,request,proces,select,show_device);
	}	

	http.createServer(onRequest).listen(8888);
	console.log("Server has started.");
}

exports.init=init;
