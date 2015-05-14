var server = require("./server");
var router = require("./router");//user-defined module
var requestHandlers = require("./requestHandlers");////user-defined module
var handle = {}
handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
handle["/upload"] = requestHandlers.upload;
server.start(router.route,handle);//start the web server    usage in command line: node index.js