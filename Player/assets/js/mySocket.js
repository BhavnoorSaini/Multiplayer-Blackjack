// Santiago Ramirez & Bhavnor Saini
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

function emitBet(bet) {
    socket.emit('bet', { bet: bet });
}

socket.on('setp2Bet', function (data) {
    updatePlayer2Bet(data.bet);
});

// Emit player's cards
function emitPlayerCards(cards) {
    socket.emit('playerCards', { cards: cards });
}

// Listen for the other player's cards
socket.on('setp2PlayerCards', function (data) {
    showPlayer2Cards(data.cards);
});

// Emit dealer's cards
function emitDealerCards(cards) {
    socket.emit('dealerCards', { cards: cards });
}

// Listen for the other player's dealer cards
socket.on('setp2DealerCards', function (data) {
    showDealer2Cards(data.cards);
});