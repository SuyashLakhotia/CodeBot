var socket = io();
var latestStub;

socket.on('message', function(msg) {
    $('.chat table').append('<tr><td class="bubble you">' + msg + '</td></tr>');
    $('#chatBox').scrollTop($('#chatBox')[0].scrollHeight);
});

socket.on('gif', function(name) {
    $('.chat table').append('<tr><td class="bubble you"><img src="/assets/hello.gif" width="250px" height="auto"></td></tr>');
    setTimeout(function() {
        $('#chatBox').scrollTop($('#chatBox')[0].scrollHeight);
    }, 100);
});

socket.on('codeReview', function(flag) {
    var num = Math.floor(Math.random() * 4) + 1;

    if (flag) {
        $('.chat table').append('<tr><td class="bubble you"><img src="/assets/win' + num + '.gif" width="350px" height="auto"></td></tr>');
    } else {
        $('.chat table').append('<tr><td class="bubble you"><img src="/assets/sad' + num + '.gif" width="350px" height="auto"></td></tr>');
        $('#codeBox').val(latestStub);
    }

    setTimeout(function() {
        $('#chatBox').scrollTop($('#chatBox')[0].scrollHeight);
    }, 100);
});

socket.on('codeStub', function(codeStub) {
    latestStub = codeStub;
    $('#codeBox').val(codeStub);
});

function sendMessage() {
    if ($('#messageBox').val() != '') {
        socket.emit('message', $('#messageBox').val());
        $('.chat table').append('<tr><td class="bubble me">' + $('#messageBox').val() + '</td></tr>');
        $('#chatBox').scrollTop($('#chatBox')[0].scrollHeight);
        $('#messageBox').val('');
    }
}

function codeModal() {
    var modal = document.getElementById('codeModal');
    modal.style.display = 'block';

    document.getElementById('closeBtn').onclick = function() {
        $('#codeBox').val('');
        modal.style.display = 'none';
    }

    document.getElementById('submitBtn').onclick = function() {
        if ($('#codeBox').val() != '') {
            socket.emit('code', $('#codeBox').val());
            var html = '<tr><td class="bubble me code">' + $('#codeBox').val().replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>').replace(/  /g, '&nbsp;&nbsp;') + '</td></tr>';
            $('.chat table').append(html);
            $('#chatBox').scrollTop($('#chatBox')[0].scrollHeight);
            $('#codeBox').val('');
        }

        modal.style.display = 'none';
    }

    window.onclick = function() {
        if (event.target == modal) {
            $('#codeBox').val('');
            modal.style.display = 'none';
        }
    }
}

$(document).ready(function() {
    $('.conversation-start span').html(new Date);

    $('#chatBox').scrollTop($('#chatBox')[0].scrollHeight);

    $('#messageBox').on('keydown', function(e) {
        if (e.keyCode === 13) {
            sendMessage();
        }
    });

    $('#codeBox').on('keydown', function(e) {
        if (e.keyCode === 9) {
            e.preventDefault();

            var start = $(this).get(0).selectionStart;
            var end = $(this).get(0).selectionEnd;

            $(this).val($(this).val().substring(0, start) + '  ' + $(this).val().substring(end));

            $(this).get(0).selectionStart = $(this).get(0).selectionEnd = start + 2;
        }
    });
});
