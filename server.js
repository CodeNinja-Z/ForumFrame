var http = require("http");
var url = require("url");
var fs = require("fs");
PORT = 8888;//Port definition
function start(route,handle)//start the http server
{
	function onRequest(request, response) 
	{  
		var postData = "";
		//response.write(request.url); cout like /index.html
		var pathname = url.parse(request.url).pathname;
		console.log("Request for " + pathname + " received.");  
		request.setEncoding("utf8");
		request.addListener("data", function(postDataChunk) {//receive posted contents
		  postData += postDataChunk;
		  console.log("Received POST data chunk '"+postDataChunk + "'.");
		});
	
		request.addListener("end", function() {
		  route(pathname,handle,response, postData);
		});
	}
	http.createServer(onRequest).listen(PORT);
	console.log('Server running at http://127.0.0.1:' + PORT + '/');
}

exports.start = start;