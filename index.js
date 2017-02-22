'use strict';

/* FOCUS GROUP APP */

var randomInclusive = function(minA,maxA) {
  var min = Math.ceil(minA);
  var max = Math.floor(maxA);
  return Math.floor(Math.random() * (max + 1 - min) + min);
};

//first, let's create the image constructor...
var DeckItem = function(path, id) {
  this.isRedundant = false; // Redundancy is whether a card has already been drawn this round, and would display twice concurrently
  this.isRepetitive = false; // Repetetiveness is whether a card has already been drawn the previous round`
  this.viewCount = 0;
  this.clickCount = 0;
  this.path = path;
  this.id = id;
};

var imageDeck = [
  new DeckItem('./img/bag.jpg', 0),new DeckItem('./img/banana.jpg', 1),new DeckItem('./img/bathroom.jpg', 2),new DeckItem('./img/boots.jpg', 3),
  new DeckItem('./img/breakfast.jpg', 4),new DeckItem('./img/bubblegum.jpg', 5),new DeckItem('./img/chair.jpg', 6),new DeckItem('./img/cthulhu.jpg', 7),
  new DeckItem('./img/dog-duck.jpg', 8),new DeckItem('./img/dragon.jpg', 9),new DeckItem('./img/pen.jpg', 10),new DeckItem('./img/pet-sweep.jpg', 11),
  new DeckItem('./img/scissors.jpg', 12),new DeckItem('./img/shark.jpg', 13),new DeckItem('./img/sweep.png', 14),new DeckItem('./img/tauntaun.jpg', 15),
  new DeckItem('./img/unicorn.jpg', 16),new DeckItem('./img/usb.gif', 17),new DeckItem('./img/water-can.jpg', 18),new DeckItem('./img/wine-glass.jpg', 19)
];

var ImageCard = function(handElement) {
  this.handElement = handElement;
  this.deckItemRef;
};

var img1El;
var img2El;
var img3El;
var ImageHand = function() {
  this.rngDeckItemIndex;

  img1El = document.getElementById('img1');
  img2El = document.getElementById('img2');
  img3El = document.getElementById('img3');

  this.currentHand = [new ImageCard(img1El), new ImageCard(img2El), new ImageCard(img3El)]; //attach img elements to hand
  console.log('printing .currentHand', this.currentHand);

  this.prevHandRefs = [];

  this.finishedRounds = 0;

  this.getRngDeckItem = function() { //returns the randomly picked DeckItem being dealt whilst iterating over hand in .drawCards();
    return imageDeck[this.rngDeckItemIndex];
  };

  this.getDealtCardEl = function(x) {
    return this.currentHand[x];
  };

  this.lookupDeckItem = function(x) {
    return imageDeck[x];
  };

  this.reDrawCard = function() {
    this.rngDeckItemIndex = randomInclusive(0,19);
  };

  /* REDUNDANCY */
  // Redundancy is whether a card has already been drawn this round, and would display twice concurrently

  this.setPrevHandRedundancy = function(bool) {
    for (var index = 0; index < this.currentHand.length; index++) { // clear .isRedundant flag from current DeckItem's in hand.
      this.prevHandRefs[index].isRedundant = bool;
    }
  };

  /* REPETITIVENESS */
  // Repetetiveness is whether a card has already been drawn the previous round

  this.setPrevHandRepetetiveness = function(bool) {
    for (var index = 0; index < this.currentHand.length; index++) {
      this.prevHandRefs[index].isRepetitive = bool; //signifies that these DeckItem's have been drawn this round, for use next round
    }
  };

  this.copyCurrentHandToPrevHand = function() {
    this.prevHandRefs = []; // clear old entries, if any
    for (var index = 0; index < this.currentHand.length; index++) {
      this.prevHandRefs.push(this.currentHand[index].deckItemRef);
    }
  };

  this.addDrawnCardToHand = function(index) {
    this.currentHand[index].handElement.setAttribute('src', this.getRngDeckItem().path);
    this.currentHand[index].deckItemRef = this.getRngDeckItem();

    this.getRngDeckItem().isRedundant = true;
    this.getRngDeckItem().viewCount++;
    console.log('.addDrawnCardToHand() :: Drew image ' + this.rngDeckItemIndex + '(' + this.getRngDeckItem().path + ') viewCount: ' + this.getRngDeckItem().viewCount);
  };

  /* BEGINNING ROUND */
  this.drawCards = function() {
    console.log('.drawCards() :: ROUND ', this.finishedRounds + 1);
    this.reDrawCard(); // DRAW the first card, does not accept card into hand
    var runaway = 0;

    /* FIRST ROUND */
    /* if .drawCards() is called directly for first round at bottom of source, not from .selectHandNo at end of round */
    var index = 0;
    if (this.finishedRounds === 0) { // first round;

      console.log('.drawCards() :: first round');

      /* first round, first card; */
      /* -redundancy- / -repetetiveness- */
      for (index = 0; index === 0; index++) {//first round, first card; -redundancy- / -repetetiveness-
        console.log('.drawCards() :: first round, first card');
        // console.log('.drawCards() :: ITERATE i = ' + i);

        // first round, first card; any will do.
        // ACCEPT card drawn at top of func def.
        this.addDrawnCardToHand(index); // adds image path to currentHand's .handElement; adds .deckRngItemIndex to currentHand's .deckItemRef
      }

      /* first round, n+1 card; */
      /* +redundancy+ / -repetetiveness- */
      for (index = 1; index < this.currentHand.length; index++) {
        console.log('.drawCards() :: first round, n+1 card');

        while (this.getRngDeckItem().isRedundant && runaway < 20) { // CHECK REDUNDANCY
          console.log('.drawCards() :: REDUNDANCY: ', this.rngDeckItemIndex, '(', this.getRngDeckItem().path, ')');
          this.reDrawCard(); // REJECT nth card
          runaway++;
        }
        runaway = 0;
        this.addDrawnCardToHand(index); // ACCEPT nth card
      }

    } else { // n+1 round;

      console.log('.drawCards() :: n+1 round;');

      this.copyCurrentHandToPrevHand(); // initialize prevHandRefs from currentHand before replacing
      this.setPrevHandRepetetiveness(true); // first hand redundant on next round

      this.setPrevHandRedundancy(false); // redundancy flags on previous hand must be cleared before each round
      //... redundancy is set to true per card drawn via .addDrawnCardToHand();

      /* n+1 round, first card; */
      /* -redundancy- / +repetetiveness+ */
      for (index = 0; index === 0; index++) { // CHECK REPETITIVENESS
        console.log('.drawCards() :: n+1 round, first card;');

        while (this.getRngDeckItem().isRepetitive && runaway < 20) {
          console.log('.drawCards() :: REPETITIVENESS: ', this.rngDeckItemIndex, '(', this.getRngDeckItem().path, ')');
          this.reDrawCard();
          runaway++;
        }
        runaway = 0;
        this.addDrawnCardToHand(index);
      }

      /* n+1 round, n+1 card; */
      /* +redundancy+ / +repetetiveness+ */
      for (index = 1; index < this.currentHand.length; index++) { // CHECK REDUNDANCY AND REPETITIVENESS
        console.log('.drawCards() :: n+1 round, n+1 card;');

        while ( (this.getRngDeckItem().isRedundant || this.getRngDeckItem().isRepetitive) && runaway < 20) {

          var debug;
          if (this.getRngDeckItem().isRedundant){
            debug = 'REDUNDANCY: ';
          } else if (this.getRngDeckItem().isRepetitive) {
            debug = 'REPETITIVENESS: ';
          }

          console.log('.drawCards() :: ', debug, this.rngDeckItemIndex, '(', this.getRngDeckItem().path, ')');
          this.reDrawCard(); //REJECT nth card
          runaway++;
        }
        runaway = 0;
        this.addDrawnCardToHand(index);

      }
    }


  };//.drawCards

  /* ENDING ROUND */
  this.selectHandNo = function(n) { //performs operations on current hand
    this.currentHand[n].deckItemRef.clickCount++; //increment .clickCount on reference DeckItem's

    if (this.finishedRounds > 0) {
      this.setPrevHandRepetetiveness(false); //clear old repetetiveness flags
    }

    /* END ROUND */
    this.finishedRounds++; // what was current will now be prev.
    console.log('.selectHandNo() :: .finishedRounds = ' + this.finishedRounds);
    for (var i = 0; i < this.currentHand.length; i++) {
      console.log('END ROUND ', this.finishedRounds + 1, ' img', i, ': id=', this.currentHand[i].deckItemRef.id, ' .path=', this.currentHand[i].deckItemRef.path);
    }

    /* BEGIN ROUND */
    this.drawCards();
  };
};//ImageHand

var removeImgElAttrs = function(attrKey, imageHand) {
  for (var i = 0; i < imageHand.currentHand.length; i++) {
    imageHand.currentHand[i].handElement.removeAttribute(attrKey);
  }
};

var domLoaded = false;
var uiState = 'loading';
var introText;
var appPane;
var imageHand;
document.addEventListener('DOMContentLoaded', function loadWrapper() {
  domLoaded = true;

});//DOMContentLoaded


// var allLoaded = 0;
// while (!(allLoaded === 1)) {
//   if (introText) {
introText = document.getElementById('introText');
introText.addEventListener('click', function introClick() {
      // console.log('introClick() :: FUNCTION_EXECUTE');

  if (windowLoaded && domLoaded) { //Initialize screen

    imageHand.drawCards();

    introText.setAttribute('class', 'hidden');
    removeImgElAttrs('class', imageHand); //remove 'hidden' class
    uiState = 'choosing';

        // allLoaded++;
  }
});//introClick
  // }//if



  // if (appPane) {
imageHand = new ImageHand();
appPane = document.getElementById('appPane');
appPane.addEventListener('click', function productClick() {
  if (uiState === 'choosing') {
    for (var c = 0; c < imageHand.currentHand.length; c++) {
      if (event.target === imageHand.currentHand[c].handElement) { //event delegation checks all hand elements
        imageHand.selectHandNo(c); //select hand index, increment rounds and draw new cards
      }
    }
  }
});
  // } //if
// }//while





var loadingText;
var readyText;
var windowLoaded = false;
window.addEventListener('load', function focusGroupApp() {
  windowLoaded = true;
  loadingText = document.getElementById('loadingText');
  loadingText.setAttribute('class', 'hidden');

  readyText = document.getElementById('readyText');
  readyText.removeAttribute('class'); //remove hidden class, make visible
});//all content loaded