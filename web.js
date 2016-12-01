var express = require('express');
var port = process.env.PORT || 5000;
var app = express();

app.get('/', function(request, response) {
    response.sendfile(__dirname + '/index.html');
}).configure(function() {
    app.use('/assets', express.static(__dirname + '/assets'));
    app.use('/node_modules/', express.static(__dirname + '/node_modules/'));
    app.use('/src/', express.static(__dirname + '/src/'));
}).listen(port, function() {
  console.log("Listening on " + port);
});
