var my_http = require("http");
my_http.createServer(function(request,response){
    console.log("I got kicked");
    response.writeHeader(200, {"Content-Type": "text/plain"});
    response.write("Hello World");
    response.end();
}).listen(parseInt(process.argv[2]));

console.log("Express server started in port " + parseInt(process.argv[2]));