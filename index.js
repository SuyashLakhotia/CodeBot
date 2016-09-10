var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http);

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/CodeBot';
var curriculum = {};
var agentdb = {};

var codeChecker = require('./modules/codeChecker');
var messageHandler = require('./modules/messageHandler');

MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    console.log('Connected to MongoDB');
    db.collection('Curriculum').find({}).toArray(function(err, result) {
        if (err) {
            console.log(err);
        } else if (result.length) {
            console.log('Found Collection - \'Curriculum\'');
            curriculum = result[0].curriculumUnits;
        } else {
            console.log('Collection - \'Curriculum\' - not found.');
        }
    });
    db.collection('AgentDB').find({}).toArray(function(err, result) {
        if (err) {
            console.log(err);
        } else if (result.length) {
            console.log('Found Collection - \'AgentDB\'');
            agentdb = result[0].queryTypes;
        } else {
            console.log('Collection - \'AgentDB\' - not found.');
        }
    });

    http.listen(3000, function() {
        console.log('Listening on localhost:3000');
    });
});

io.on('connection', function(socket) {
    console.log('User Connected');
    io.emit('gif', 'hello');
    io.emit('message', 'Hello, world! I\'m CodeBot!');
    io.emit('message', '^ Programming joke, lol.');
    io.emit('message', 'I\'m so happy you\'ve taken your first step to becoming a programmer.');
    io.emit('message', 'Today, we\'ll be learning how to code in Python! Are you ready to begin?');

    var unit = 0,
        subunit = 0,
        exercise = -1;
    var expectedOutput = [];

    function nextExercise() {
        expectedOutput = [];

        if (exercise + 1 < curriculum[unit].subunits[subunit].exercises.length) {
            exercise++;
        } else if (subunit + 1 < curriculum[unit].subunits.length) {
            exercise = 0;
            subunit++;

            io.emit('message', 'Topic: ' + curriculum[unit].subunits[subunit].subunitName);
        } else if (unit + 1 < curriculum.length) {
            exercise = 0;
            subunit = 0;
            unit++;

            io.emit('message', 'Unit: <strong>' + curriculum[unit].unitName + '</strong>');
            io.emit('message', 'Topic: ' + curriculum[unit].subunits[subunit].subunitName);
        } else {
            io.emit('message', 'You\'ve reached the end of the current curriculum! Yay! 🏅');
            return;
        }

        io.emit('message', 'Let\'s look at ' + curriculum[unit].subunits[subunit].exercises[exercise].exerciseName + '!');
        io.emit('message', curriculum[unit].subunits[subunit].exercises[exercise].exerciseContent.instructions.replace(/\n/g, '<br>'));
        io.emit('message', 'Example:<br> <span class="code">' + curriculum[unit].subunits[subunit].exercises[exercise].exerciseContent.exampleCode.replace(/\n/g, '<br>') + '</span>');
        io.emit('codeStub', curriculum[unit].subunits[subunit].exercises[exercise].exerciseContent.codeStub);
        expectedOutput = curriculum[unit].subunits[subunit].exercises[exercise].exerciseContent.expectedOutput.split('\n');
    }

    var messageParams = {
        io: io,
        nextExercise: nextExercise,
        agentdb: agentdb,
        startFlag: true
    };
    socket.on('message', function(msg) {
        messageParams.msg = msg;
        messageHandler.handleMessage(messageParams);
    });

    var codeParams = {
        io: io,
        nextExercise: nextExercise
    }
    socket.on('code', function(code) {
        codeParams.expectedOutput = expectedOutput;
        codeParams.code = code;
        codeChecker.checkCode(codeParams);
    });

    socket.on('disconnect', function() {
        console.log('User Disconnected');
    });
});

app.use(express.static('public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});
