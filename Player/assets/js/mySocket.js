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

function emitDeal(username) {
    socket.emit('deal', { username: username });
}

socket.on('deal', function (data) {
    showPlayer2Username(data.username);
}); 