var server =require("./server");
var router =require("./router");
var commandhandler =require("./commandhandler")
var control =require("./NODE/control");
var device =require("./NODE/device");
server.init(router.route,commandhandler.proces,control.select,device.show_device);
