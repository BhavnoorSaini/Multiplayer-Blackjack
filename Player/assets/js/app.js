//-------------------------------------------
//Santiago Ramirez
//app.js
//handles game initialization and game state
//-------------------------------------------


var gamePlay = {
    Blackjack: Object.create(blackjack),        // creates the blackjack object
  
    getUsername: function() {                   // gets the username from the GET request in the URL            
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('username');
    },
   
    playGame: function() {                      // starts the game
        this.Blackjack.initialize();
        var username = this.getUsername();
        setUsername(username);
        fetch('http://127.0.0.1:3000/username', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: username })
        });
        addMessage("Welcome to Blackjack, " + this.getUsername() + "!");        // displays welcome message with the username
        addMessage("Get and play advice given by the server using the Remote Move")
    },

    isGameOver: function() {                    // returns true if the game is over
        return this.Blackjack.didPlayerBust() || this.Blackjack.didPlayerGetTwentyOne();
    },

    reset: function() {                         // resets the game and updates the values back to the default
        resetView();
        blackjack.initialize();
        enablePlayButtons(false);
        blackjack.player.resetUserBet();
        updateWallet();
        updateCardsLeft();
        updateDealerValue();
        addMessage("Game Reset!");              // displays message when successfully reset
    },

    reportOutcome: function(outcome) {          // reports the outcome to the server
        const serverURL = `http://127.0.0.1:3000/?outcome=`+outcome;
        fetch(`http://127.0.0.1:3000/player1?username=${this.getUsername()}&status=${outcome}&wallet=${user.userWallet.getValue()}`, {
            method: 'GET',
            headers: {
            'Access-Control-Allow-Origin': '*'
            }
        });
    }
};

gamePlay.playGame();                            // starts the blackjack game
