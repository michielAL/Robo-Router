
//**********************************************require
var fs = require("fs");

var sys= require('util');
var exec = require('child_process').exec;
var querystring = require('querystring');

var repository = "/home/pi/nodefiles/Database/route.DB";


var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(repository);
//**********************************************var
var child;
var INPUT="echo param error";

    
process.argv.forEach(function (val, index, array) {
  //console.log(index + ': ' + val);
        if (val == "-in")
        {
                INPUT = process.argv[index+1];
        }
        
});

console.log(INPUT );
console.log("*-*-*\n");


fs.exists(repository, function(exists) {
	if (exists) {

//
// open the database
//
		//var db = new sqlite3.Database(repository);
		db.serialize( function(){
			db.each("SELECT * FROM route WHERE command_in='"+INPUT+"' AND command_OUT !='';", function (err,row){
				console.log("DB returns");
				//console.log(row);
				console.log(row.command_out);
				executecommand(row.command_out);
				if(row.command_sense !='')
				{
					console.log(row.command_sense);
					executecommand(row.command_sense);
				}
				db.close();
				
			
				
			},function(err, rows) {
  				if (rows == 0) {
    					console.log(rows);
					insert(db);
				}
	  		});//db.each 
			//db.close();
		});
	}
	else {
		console.log("Database does not exist, run broker_node_init.js first.");
	}

});//serialize db





function insert(db)//command =terminalcommand
{
	//var ret =db.run("INSERT INTO route VALUES('"+INPUT+"','','', (SELECT datetime('now','localtime')));");
	//var ret =db.run("UPDATE route SET description= (SELECT datetime('now','localtime')) WHERE command_in = '"+INPUT+"';");
console.log("updating DB ");
	var ret =db.run("DELETE FROM input_device WHERE command='"+INPUT+"' AND name ='auto-insert';");
 	ret =db.run("INSERT INTO input_device VALUES ('auto-insert','"+INPUT+"',(SELECT datetime('now','localtime')));");
	console.log(ret);
db.close()
}

function executecommand(command)//command =terminalcommand
{

child = exec(command, function (error, stdout,stderr) {
  sys.print('stdout: ' + stdout);
 // sys.print('stderr: ' + stderr);
  if (error !== null) {
    console.log('exec error: ' + error);
  }
});

}
