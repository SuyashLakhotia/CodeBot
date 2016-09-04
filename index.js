var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http);

var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

var request = require('request');

var PythonShell = require('python-shell'),
    fs = require('fs');

var pythonDict = require('./pythonDict'),
    lev = require('./levenshtein');

var collection = {};
var agentdb = {};
var url = 'mongodb://localhost:27017/CodeBot';

io.on('connection', function(socket) {
    console.log('User Connected');
    io.emit('gif', 'hello');
    io.emit('message', 'Hello, world! I\'m CodeBot!');
    io.emit('message', '^ Programming joke, lol.');
    io.emit('message', 'Welcome on your first step to becoming a programmer.');
    io.emit('message', 'Today, we\'ll be learning how to code in Python! Are you ready to begin?');

    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        console.log('Connected to MongoDB');
        db.collection('Curriculum').find({}).toArray(function(err, result) {
            if (err) {
                console.log(err);
            } else if (result.length) {
                console.log('Found: ', result);
                collection = result[0];
            } else {
                console.log('No document(s) found with defined "find" criteria!');
            }
        });
        db.collection('AgentDB').find({}).toArray(function(err, result) {
            if (err) {
                console.log(err);
            } else if (result.length) {
                console.log('Found: ', result);
                agentdb = result[0].collectionContent[0];
            } else {
                console.log('No document(s) found with defined "find" criteria!');
            }
        });
    });

    var exercise = 0;
    var expectedOutput = [];
    var startFlag = true;

    socket.on('message', function(msg) {
        if (startFlag && (msg == 'yes' || msg == 'Yes' || msg == 'Yeap' || msg == 'yeap')) {
            io.emit('message', 'Alright, let\'s go!');
            startFlag = false;

            io.emit('message', 'Unit: <strong>' + collection.collectionContent[0].unitName + '</strong>');
            io.emit('message', 'Topic: ' + collection.collectionContent[0].unitContent[0].subunitName);
            io.emit('message', 'Let\'s look at ' + collection.collectionContent[0].unitContent[0].subunitContent[0].exerciseName + '!');
            io.emit('message', collection.collectionContent[0].unitContent[0].subunitContent[0].exerciseContent.instructions.replace(/\n/g, '<br>'));
            io.emit('message', 'Example:<br> <span class="code">' + collection.collectionContent[0].unitContent[0].subunitContent[0].exerciseContent.exampleCode.replace(/\n/g, '<br>') + '</span>');
            io.emit('codeStub', collection.collectionContent[0].unitContent[0].subunitContent[0].exerciseContent.codeStub);
            expectedOutput = collection.collectionContent[0].unitContent[0].subunitContent[0].exerciseContent.expectedOutput.split('\n');
        } else if (startFlag) {
            io.emit('message', 'Alright, send me a "Yes" later when you\'re ready!');
        } else {
            var action = "";
            var params = [];
            var form = {
                query: msg,
                lang: 'en',
                sessionID: '001'
            };

            request({
                headers: {
                    'Authorization': 'Bearer 0e022b403edd47e19d74add9e455be8a',
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache'
                },
                uri: 'https://api.api.ai/v1/query?v=20160627',
                body: JSON.stringify(form),
                method: 'POST'
            }, function(err, res, body) {
                action = JSON.parse(body).result.action;
                for (var i in JSON.parse(body).result.parameters) {
                    params.push(JSON.parse(body).result.parameters[i]);
                }
                console.log(action + ' ' + params);
                findDocuments(action, params);
            });
        }

        function findDocuments(action, params) {
            if (action == 'define') {
                for (var i = 0; i < agentdb.definitions.actionContent.length; i++) {
                    if (params[0] == agentdb.definitions.actionContent[i].value) {
                        io.emit('message', agentdb.definitions.actionContent[i].valueContent);
                    }
                }
            } else if (action == "how-to") {
                var valueContent = [];
                if (params[0] == 'create')
                    valueContent = agentdb.explanations.actionContent[0].valueContent;
                else if (params[0] == 'print')
                    valueContent = agentdb.explanations.actionContent[1].valueContent;
                else if (params[0] == 'join')
                    valueContent = agentdb.explanations.actionContent[2].valueContent;

                for (var i = 0; i < valueContent.length; i++) {
                    if (params[1] == valueContent[i].value) {
                        io.emit('message', valueContent[i].valueContent);
                    }
                }
            } else {
                io.emit('message', 'I\'m sorry, I don\'t understand what you mean. I am learning too. 😜');
            }
        }
    });

    function nextExercise() {
        expectedOutput = [];

        switch (exercise) {
            case 1:
            case 2:
                io.emit('message', 'Let\'s look at ' + collection.collectionContent[0].unitContent[0].subunitContent[exercise].exerciseName + '!');
                io.emit('message', collection.collectionContent[0].unitContent[0].subunitContent[exercise].exerciseContent.instructions.replace(/\n/g, '<br>'));
                io.emit('message', 'Example:<br> <span class="code">' + collection.collectionContent[0].unitContent[0].subunitContent[exercise].exerciseContent.exampleCode.replace(/\n/g, '<br>') + '</span>');
                io.emit('codeStub', collection.collectionContent[0].unitContent[0].subunitContent[exercise].exerciseContent.codeStub);
                expectedOutput = collection.collectionContent[0].unitContent[0].subunitContent[exercise].exerciseContent.expectedOutput.split('\n');
                break;
            case 3:
                io.emit('message', 'Topic: ' + collection.collectionContent[0].unitContent[1].subunitName);
                io.emit('message', 'Let\'s look at ' + collection.collectionContent[0].unitContent[1].subunitContent[0].exerciseName + '!');
                io.emit('message', collection.collectionContent[0].unitContent[1].subunitContent[0].exerciseContent.instructions.replace(/\n/g, '<br>'));
                io.emit('message', 'Example:<br> <span class="code">' + collection.collectionContent[0].unitContent[1].subunitContent[0].exerciseContent.exampleCode.replace(/\n/g, '<br>') + '</span>');
                io.emit('codeStub', collection.collectionContent[0].unitContent[1].subunitContent[0].exerciseContent.codeStub);
                expectedOutput = collection.collectionContent[0].unitContent[1].subunitContent[0].exerciseContent.expectedOutput.split('\n');
                break;
            case 4:
            case 5:
            case 6:
                io.emit('message', 'Unit: <strong>' + collection.collectionContent[1].unitName + '</strong>');
                io.emit('message', 'Topic: ' + collection.collectionContent[1].unitContent[0].subunitName);
                io.emit('message', 'Let\'s look at ' + collection.collectionContent[1].unitContent[0].subunitContent[exercise - 4].exerciseName + '!');
                io.emit('message', collection.collectionContent[1].unitContent[0].subunitContent[exercise - 4].exerciseContent.instructions.replace(/\n/g, '<br>'));
                io.emit('message', 'Example:<br> <span class="code">' + collection.collectionContent[1].unitContent[0].subunitContent[exercise - 4].exerciseContent.exampleCode.replace(/\n/g, '<br>') + '</span>');
                io.emit('codeStub', collection.collectionContent[1].unitContent[0].subunitContent[exercise - 4].exerciseContent.codeStub);
                expectedOutput = collection.collectionContent[1].unitContent[0].subunitContent[exercise - 4].exerciseContent.expectedOutput.split('\n');
                break;
            case 7:
                io.emit('message', 'Topic: ' + collection.collectionContent[1].unitContent[1].subunitName);
                io.emit('message', 'Let\'s look at ' + collection.collectionContent[1].unitContent[1].subunitContent[0].exerciseName + '!');
                io.emit('message', collection.collectionContent[1].unitContent[1].subunitContent[0].exerciseContent.instructions.replace(/\n/g, '<br>'));
                io.emit('message', 'Example:<br> <span class="code">' + collection.collectionContent[1].unitContent[1].subunitContent[0].exerciseContent.exampleCode.replace(/\n/g, '<br>') + '</span>');
                io.emit('codeStub', collection.collectionContent[1].unitContent[1].subunitContent[0].exerciseContent.codeStub);
                expectedOutput = collection.collectionContent[1].unitContent[1].subunitContent[0].exerciseContent.expectedOutput.split('\n');
                break;
        }
    }

    socket.on('code', function(code) {
        createScript(code);
        testScript();

        function createScript(str) {
            var pyFile = fs.createWriteStream('userScripts/test.py', {
                flags: 'w'
            });
            pyFile.write(str);
        }

        function testScript() {
            var returnMessages = [];
            var returnMessage;

            var script = fs.readFileSync('userScripts/test.py');
            var scriptLines = script.toString().split('\n');

            var dictionary = pythonDict.dict;

            var pyshell = new PythonShell('userScripts/test.py');

            var solved = false;

            var outputLine = 0;

            pyshell.on('message', function(message) {
                if (message != expectedOutput[outputLine]) {
                    io.emit('message', 'This output is wrong. Try to implement it in a different way. You may have missed a trick here!');
                }
                outputLine++;
            });

            pyshell.end(function(err) {
                if (err) {
                    if (err.stack.indexOf('SyntaxError') != -1) {
                        returnMessages.push('You have a <strong>Syntax Error</strong> at Line ' + err.stack.substring(err.stack.indexOf('line') + 4, err.stack.indexOf('\n')) + '.');
                        returnMessages.push('You forgot the colon after <span class="code">' + err.stack.substring(err.stack.indexOf('if'), err.stack.indexOf('^')) + '</span>');
                    } else if (err.traceback) {
                        var errorName = err.stack.substring(7, err.stack.indexOf('\n'));
                        var errorType = errorName.substring(0, errorName.indexOf(':'));
                        var errorDescription = errorName.substring(errorName.indexOf(':') + 2);
                        var traceback = err.traceback.split('\n');
                        var lineNumber = traceback[1].split(',')[1].split(' ')[2];

                        if (errorType == 'NameError') {
                            returnMessages.push('Looks like you have a <strong>Name Error</strong> at Line ' + lineNumber + '.');

                            for (i in scriptLines) {
                                if (scriptLines[i].substring(0, scriptLines[i].search('=')).length != 0)
                                    if (dictionary.indexOf((scriptLines[i].substring(0, scriptLines[i].search('=')))) < 0)
                                        dictionary.push(scriptLines[i].substring(0, scriptLines[i].search('=')));
                            }

                            var possibleWords = [];

                            for (var i = 0; i < dictionary.length; i++) {
                                if (lev.getDistance(errorDescription.substring(errorDescription.indexOf('\'') + 1, getPosition(errorDescription, '\'', 2)), dictionary[i]) <= 1) {
                                    if (dictionary[i].indexOf('(') != -1) {
                                        possibleWords.push('<span class="code">' + dictionary[i] + ')</span>');
                                    } else {
                                        possibleWords.push('<span class="code">' + dictionary[i] + '</span>');
                                    }
                                }
                            }

                            returnMessage = '';

                            if (possibleWords.length > 0) {
                                returnMessage += 'Did you mean the keyword ';
                                for (var i = 0; i < possibleWords.length; i++) {
                                    if (i != 0) {
                                        returnMessage += ', ';
                                    }
                                    returnMessage += possibleWords[i];
                                }
                                returnMessage += '?';
                                returnMessages.push(returnMessage);
                            }
                        } else if (errorType == 'IndexError') {
                            var arrayElement = traceback[2].substring(0, traceback[2].indexOf(']') + 1);

                            returnMessages.push('Looks like you are trying to access a list element with an index value beyond your list. This is called an <strong>Index Error</strong>!');
                            returnMessages.push('Anyway, all you need to do to fix this is change the index value at Line ' + lineNumber + '&mdash; <span class="code">' + traceback[2] + '</span> &mdash; to something lesser.');
                        } else if (errorType == 'TypeError') {
                            returnMessages.push('Looks like you need to refresh your concepts about data types.');
                            returnMessages.push('You seem to have a <strong>Type Error</strong> at Line ' + lineNumber + ' &mdash; ' + traceback[2]);

                            var op = errorDescription.substring(errorDescription.indexOf(':') - 1, errorDescription.indexOf(':'));

                            var datatypes = [];
                            if (errorDescription.indexOf('int') > -1)
                                datatypes.push('int');
                            if (errorDescription.indexOf('long') > -1)
                                datatypes.push('long');
                            if (errorDescription.indexOf('str') > -1)
                                datatypes.push('string');
                            if (errorDescription.indexOf('double') > -1)
                                datatypes.push('double');
                            if (errorDescription.indexOf('bool') > -1)
                                datatypes.push('bool');

                            if (datatypes.length > 1) {
                                if (errorDescription.indexOf('concatenate') > -1)
                                    returnMessages.push(datatypes[0] + ' &amp; ' + datatypes[1] + ' types cannot be concatenated.');
                                else if (errorDescription.indexOf('convert') > -1)
                                    returnMessages.push(datatypes[0] + ' &amp; ' + datatypes[1] + ' cannot be implicity converted. Please use <span class="code">' + datatypes[0] + '()</span>.');
                                else
                                    returnMessages.push('For this operation, <strong>' + op + '</strong>, your datatypes,' + datatypes[0] + ' and ' + datatypes[1] + ' are incompatible.');
                            } else if (datatypes.length == 1) {
                                if (errorDescription.indexOf('__getitem__') > -1)
                                    returnMessages.push('You are trying to get a value from a ' + datatypes[0] + ' variable.');
                                else
                                    returnMessages.push(datatypes[0] + ' types cannot be used with this function since it\'s incompatible.');
                            }
                        } else if (errorType == 'ValueError') {
                            returnMessages.push('Looks like you need to refresh your concepts about values.');
                            returnMessages.push('You seem to have a <strong>Value Error</strong> at Line ' + lineNumber + ' &mdash; ' + traceback[2]);

                            var datatypes = [];
                            if (errorDescription.indexOf('int') > -1)
                                datatypes.push('int');
                            if (errorDescription.indexOf('long') > -1)
                                datatypes.push('long');
                            if (errorDescription.indexOf('float') > -1)
                                datatypes.push('float');

                            if (datatypes.length == 1) {
                                var value = errorDescription.substring(errorDescription.lastIndexOf(' '), errorDescription.length);
                                returnMessages.push('Cannot convert ' + value + ' to ' + datatypes[0] + '.');
                            }
                        } else {
                            returnMessages.push('Hmm...your code isn\'t working but I\'m not sure why. ☹️');
                        }
                    } else {
                        returnMessages.push('Hmm...your code isn\'t working but I\'m not sure why. ☹️');
                    }

                    returnMessages.push('Go ahead and try again!');
                    io.emit('codeReview', false);
                } else {
                    returnMessages.push('Success! Your code worked. Good job!');
                    io.emit('codeReview', true);
                    solved = true;
                }

                for (var i = 0; i < returnMessages.length; i++) {
                    io.emit('message', returnMessages[i]);
                }

                if (solved) {
                    exercise++;
                    nextExercise();
                }
            });
        }

        function getPosition(str, m, i) {
            return str.split(m, i).join(m).length;
        }
    });

    socket.on('disconnect', function() {
        console.log('User Disconnected');
    });
});

app.use(express.static('public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

http.listen(3000, function() {
    console.log('Listening on localhost:3000');
});
