//------------------------------------------
//Santiago Ramirez
//listeners.js
//provides the listners and event handling
//------------------------------------------


document.addEventListener("DOMContentLoaded", function() {      // waits for DOM to be loaded
    if (window.location.pathname.endsWith('index.html')) {  
        document.getElementById("loginform").addEventListener("submit", function() {        // listens for the submit button on the login form
            this.submit();                  // submits the form if valid
        });
        
    } else {   
        // blackjack.fetchDeck();     
        document.getElementById("hit").addEventListener("click", function() {
            blackjack.hit();            // calls the hit function to deal a card to the user
            // emitPlayerCards(blackjack.player.userhand.cards); // Emit player's cards
            // if (blackjack.didPlayerBust()) {
            //     emitDealerCards(blackjack.dealer.cards); // Emit dealer's cards if player busts
            // }
        });

        document.getElementById("stand").addEventListener("click", function() {
            blackjack.stand();          // calls the stand function to switch to the dealers turn
        });

        document.getElementById("deal").addEventListener("click", function() {
            blackjack.deal();           // starts a new game and deals the cards
            emitUsername(gamePlay.getUsername());
            
            // print the user bet
            emitBet(blackjack.player.userBet);
            
            // Emit initial cards
            emitPlayerCards(blackjack.player.userhand.cards);
            emitDealerCards(blackjack.dealer.cards);
        });

        document.getElementById("reset").addEventListener("click", function() {
            gamePlay.reportOutcome('gameover');
            gamePlay.reset();           // resets the game completely
        });

        document.getElementById("betIncrement").addEventListener("click", function() {
            if (!document.getElementById("deal").disabled) {                    // if the game is not ongoing, incriment the bet by default amount
                blackjack.player.userBet += blackjack.betIncrementValue;
                updateBet();
            }
        });

        document.getElementById("betDecrement").addEventListener("click", function() {
            if (!document.getElementById("deal").disabled && blackjack.player.userBet > 0) {        // if the game isnt ongoing and the bet isnt negative, decrement bet by default
                blackjack.player.userBet -= blackjack.betIncrementValue;
                updateBet();
            }
        });
    }
});