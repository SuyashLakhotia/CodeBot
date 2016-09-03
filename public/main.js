var socket = io();

function keyEnter(e) {
    if (e.keyCode == 13) {
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
    $("#chatBox").scrollTop($("#chatBox")[0].scrollHeight);
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
            socket.emit('message', $('#codeBox').val());
            var html = '<tr><td class="bubble me code">' + $('#codeBox').val().replace(/\n/g, '<br>').replace(' ', '&nbsp;') + '</td></tr>';
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
})
