function remove(response,request) {
var querystring = require('querystring');
var url = require("url");
var fs = require("fs");
var repository = "/home/pi/nodefiles/Database/route.DB";
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(repository);
var chunk="";

response.writeHead(200, { 'content-type': 'text/html' });
	                   		
response.write("<html><head><form action=control.js><input type=button value='control' id = link onclick=this.form.submit() ></form>"
+"</head><body><form action=remove.js><input type= hidden value=0 name=row>");
//get params
var query =url.parse(request.url,true).query;
	
console.log( query);

//goto(this)
//document.forms['FormVote'].submit()
fs.exists(repository, function(exists) {
	if (exists) {
db.serialize( function(){
console.log( query);

	if(query!==undefined && query.row!==undefined)
	{
	console.log( query.row.length);
	console.log( query.row.type);
	var query_delete ="DELETE FROM route WHERE ";
		for (var i=0; i<query.row.length;i++)
		{	
			console.log(query.row[i]);
			query_delete=query_delete+"OID="+query.row[i]+" OR ";
		}
		//if ()		 
		//query_delete=query_delete+"OID="+query.row[query.row.length-1]+" ";

		query_delete=query_delete+"OID=-1;";
		console.log(query_delete);
		db.run(query_delete,function(err, rows) {
		
			if (err==null)
			{}
			{
				console.log("error  ***");
				console.log(err);	
			}
		});

	}
	db.each("SELECT *,OID FROM route ;", function (err,row){//oid = rowid
				
				//console.log(err);
				//console.log(row);
				response.write("<input type='checkbox' name=row VALUE="+row.rowid+" >"+row.description+",  <i> "+row.command_in+", </i>  "+row.command_out+"<br> \n");
				//console.log(chunk);
				//db.close();

			
			
				
			},function(err, rows) {
			response.write("<input type=button value='submit' id = rem onclick=this.form.submit() ></form><form action=link.js><input type=button value='Linker' id = link onclick=this.form.submit() ></form> at the end </body></html>");
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
exports.remove_link = remove;
//<input type="checkbox" name="vehicle" value="Bike">I have a bike<br>
//<input type="checkbox" name="vehicle" value="Car">I have a car 
