//nodejs ./SendSense.js -id <ID> -d <data>
//**********************************************vars

    var querystring = require('querystring');  
    var http = require('http');  
    var USERNAME ="michiel_AL"  
    var PASSWORD_MD5 ="";//"almende"
    var SESSION_ID="";
    var SENSOR_ID="";
    var DATA ="";
    var domain = 'api.sense-os.nl';  
    var port = 80;  
    var login_path = '/login.json';  
    var post_path = '';//can't been set here, need sensor id in path     
    var response ="";	      
    var login_data =  ' { "username": "'+USERNAME+'", "password": "f27c522aec4888e3fc0e4cd710a658c7"} ';  
    var post_data =  '';  
    var login_data_length= login_data.length
//**************************************varblock http     

    var login_options = {  
      host: domain,  
     // port: post_port,  
      path: login_path,  
      method: 'POST',  
      headers: {  
        'Content-Type': 'application/x-www-form-urlencoded',  
        'Content-Length': login_data_length,
	'accept':'*'  
      }  
    };  
      
//**********************************functions request

    var post_req = http.request(login_options, function(res) {  
      res.setEncoding('utf8');  
      res.on('data', function (chunk) {  
//        console.log('Response: ' + chunk);  
	response += chunk;
	getsessionid(response);
      });  
    });  
      
 // write parameters to post body
  
//**************************************get sessionid
function getsessionid(response)
{
//	console.log(response);
	var resultarray = response.split(/[:{}"]+/);//regex delimiters are : { }
//	console.log(resultarray);
	if (resultarray[1]=='session_id')
	{
	 SESSION_ID = resultarray[2];
//	console.log(SESSION_ID);
	 senddata();
	}
	else
  	{console.log("ERROR SENSE_SEND");
//	 console.log(resultarray);
	}
}

//******************************************send data
function senddata()
{
  if (DATA==""||SENSOR_ID=="")
  {
	console.log("param error")
	return;
  }
 post_path ="/sensors/"+SENSOR_ID+"/data.json"
 post_data =  ' {"data":[ { "value":'+DATA+'}]}';
 var post_options = {
      host: domain,
      port: port,
      path: post_path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': post_data.length,
        'accept':'*',
	//'X-SESSION_ID': '5887516d3ad038cc25.32741151'
	'X-SESSION_ID': SESSION_ID
      }
    };



//  console.log(post_path);
	var post_data_req = http.request(post_options, function(res) {
      	res.setEncoding('utf8');
      	res.on('data', function (chunk) {
       
		var antw ="";
		antw += chunk;
//    		console.log('Response: ' + antw);
//		console.log(post_data.length);
      		
		});
    	});
   post_data_req.write(post_data);  
   post_data_req.end();  
console.log ("data SendSense end");

}

//******************************************main prog

process.argv.forEach(function (val, index, array) {
//  console.log(index + ': ' + val);
        if (val == "-d")
        {
                DATA = process.argv[index+1];
        }
        if (val  == "-id")
        {
                SENSOR_ID =process.argv[index+1];
		
        }
});

//console.log(SENSOR_ID);
//console.log(DATA);

post_req.write(login_data);  
post_req.end();  
//console.log(login_data);
//console.log(login_data.length);

