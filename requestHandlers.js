// JavaScript Document
var fs = require('fs');
var path = require('path');
var querystring = require("querystring");
var datastruct = require("./datastruct");//user-defined module


//an array to different type of files
MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.txt': 'text/plain'
};


//parase the file for different types
function serveFile(filePath, response) {
	var fp;
	if (filePath == '/') {
		filePath = '/index.html';
	}
	fp =  __dirname + filePath;
	/*The 0.5.x is buggy on Windows. You can do
fs.readFile(__dirname + '/file.txt', callback);
I believe 0.6 will fix these problems. :)*/
	fs.readFile( fp,'utf8', function(error, content) {
        if (error) {
			response.write(error);
			console.log(error);
            response.writeHead(500);
            response.end();
        }
        else {
			var extension = path.extname(filePath);
			var mimeType = MIME_TYPES[extension];
			
            response.writeHead(200,{'Content-Type': mimeType ? mimeType : 'text/html'});
			//response.write(extension);//for debugging
			//response.write(mimeType);//for debugging
			//console.log(content);//for debugging
            response.write(content);
			response.end();
        }
    });
}

function start(response,postData,pathname) {
  console.log("Request handler 'start' was called.");
  serveFile(pathname, response);
}

function upload(response,postData,pathname) {
  console.log("Request handler 'upload' was called.");
  response.writeHead(200, {"Content-Type": "text/html"});
  //response.write("You've sent: topic:" + querystring.parse(postData).topic +"links:"+ querystring.parse(postData).link );
  if(postData!= "")
  {
	  //response.write(postData);
	  
	  var type;
	  type = querystring.parse(postData).type;
	  //response.write(type);
	  if(type == "topic")//from  post-form in index.html 
	  {
	  	var t=new datastruct.assNode(0,0,querystring.parse(postData).topic,querystring.parse(postData).link,0);
	  	datastruct.addTopic(t,response);
	  	//response.write("topic:" + t.topic +"links:"+ t.lnk );
	  }
	  else if(type == "reply")//from reply-form
	  {
		  //response.write(postData);
		 var t=new datastruct.assNode(0,querystring.parse(postData).id,querystring.parse(postData).reply,"",0);
	  	 datastruct.addReply(t,response);
	  }
	  else if(type == "vote")//from reply-form
	  {
		  //response.write(postData);
	  	 datastruct.addVote(querystring.parse(postData).id,response);
	  }
	  
  }
  //traverse the tree
  datastruct.traverseTopic(response);
  response.end();
}

//export methods 
exports.start = start;
exports.upload = upload;