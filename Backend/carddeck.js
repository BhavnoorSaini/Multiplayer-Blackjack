const card = {            // card object defining getters and setters for suit, rank, and value
    suit: "",
    rank:0,
    value:0,
    setRank: function (value) { this.rank = value; },

    getRank: function () { return this.rank; },

    setSuit: function (value) { this.suit = value; },

    getSuit: function () { return this.suit; },

    setValue: function (value) { this.value = value; },
 
    getValue: function () { return this.value; },

    checkFaceCard: function () {                    // checks if card is a facecard
        if (this.getRank() > 10) { return true;
        } else return false; }
};

const card_deck = {       // defines the card deck
    deck: [],
    discarded: [],
    cardsleft: 52,
    DeckSize: 52,       // amount of cards in the deck
    
    initialize: function () {       // initializes the card deck and sets all the cards' values
        this.deck = [];
        this.discarded = [];
        for (let suit of suits) {                                   // nested for loop to go through each rank in each suit
            for (let rank = 1; rank <= maxCardsPerSuit; rank++) {
                let newCard = Object.create(card);
                newCard.setSuit(suit);
                newCard.setRank(rank);
                if (newCard.checkFaceCard() == true) {
                    newCard.setValue(10);                           // sets all face cards to a value of 10
                } else if(newCard.getRank() == 1) {
                    newCard.setValue(11);                           // sets all ace's to a default value of 11
                } else {
                    newCard.setValue(rank);                         // sets all other cards value to equal their rank
                }
                this.deck.push(newCard);                            // push the card into the deck array
            }
        }
        this.cardsleft = this.DeckSize;                             // set the counter for how many cards are left
    },

    shuffle: function () {              // shuffles the card deck
        let currentIndex = this.deck.length, randomIndex;
        while (currentIndex != 0) {                         // while there are still more elements left,
            randomIndex = Math.floor(Math.random() * currentIndex);     // pick a random element
            currentIndex--;
            [this.deck[currentIndex], this.deck[randomIndex]] = [this.deck[randomIndex], this.deck[currentIndex]];      // swap elements
        }
    },
    
    dealCard: function () {
        if (this.cardsleft < 16) {
            this.addBackDiscard();      // if there are less than 16 cards left, add back used cards
        }
        this.cardsleft--;               // decrement counter for how many cards are left
        return this.deck.pop();         // pops card from the deck and returns it
    },

    

    addBackDiscard: function () {       // adds the discarded cards from the discarded array back into the deck
        this.deck = this.deck.concat(this.discarded);
        this.discarded = [];
        this.cardsleft = this.deck.length;
        this.shuffle();
        addMessage("Adding back discarded cards and shuffling...");
    },

    getNumCardsLeft: function () {
        return this.cardsleft;
    }
};

module.exports = {
    card_deck,
};