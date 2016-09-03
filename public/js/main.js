var socket = io();

function keyEnter(e) {
    if (e.keyCode === 13) {
        sendMessage();
    }
}

function sendMessage() {
    if ($('#messageBox').val() != '') {
        socket.emit('message', $('#messageBox').val());
        var html = '<tr><td class="bubble me">' + $('#messageBox').val() + '</td></tr>';
        $('.chat table').append(html);
        $('#chatBox').scrollTop($('#chatBox')[0].scrollHeight);
        $('#messageBox').val('');
    }
};

socket.on('message', function(msg) {
    $('.chat table').append('<tr><td class="bubble you">' + msg + '</td></tr>');
    $('#chatBox').scrollTop($('#chatBox')[0].scrollHeight);
});

socket.on('codeReview', function(boolean) {
    var num = Math.floor(Math.random() * 3) + 1;

    if (boolean) {
        $('.chat table').append('<tr><td class="bubble you"><img src="/assets/win' + num + '.gif" width="400px" height="auto"></td></tr>');
    } else {
        $('.chat table').append('<tr><td class="bubble you"><img src="/assets/sad' + num + '.gif" width="400px" height="auto"></td></tr>');
    }
    
    setTimeout(function() {
        $('#chatBox').scrollTop($('#chatBox')[0].scrollHeight);
    }, 100);
});

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
            var html = '<tr><td class="bubble me code">' + $('#codeBox').val().replace(/\n/g, '<br>').replace(/  /g, '&nbsp;&nbsp;') + '</td></tr>';
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
