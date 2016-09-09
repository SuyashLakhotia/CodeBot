var request = require('request');

module.exports = {
    handleMessage: handleMessage
};

function handleMessage(params, msg) {
    var io = params.io;
    var nextExercise = params.nextExercise;
    var agentdb = params.agentdb;
    var msg = params.msg;

    if (params.startFlag && (msg == 'yes' || msg == 'Yes' || msg == 'yeap' || msg == 'Yeap' || msg == 'y' || msg == 'Y')) {
        io.emit('message', 'Alright, let\'s go!');
        params.startFlag = false;
        nextExercise();
    } else if (params.startFlag) {
        io.emit('message', 'No worries, send me a "Yes" when you\'re ready!');
    } else {
        var data = {
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
            body: JSON.stringify(data),
            method: 'POST'
        }, function(err, res, body) {
            var result = JSON.parse(body).result;
            var action = result.action;
            var params = [];

            for (var i in result.parameters) {
                params.push(result.parameters[i]);
            }

            // console.log(action + ' ' + params);

            findDocuments(action, params);
        });
    }

    function findDocuments(action, params) {
        if (action == 'define') {
            for (var i = 0; i < agentdb[0].definitions.length; i++) {
                if (params[0] == agentdb[0].definitions[i].subject) {
                    io.emit('message', agentdb[0].definitions[i].answer);
                }
            }
        } else if (action == 'how-to') {
            var actionContent = [];
            if (params[0] == 'create')
                actionContent = agentdb[1].actions[0].actionContent;
            else if (params[0] == 'print')
                actionContent = agentdb[1].actions[1].actionContent;
            else if (params[0] == 'join')
                actionContent = agentdb[1].actions[2].actionContent;
            for (var i = 0; i < actionContent.length; i++) {
                if (params[1] == actionContent[i].subject) {
                    io.emit('message', actionContent[i].answer);
                }
            }
        } else {
            io.emit('message', 'I\'m sorry, I don\'t understand what you mean. I am learning too. 😜');
        }
    }
}
