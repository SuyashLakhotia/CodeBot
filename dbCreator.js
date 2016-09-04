var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

var url = 'mongodb://localhost:27017/CodeBot';

MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    insertCurriculum(db, function() {
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
        console.log("Inserted document into the collection.");
        callback(result);
    });
}