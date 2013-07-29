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
var route_cmd_in="";

var route_cmd_out_address="";
var route_cmd_out_methode="";
var route_cmd_sense="";
var route_description="";


function link_devices(response,request) {
	route_cmd_in="";

	route_cmd_out_address="";
	route_cmd_out_methode="";
	route_cmd_sense="";
	route_description="";
	var chunk="";

	response.writeHead(200, { 'content-type': 'text/html' });
			           		
	response.write("<html><head>"
	+"<form action=control.js><input type=button value=Back id = back onclick=this.form.submit() ></form>"
	+"<form action=link.js><input type=button value=reset id = reset onclick=this.form.submit() ></form>"
	+"</head><body>");


// read querry
	var query =url.parse(request.url,true).query;

	response.write("<H2>Linker</H2>");

	console.log( query);
	
	//read DB
	response.write("<form method=get name=select_dev action=link.js > <select name =in_device  ><option VALUE='' >select input</option>");

	db.serialize( function(){
		
		db.each("SELECT *  FROM input_device ;", function (err,row){
			
			response.write("<option VALUE="+row.command+" ");
			if (query.in_device ==row.command)
			{
				response.write(" selected "); //select the option chosen in the previous submit
				route_cmd_in=row.command;	//remeber vars for update of DB

			}
			response.write(">"+row.name+", "+row.command+", "+row.description+"</option> \n");
		
			


		},function(err, rows) {
			response.write("</select><br><br>\n");
			
			
			console.log( query.command); 
			selectoutput(response,query);

  		});//db.each 
			

	});//db.serialize
}


				


function selectoutput(response,query)
{


///*************
	response.write("<select name =out_device onchange=this.form.submit() ><option VALUE=''>select output device</option>");
	console.log("SELECT *  FROM output_device ;");
	db.each("SELECT *  FROM output_device  ;", function (err,row){
		/*console.log( row.name); 
		 console.log( row.methode); 
		console.log( row.address); */
	//***	
		response.write("<option VALUE="+row.name+" ");
		if (query.out_device ==row.name)
			{
				response.write(" selected ");
				route_cmd_out_methode = row.methode;
				route_cmd_out_address = row.address;
				route_cmd_sense = row.sense_id;
			}
		response.write(">"+row.name+", "+row.description+"</option> \n");
		
	},function(err, rows) {
		response.write("</select><br><br>");
		console.log("query.out_device");
		console.log(query.out_device);
		if (query.out_device===undefined||query.out_device=="")
		{
			response.write("</form>at the end </body></html>");
			response.end();
		}
		else
		{
			selectcommand(response,query);
		}

  	});//db.each 
	


//***********************
	
}
function selectcommand(response,query)
{


///*************
	response.write("<select name =command  ><option VALUE=''>select command</option>");
	console.log("SELECT *  FROM output_command where name ='"+query.out_device+"' ;");
	db.each("SELECT *  FROM output_command where name ='"+query.out_device+"' ;", function (err,row){

	//***	
		response.write("<option VALUE="+row.command+" ");
		if (query.command ==row.command)
			{response.write(" selected ");}
		response.write(">"+row.name+", "+row.cmd_description+"</option> \n");
		
	},function(err, rows) {
		response.write("</select><br><br><input type='text' name=description maxlength='40' value='");
		if (query.description===undefined||query.description==""||query.description=="description")
		{
			response.write("");
		}
		else
		{
			response.write(query.description);
			route_description=query.description;
		}
		response.write("'><br><br><input type= submit value= Submit name =button></form>");//<input type= submit value= Submit >
		if (query.button=="Submit")
		{
			insertcommand(response,query);
		}
		else
		{
		response.write("<br><br> at the end </body></html>");
		response.end();	
		}

  	});//db.each 
//***********************
	
}
function insertcommand(response,query)
{
	var missing_parameter=0;
	response.write("<FONT COLOR= '#FF0000'>");//red collor for errors
	if (route_cmd_in ==""||route_cmd_in===undefined)
	{
		response.write("please select input<br>");
		missing_parameter++;
	} 
	if (route_cmd_out_methode ==""||route_cmd_out_methode===undefined)
	{
		response.write("please select output device<br>");
		missing_parameter++;
	} 
	if (query.command ==""||query.command===undefined)
	{
		response.write("please select comand/action<br>");
		missing_parameter++;
	} 
	if (route_description ==""||route_description===undefined)
	{
		response.write("please insert discription<br>");
		missing_parameter++;
	} 
	response.write("</FONT>\n");
	if (missing_parameter==0)// all parrams ok?
	{

		route_description=route_description.replace('"','~');// preventing sql insert. (xkcd.com/327)
		route_description=route_description.replace("'",'*');
		var command =(query.command.replace('"','~').replace("'",'*'));

		var query_insert = ("INSERT INTO route VALUES ("
		+" '"+route_cmd_in+"',"
		+" '"+route_cmd_out_methode+" -a "+route_cmd_out_address+" -c "+command+" &' ,"
		+" 'node /home/pi/nodefiles/SendSense.js -id "+route_cmd_sense+" -d "+command+" &' ,"
		+" '"+route_description+"'"
		+");");
		console.log(query_insert);

		db.run(query_insert,function(err, rows) {
		
			if (err==null)
			{
				response.write("SUCCEEDED");
			}
			else
			{
				console.log("error  ***");
				console.log(err);
				response.write("ERROR in DataBase");		
			}
		response.write("<br><br> at the end </body></html>");
		response.end();
		});

	}
	else
	{
		response.write("<br><br> at the end </body></html>");
		response.end();
	}

  	//});//db.each 
//***********************
	
}
exports.link_devices = link_devices;
