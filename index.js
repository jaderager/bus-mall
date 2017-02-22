'use strict';

/* FOCUS GROUP APP */

var randomInclusive = function(minA, maxA) {
  var min = Math.ceil(minA);
  var max = Math.floor(maxA);
  return Math.floor(Math.random() * (max + 1 - min) + min);
};

// first, let's create the image constructor...
var DeckItem = function(path, id, title) {
  this.isRedundant = false; // Redundancy is whether a card has already been drawn this round, and would display twice concurrently
  this.isRepetitive = false; // Repetetiveness is whether a card has already been drawn the previous round`
  this.viewCount = 0;
  this.clickCount = 0;
  this.path = path;
  this.id = id;
  this.title = title;
};

var imageDeck = [
  new DeckItem('./img/bag.jpg', 0, 'R2D2 Bag'), new DeckItem('./img/banana.jpg', 1, 'Banana Slicer'),
  new DeckItem('./img/bathroom.jpg', 2, 'Bathroom Tablet Stand'), new DeckItem('./img/boots.jpg', 3, 'Toeless Rain Boots'),
  new DeckItem('./img/breakfast.jpg', 4, 'Toaster Coffee Pot'), new DeckItem('./img/bubblegum.jpg', 5, 'Meatball Bubblegum'),
  new DeckItem('./img/chair.jpg', 6, 'Uncomfortable Chair'), new DeckItem('./img/cthulhu.jpg', 7, 'Cthulhu Figure'),
  new DeckItem('./img/dog-duck.jpg', 8, 'Doggie Duck Bill'), new DeckItem('./img/dragon.jpg', 9, 'Dragon Meat'),
  new DeckItem('./img/pen.jpg', 10, 'Cutlery Pencaps'), new DeckItem('./img/pet-sweep.jpg', 11, 'Pet Sweeper'),
  new DeckItem('./img/scissors.jpg', 12, 'Pizza Scissors'), new DeckItem('./img/shark.jpg', 13, 'Shark Sleeping Bag'),
  new DeckItem('./img/sweep.png', 14, 'Baby Sweeper'), new DeckItem('./img/tauntaun.jpg', 15, 'StarWars Sleeping Bag'),
  new DeckItem('./img/unicorn.jpg', 16, 'Unicorn Meat'), new DeckItem('./img/usb.gif', 17, 'USB Tentacle'),
  new DeckItem('./img/water-can.jpg', 18, 'Tragic Watering Can'), new DeckItem('./img/wine-glass.jpg', 19, 'Overstylized Wine Glass')
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

  this.currentHand = [new ImageCard(img1El), new ImageCard(img2El), new ImageCard(img3El)]; // attach img elements to hand
  console.log('printing .currentHand', this.currentHand);

  this.prevHandRefs = [];

  this.finishedRounds = 0;

  this.getRngDeckItem = function() { // returns the randomly picked DeckItem being dealt whilst iterating over hand in .drawCards();
    return imageDeck[this.rngDeckItemIndex];
  };

  this.getDealtCardEl = function(x) {
    return this.currentHand[x];
  };

  this.lookupDeckItem = function(x) {
    return imageDeck[x];
  };

  this.reDrawCard = function() {
    this.rngDeckItemIndex = randomInclusive(0, 19);
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
      this.prevHandRefs[index].isRepetitive = bool; // signifies that these DeckItem's have been drawn this round, for use next round
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

  /* BEGIN ROUND */
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
      for (index = 0; index === 0; index++) {// first round, first card; -redundancy- / -repetetiveness-
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

        while ((this.getRngDeckItem().isRedundant || this.getRngDeckItem().isRepetitive) && runaway < 20) {

          var debug;
          if (this.getRngDeckItem().isRedundant) {
            debug = 'REDUNDANCY: ';
          } else if (this.getRngDeckItem().isRepetitive) {
            debug = 'REPETITIVENESS: ';
          }

          console.log('.drawCards() :: ', debug, this.rngDeckItemIndex, '(', this.getRngDeckItem().path, ')');
          this.reDrawCard(); // REJECT nth card
          runaway++;
        }
        runaway = 0;
        this.addDrawnCardToHand(index);

      }
    }


  };// .drawCards

  /* ENDING ROUND */
  this.selectHandNo = function(n) { // performs operations on current hand
    this.currentHand[n].deckItemRef.clickCount++; // increment .clickCount on reference DeckItem's

    if (this.finishedRounds === 0) { // first round;
      this.copyCurrentHandToPrevHand();
      this.setPrevHandRedundancy(false);
      this.setPrevHandRepetetiveness(true);
    }

    if (this.finishedRounds > 0) { // n + 1 round;
      this.setPrevHandRepetetiveness(false); // clear old repetetiveness flags

      this.copyCurrentHandToPrevHand();
      this.setPrevHandRedundancy(false); // redundancy flags on previous hand must be cleared before each round
      // ... redundancy is set to true per card drawn via .addDrawnCardToHand();
      this.setPrevHandRepetetiveness(true);
    }

    /* END ROUND */
    this.finishedRounds++; // what was current will now be prev.
    console.log('.selectHandNo() :: .finishedRounds = ' + this.finishedRounds);
    for (var i = 0; i < this.currentHand.length; i++) {
      console.log('END ROUND ', this.finishedRounds + 1, ' img', i, ': id=', this.currentHand[i].deckItemRef.id, ' .path=', this.currentHand[i].deckItemRef.path);
    }

  };
};// ImageHand

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
});// DOMContentLoaded

/* SIGNAL LOADING COMPLETE */
var loadingText;
var readyText;
var windowLoaded = false;
window.addEventListener('load', function windowLoadTrigger() {
  console.log('derp');
  windowLoaded = true;
  loadingText = document.getElementById('loadingText');
  loadingText.setAttribute('class', 'hidden');

  readyText = document.getElementById('readyText');
  readyText.removeAttribute('class'); // remove hidden class, make visible
});// all content loaded

document.addEventListener('keypress', function debugMenu(event) {
  console.log('keyCode:', event.key);
  if (event.key === 'D') {
    var uiState = prompt('setUiState() requires arguments');
    setUiState(uiState);
  }
});

var appResults = document.getElementById('appResults');
var appResultsContext = appResults.getContext('2d');
console.log('appResults:', appResults);
function setUiState(uiStateArg) {
  console.log('setUiState() :: FUNCTION_EXECUTE');
  uiState = uiStateArg; //set the global

  if (uiState === 'choosing') {
    for (var c = 0; c < imageHand.currentHand.length; c++) {
      console.log('clicked target:', event.target);

      if (event.target === imageHand.currentHand[c].handElement) { // event delegation checks all hand elements
        console.log('supposed to match against:', imageHand.currentHand[c].handElement);
        imageHand.selectHandNo(c); // select hand index, increment rounds and draw new cards

        if (imageHand.finishedRounds < 25) {
          imageHand.drawCards();
        }
      }
    }
  } else if (uiState === 'results') {
    console.log('uiState=', uiState);

    img1El.setAttribute('class', 'hidden');
    img2El.setAttribute('class', 'hidden');
    img3El.setAttribute('class', 'hidden');

    /* fill up the barData object... */

    var barData = new Object();
    barData.type = 'bar',
    barData.datasets = [
      {
        fillColor: '#FFFFFF',
        strokeColor: '#FFFFFF',
      },
      {
        fillColor: '#FF0000',
        strokeColor: '#FF0000'
      },
    ];

    appResults.removeAttribute('class'); // remove hidden class, show app results

    var resultsChartLabels = [];
    var resultsChartClickCount = [];
    var resultsChartViewCount = [];
    for (var i = 0; i < imageDeck.length; i++) {
      resultsChartLabels.push(imageDeck[i].title);
      resultsChartClickCount.push(imageDeck[i].clickCount);
      resultsChartViewCount.push(imageDeck[i].viewCount);
    }

    console.log('resultsChartLabels is:', resultsChartLabels);

    // var resultsChart =
    new Chart(appResultsContext, {
      type: 'bar',
      data: {
        labels: resultsChartLabels,
        datasets: [
          {
            label: 'clickCount',
            backgroundColor: '#000000',
            borderColor: '#000000',
            borderWidth: 1,
            data: resultsChartClickCount,
          },
          {
            label: 'viewCount',
            backgroundColor: '#FF0000',
            borderColor: '#FF0000',
            borderWidth: 1,
            data: resultsChartViewCount,
          }
        ], // datasets
      }, // data object
    });
  } // else if
}//uiState()


imageHand = new ImageHand();
appPane = document.getElementById('appPane');


introText = document.getElementById('introText');

appPane.addEventListener('click', function appClickTrigger() {

  document.getSelection().removeAllRanges();

  if (windowLoaded && domLoaded && uiState === 'loading') {

    imageHand.drawCards();

    introText.setAttribute('class', 'hidden');
    removeImgElAttrs('class', imageHand); // remove 'hidden' class
    uiState = 'choosing';
  }

  if (uiState === 'choosing') {
    setUiState('choosing');
  }

  if (uiState === 'choosing' && imageHand.finishedRounds === 25) {
    setUiState('results');
  }
});
