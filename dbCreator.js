var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

var url = 'mongodb://localhost:27017/CodeBot';

MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    insertCurriculum(db, function() {
        //db.close();
    });

    insertAgentDB(db, function() {
        db.close();
    });
});

var insertCurriculum = function(db, callback) {
    var collection = db.collection('Curriculum');
    collection.insert({
        collectionName: 'Curriculum',
        collectionContent: [{
            unitName: 'Python Syntax',
            unitContent: [{
                subunitName: 'Variables and Data Types',
                subunitContent: [{
                    exerciseName: 'Variables',
                    exerciseContent: {
                        instructions: 'Set the variable my_variable equal to the value 10.\nClick the Submit button to check your code.',
                        exampleCode: 'spam = 5',
                        codeStub: '# Write your code below!\nmy_variable = ',
                        expectedOutput: ''
                    }
                }, {
                    exerciseName: 'Types Of Variables',
                    exerciseContent: {
                        instructions: 'my_int to the value 7\nmy_float to the value 1.23\nmy_bool to the value True',
                        exampleCode: 'a = True\nb = False',
                        codeStub: '# Set the variables\nmy_int=\nmy_float=\nmy_bool= ',
                        expectedOutput: ''
                    }
                }, {
                    exerciseName: 'Reassign Variables',
                    exerciseContent: {
                        instructions: 'Change the value of my_int from 7 to 3 in the editor',
                        exampleCode: 'my_int = 3',
                        codeStub: 'my_int = 7\nprint my_int\n# Change the value of my_int to 3 on line 8!\nmy_int = 3\nprint my_int',
                        expectedOutput: '7\n3'
                    }
                }]
            }, {
                subunitName: 'Whitespace',
                subunitContent: [{
                    exerciseName: 'Whitespace',
                    exerciseContent: {
                        instructions: 'Properly indent the code with four spaces as a tab for each statement within the function spam().\nYou should indent your code with four spaces.',
                        exampleCode: '',
                        codeStub: '# Write your def\nspam():\neggs = 12\nreturn eggs\nprint spam()',
                        expectedOutput: '12'
                    }
                }]
            }]
        }, {
            unitName: 'Strings and Control Flow',
            unitContent: [{
                subunitName: 'Strings',
                subunitContent: [{
                    exerciseName: 'Introduction to Strings',
                    exerciseContent: {
                        instructions: 'Create a new variable brian and assign it the string "Hello life!".',
                        exampleCode: 'name = "Ryan"',
                        codeStub: '# Strings need to be within quotes.',
                        expectedOutput: ''
                    }
                }, {
                    exerciseName: 'Access by Index',
                    exerciseContent: {
                        instructions: 'Assign the variable fifth_letter equal to the fifth letter of the string "MONTY".',
                        exampleCode: '',
                        codeStub: 'c = "MONTY"\nfifth_letter =\nprint fifth_letter',
                        expectedOutput: 'Y'
                    }
                }, {
                    exerciseName: 'String Concatenation',
                    exerciseContent: {
                        instructions: 'Print the sentence "Spam and eggs". Concatenate strings "Spam ", "and ", "eggs" ',
                        exampleCode: 'print "Life " + "of " + "Brian"',
                        codeStub: '',
                        expectedOutput: 'Spam and eggs'
                    }
                }]
            }, {
                subunitName: 'Control Flow',
                subunitContent: [{
                    exerciseName: 'Go with the Flow',
                    exerciseContent: {
                        instructions: 'Print odd or even alternatively 5 times each',
                        exampleCode: 'answer = 1\n',
                        codeStub: '# Control flow gives us this ability to choose among outcomes based off what else is happening in the program.',
                        expectedOutput: '1'
                    }
                }]
            }]
        }]
    }, function(err, result) {
        assert.equal(err, null);
        assert.equal(1, result.result.n);
        assert.equal(1, result.ops.length);
        console.log("Inserted Curriculum into the collection.");
        callback(result);
    });
}

var insertAgentDB = function(db, callback) {
    var collection = db.collection('AgentDB');
    collection.insert({
            collectionName: 'AgentDB',
            collectionContent: [{
                definitions: {
                    action: 'define',
                    actionContent: [{
                        value: 'variables',
                        valueContent: 'In computer programming, a variable or scalar is a storage location paired with an associated symbolic name (an identifier), which contains some known or unknown quantity of information referred to as a value.'
                    }, {
                        value: 'errors',
                        valueContent: 'In computer programming, a logic error is a bug in a program that causes it to operate incorrectly, but not to terminate abnormally (or crash). A logic error produces unintended or undesired output or other behavior, although it may not immediately be recognized as such.'
                    }, {
                        value: 'data type',
                        valueContent: 'In computer science and computer programming, a data type or simply type is a classification identifying one of various types of data, such as real, integer or Boolean, that determines the possible values for that type, the operations that can be done on values of that type, the meaning of the data, and the way values of that type can be stored.'
                    }, {
                        value: 'whitespace',
                        valueContent: 'In computer science, white space is any character or series of characters that represent horizontal or vertical space in typography. When rendered, a whitespace character does not correspond to a visible mark, but typically does occupy an area on a page.'
                    }, {
                        value: 'comment',
                        valueContent: 'In computer science, an integer is a datum of integral data type, a data type which represents some finite subset of the mathematical integers. Integral data types may be of different sizes and may or may not be allowed to contain negative values.'
                    }, {
                        value: 'string',
                        valueContent: 'In computer science a string is any finite sequence of characters (i.e., letters, numerals, symbols and punctuation marks). An important characteristic of each string is its length, which is the number of characters in it. The length can be any natural number (i.e., zero or any positive integer).'
                    }]
                },
                explanations: {
                    action: 'how-to',
                    actionContent: [{
                        actionValue: 'create',
                        valueContent: [{
                            value: 'variables',
                            valueContent: 'Python variables do not need explicit declaration to reserve memory space. The declaration happens automatically when you assign a value to a variable. The equal sign (=) is used to assign values to variables.'
                        }, {
                            value: 'comment',
                            valueContent: 'Python has two ways to annotate Python code. One is by using comments to indicate what some part of the code does. Single-line comments begin with the hash character (#) and are terminated by the end of line. Comments spanning more than one line are achieved by inserting a multi-line string (with \\\ as the delimiter one each end) that is not used in assignment or otherwise evaluated, but sits in between other statements.'
                        }, {
                            value: 'string',
                            valueContent: 'We can create strings simply by enclosing characters in quotes. Python treats single quotes the same as double quotes. Creating strings is as simple as assigning a value to a variable.'
                        }]
                    }, {
                        actionValue: 'print',
                        valueContent: [{
                            value: 'variables',
                            valueContent: 'Use the print() statement with the variable name in the parentheses. For example :\nprint(var_name).'
                        }]
                    }, {
                        actionValue: 'join',
                        valueContent: [{
                            value: 'variables',
                            valueContent: 'Use the + operator to join or concatenate two variables. IMPORTANT: The variables must be of the same data type, otherwise you might encounter a TypeError - a mismatch of types. For example:\nif an integer and a string are joined, it will lead to a TypeError.'
                        }, {
                            value: 'string',
                            valueContent: 'Use the + operator to join or concatenate two strings. The result will be a string containing the second string appended to the end of the first string.'
                        }]
                    }]
                }
            }]
        },
        function(err, result) {
            assert.equal(err, null);
            assert.equal(1, result.result.n);
            assert.equal(1, result.ops.length);
            console.log("Inserted AgentDB into the collection.");
            callback(result);
        });
}
