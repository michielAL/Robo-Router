var http = require("http");
var url = require("url");
var querystring = require('querystring');
var fs = require("fs");
var repository = "/home/pi/nodefiles/Database/route.DB";
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(repository);
var sys= require('util')
var exec = require('child_process').exec;
var child;


function show_device(response,request) {
	var chunk="";
	response.writeHead(200, { 'content-type': 'text/html' });
	response.write("<html><head><img src='/images/almende-logo.png'>"
	+"<form action=control.js><input type=button value=Back id = test onclick=this.form.submit() ></form>"
	+"</head><body>");


// read querry
	var query =url.parse(request.url,true).query;
	if(query.device!="")
	{
	response.write("<H2>device "+query.device+"</H2>");

	console.log( query);
	
	//read DB

		db.serialize( function(){
			
			db.each("SELECT *  FROM output_device AS dev ,output_command AS cmd WHERE cmd.name=dev.name AND dev.name= '"+query.device+"';", function (err,row){
				
				//response.write(row.name+" "+row.cmd_description+" <BR>\n");
				response.write(" <form method=get action=device.js> "+
				"<input type= hidden value="+query.device+" name=device> "+
				"<input type= hidden value='"+row.command+"' name=command> "+
				"<input type= submit value= '"+row.cmd_description+"'> "+
				"</form>");
				


			},function(err, rows) {
				response.write("</select></form> at the end </body></html>");
				response.end();
				if(query.command)
					{
					console.log( query.command); 
					executecommand(query.device,query.command);

					}
				else
					{
					console.log( "no command "); 
					console.log( request.body); 
					//db.close();
					}
				

	  		});//db.each 
				

		});//db.serialize
	}
	else{
		response.write(" <H1> error no device selected</H1>");
response.write("</select></form> at the end </body></html>");
				response.end();
	}

				
}

function executecommand(device,command)//command =terminalcommand
{


///*************
console.log("SELECT *  FROM output_device  WHERE name='"+device+"';");
	db.each("SELECT *  FROM output_device  WHERE name='"+device+"';", function (err,row){
		console.log( row.name); 
		 console.log( row.methode); 
		console.log( row.address); 
//***		
		child = exec("sudo "+row.methode+" -a "+row.address+" -c "+command+" ", function (error, stdout, stderr) {
		  sys.print('stdout: ' + stdout);
		  console.log('stderr: ' + stderr);
		  if (error !== null) {
		    	console.log('exec error: ' + error);
		  }

	},function(err, rows) {
		
		
        	});
	
		sys.print("sudo node /home/pi/nodefiles/SendSense.js -id "+row.sense_id+" -d "+command+"  ");
		
		child = exec("sudo node /home/pi/nodefiles/SendSense.js -id "+row.sense_id+" -d "+command+"  ", function (error, stdout, stderr) {
                  sys.print('stdout: ' + stdout);
                  sys.print('SENSE');
			
                  console.log('stderr: ' + stderr);
                  if (error !== null) {
                        console.log('exec error: ' + error);
                  }
       		 },function(err, rows) {
sys.print(err);

        	});



  		});//db.each 
//***********************
	
}
exports.show_device = show_device;
