function select(response) {
var querystring = require('querystring');
var fs = require("fs");
var repository = "/home/pi/nodefiles/Database/route.DB";
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(repository);
var chunk="";

response.writeHead(200, { 'content-type': 'text/html' });
	                   		
response.write("<html><head>"
+"</head><body><form method=get name=select_dev action=device.js >Select your favorite device:<select name =device onchange=this.form.submit() ><option VALUE=''>select device</option>");
//goto(this)
//document.forms['FormVote'].submit()
fs.exists(repository, function(exists) {
	if (exists) {
db.serialize( function(){
	db.each("SELECT name ,description FROM output_device ;", function (err,row){
				
				//console.log(err);
				//console.log(row.command_in);
				response.write("<option VALUE="+row.name+" >"+row.name+", "+row.description+"</option> \n");
				//console.log(chunk);
				//db.close();

			
			
				
			},function(err, rows) {
			response.write("</select></form><form action=link.js><input type=button value='Linker' id = link onclick=this.form.submit() ></form> "
			+"<form action=remove.js><input type=button value='remove' id = link onclick=this.form.submit() ></form>at the end </body></html>");
				response.end();

	  		});//db.each 
			db.close();
		});//db.serialize
	}
	else {
		console.log("Database does not exist, run broker_node_init.js first.");
	}

});//serialize db


}
exports.select = select;
