// Blackjack Web Sockets

var myURL = "http://127.0.0.1:3000";
var socket = io(myURL, {secure: true});

$.ajax({
    url: myURL,
    type: 'GET',
    success: function (data) {
        socket.emit('emit_from_here');
    }
});

socket.on('broadcast', function (data) {
    showNumberOfPlayers(data.description);
});

function emitUsername(username) {
    socket.emit('username', { username: username });
}

socket.on('setp2Username', function (data) {
    showPlayer2Username(data.username);
}); 