function proces(query) {
// var fs =require('fs');

var address =query.address;
var command =query.command;
if (address && command )
 {
 console.log("query  address=" + query.address+"  command="+query.command+" ");
 switch (address) {
                   case 'door_Meatingroom':
                         console.log("Meatingroom ");
			//sys.print("sudo /home/pi/ardushield/rftransmit.o -c "+command+" -a 9.135.101.67.33.0.0.0 \n");
			//var comm="sudo  /home/pi/ardushield/rftransmit.o -c "+command+" -a 9.135.101.67.33.0.0.0";
			var comm="sudo  node /home/pi/nodefiles/routing.js -in \""+command+"_9.135.101.67.33.0.0.0\"";
			executecommand(comm);
                         break;
                   case '???':
                         break;
		   default :
			var comm="sudo  node /home/pi/nodefiles/routing.js -in \""+command+"_"+address+"\"";
			break;

                  }
 }
else
 {
	console.log("no address or/and command ");
	console.log(query);

 }
}
var sys= require('util')
var exec = require('child_process').exec;
var child;
function executecommand(command)//command =terminalcommand
{

child = exec(command, function (error, stdout, stderr) {
  sys.print('stdout: ' + stdout);
  sys.print('stderr: ' + stderr);
  if (error !== null) {
    console.log('exec error: ' + error);
  }
});

}



exports.proces = proces;
