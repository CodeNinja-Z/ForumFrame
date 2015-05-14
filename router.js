function route(pathname,handle,response,postData) {
  console.log("About to route a request for " + pathname);
  if (pathname == '/') {
   handle["/"](response,postData,pathname);
  } else if (pathname.indexOf('.css') > 0) {
    handle["/"](response,postData,pathname);
  } else if (pathname.indexOf('.js') > 0) {
    handle["/"](response,postData,pathname);
  }else if (typeof handle[pathname] === 'function') {
    handle[pathname](response,postData,pathname);
  }else {
    console.log("No request handler found for " + pathname);
    response.writeHead(404, {"Content-Type": "text/plain"});
    response.write("404 Not found");
    response.end();
  }
}
exports.route = route;