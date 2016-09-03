var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
    console.log('User Connected');
    socket.on('disconnect', function() {
        console.log('User Disconnected');
    });
    socket.on('message', function(msg) {
        io.emit('message', '< Message from CodeBot >');
    });
});

http.listen(3000, function() {
    console.log('Listening on localhost:3000');
});
