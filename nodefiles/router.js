function route(pathname,response,request,proces) {
 var fs =require('fs');
var http = require("http");
var url = require("url");
 var path =require('path');
var control =require("./NODE/control");
var device =require("./NODE/device");
var link =require("./NODE/link");
var remove =require("./NODE/remove");


 var startdirHTML="/home/pi/nodefiles/HTML" ;
 var startdirNODE="/home/pi/nodefiles/NODE" ;
 console.log("About to route a request for " + pathname);
/* if (pathname =="/")
	{
		pathname = "/index.html"
	}*/
 var extname = path.extname(pathname);
 if (pathname =="/control.js"||pathname =="/")
	{
		
		console.log("control.js caled ");
		control.select(response);
	}
 else if (pathname =="/device.js")
	{
		
		console.log("device.js caled ");
		device.show_device(response,request);
	}
 else if (pathname =="/link.js")
	{
		
		console.log("link.js caled ");
		link.link_devices(response,request);
	}
 else if (pathname =="/remove.js")
	{
		
		console.log("remove.js caled ");
		remove.remove_link(response,request);
	}
else
	{
		pathname =(startdirHTML+pathname);
		console.log("About to route to " +pathname);
		var query =url.parse(request.url,true).query;
		if(query)
		{
			console.log( query.command);
			proces(query);
  		}
		path.exists(pathname, function(exists) {
        	if (exists) {
       	    
        	    var contentType = 'text/html';
        	    switch (extname) {
        		    case '.js':
        		        contentType = 'text/javascript';

        		        break;
        		    case '.css':
        		        contentType = 'text/css';
		                break;
        	    	    }
	       		fs.readFile(pathname, function(error, content) {
	               		if (error) {
	                 		 response.writeHead(500);
	                 		  response.end();
	               		 }
	                	else {
	                    		response.writeHead(200, { 'Content-Type': contentType });
	                   		 response.end(content, 'utf-8');
	          	 	}
		    	});
		}
			
		else
		{
			console.log("404");
			response.writeHead(404);
			response.end();
			}
		
 		});
	}
}
exports.route = route;
