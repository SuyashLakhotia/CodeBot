var PythonShell = require('python-shell'),
    fs = require('fs');

var pythonDict = require('./pythonDict'),
    lev = require('./levenshtein');

module.exports = {
    checkCode: checkCode
};

function checkCode(params) {
    var io = params.io;
    var nextExercise = params.nextExercise;
    var expectedOutput = params.expectedOutput;
    var code = params.code;

    createScript(code);
    testScript();

    function createScript(str) {
        var pyFile = fs.createWriteStream('userScripts/test.py', {
            flags: 'w'
        });
        pyFile.write(str);
    }

    function readScript(path) {
        var script = fs.readFileSync(path);
        var scriptLines = script.toString().split('\n');
        return scriptLines;
    }

    function testScript() {
        var scriptLines = readScript('userScripts/test.py');
        var pyshell = new PythonShell('userScripts/test.py');

        var returnMessages = [];
        var solved = true;

        var outputLine = 0;
        pyshell.on('message', function(message) {
            if (solved && (message != expectedOutput[outputLine])) {
                returnMessages.push('This output is wrong. Try to implement it in a different way. You may have missed a trick here!');
                solved = false;
            }
            outputLine++;
        });

        pyshell.end(function(err) {
            if (err) {
                if (err.stack.indexOf('SyntaxError') != -1) {
                    // TODO: Process SyntaxErrors other than missing colon after 'if'.
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
                                if (pythonDict.indexOf((scriptLines[i].substring(0, scriptLines[i].search('=')))) < 0)
                                    pythonDict.push(scriptLines[i].substring(0, scriptLines[i].search('=')));
                        }

                        var possibleWords = [];
                        for (var i = 0; i < pythonDict.length; i++) {
                            if (lev.getDistance(errorDescription.substring(errorDescription.indexOf('\'') + 1, getPosition(errorDescription, '\'', 2)), pythonDict[i]) <= 1) {
                                if (pythonDict[i].indexOf('(') != -1) {
                                    possibleWords.push('<span class="code">' + pythonDict[i] + ')</span>');
                                } else {
                                    possibleWords.push('<span class="code">' + pythonDict[i] + '</span>');
                                }
                            }
                        }

                        var suggestion = '';
                        if (possibleWords.length > 0) {
                            suggestion += 'Did you mean the keyword ';
                            for (var i = 0; i < possibleWords.length; i++) {
                                if (i != 0) {
                                    suggestion += ', ';
                                }
                                suggestion += possibleWords[i];
                            }
                            suggestion += '?';
                            returnMessages.push(suggestion);
                        }
                    } else if (errorType == 'IndexError') {
                        returnMessages.push('Looks like you are trying to access a list element with an index value beyond your list. This is called an <strong>Index Error</strong>!');
                        returnMessages.push('Anyway, all you need to do to fix this is change the index value at Line ' + lineNumber + ' &mdash; <span class="code">' + traceback[2] + '</span> &mdash; to something lesser.');
                    } else if (errorType == 'TypeError') {
                        returnMessages.push('Looks like you need to refresh your concepts about data types.');
                        returnMessages.push('You seem to have a <strong>Type Error</strong> at Line ' + lineNumber + ' &mdash; <span class="code">' + traceback[2] + '</span>');

                        var op = errorDescription.substring(errorDescription.indexOf(':') - 1, errorDescription.indexOf(':'));

                        var datatypes = [];
                        if (errorDescription.indexOf('int') != -1)
                            datatypes.push('int');
                        if (errorDescription.indexOf('long') != -1)
                            datatypes.push('long');
                        if (errorDescription.indexOf('str') != -1)
                            datatypes.push('string');
                        if (errorDescription.indexOf('double') != -1)
                            datatypes.push('double');
                        if (errorDescription.indexOf('bool') != -1)
                            datatypes.push('bool');

                        if (datatypes.length > 1) {
                            if (errorDescription.indexOf('concatenate') != -1)
                                returnMessages.push(datatypes[0] + ' &amp; ' + datatypes[1] + ' types cannot be concatenated.');
                            else if (errorDescription.indexOf('convert') != -1)
                                returnMessages.push(datatypes[0] + ' &amp; ' + datatypes[1] + ' cannot be implicity converted. Please use <span class="code">' + datatypes[0] + '()</span>.');
                            else
                                returnMessages.push('For this operation, <span class="code">' + op + '</span>, your datatypes,' + datatypes[0] + ' and ' + datatypes[1] + ' are incompatible.');
                        } else if (datatypes.length == 1) {
                            if (errorDescription.indexOf('__getitem__') != -1)
                                returnMessages.push('You are trying to get a value from a ' + datatypes[0] + ' variable.');
                            else
                                returnMessages.push(datatypes[0] + ' types are incompatible with this function.');
                        }
                    } else if (errorType == 'ValueError') {
                        returnMessages.push('Looks like you need to refresh your concepts about values.');
                        returnMessages.push('You seem to have a <strong>Value Error</strong> at Line ' + lineNumber + ' &mdash; <span class="code">' + traceback[2] + '</span>');

                        var datatypes = [];
                        if (errorDescription.indexOf('int') != -1)
                            datatypes.push('int');
                        if (errorDescription.indexOf('long') != -1)
                            datatypes.push('long');
                        if (errorDescription.indexOf('float') != -1)
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
                sendMessages(returnMessages);
            } else if (solved) {
                returnMessages.push('Success! Your code worked. Good job!');

                io.emit('codeReview', true);
                sendMessages(returnMessages);

                nextExercise();
            } else {
                io.emit('codeReview', false);
                sendMessages(returnMessages)
            }
        });
    }

    function sendMessages(messages) {
        for (var i = 0; i < messages.length; i++) {
            io.emit('message', messages[i]);
        }
    }

    function getPosition(str, m, i) {
        return str.split(m, i).join(m).length;
    }
}
