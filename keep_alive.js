const http = require('http');
http.createServer(function (req, res) {
    res.write("Mì tôm hảo hảo");
    res.end();
}).listen(8080);