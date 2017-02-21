'use strict';

/* GENERIC DOM MANIPULATION */
function DOMNode() {

  this.selfNodeRef;
  this.childNodeRef;

  this.attachToNode = function (become) {
    this.selfNodeRef = become;
  };

  /*  Inserts node of element type nodeType as child of target. */
  this.insertNode = function(nodeType) {
    // console.log('FUNCTION_EXECUTE insertNode(' + target + ',' + nodeType + ')');
    // console.log('insertNode() :: typeof target parameter is ' + typeof target);

    var newNode;
    newNode = document.createElement(nodeType);
    this.selfNodeRef.appendChild(newNode);
    // console.log('insertNode() :: RETURN lastChild ' + targetNodeObj.lastChild + 'of targetNode ' + targetNodeObj);
    this.childNodeRef = this.selfNodeRef.lastChild;
    console.log('DOMNode.insertNode() :: context of this: ' + this);
  };

  /*  As above, but creates a child text node.  */
  this.insertNodeWithText = function(nodeType, textInput) {
    // console.log('insertNodeWithText() :: FUNCTION_EXECUTE(' + target + ',' + nodeType + ',' + textInput + ')');
    // console.log('insertNodeWithText() :: typeof target parameter is ' + typeof target);

    var newNode;
    var newTextNode;
    newNode = document.createElement(nodeType);
    newTextNode = document.createTextNode(textInput);
    newNode.appendChild(newTextNode);
    // console.log('insertNodeWithText() :: appending newNode ' + newNode + ' to targetNode ' + targetNodeObj);
    this.selfNodeRef.appendChild(newNode);
    // console.log('insertNodeWithText() :: RETURN lastChild (' + targetNodeObj.lastChild + ') of targetNode (' + targetNodeObj + ')');
    this.childNodeRef = this.selfNodeRef.lastChild;
  };
}

/* FOCUS GROUP APP */

//first, let's create the image constructor...
function ProductImage(path) {
  this.isRedundant = false; //whether image has already been drawn this round
  this.isRepetitive = false; //whether image has been drawn last round
  this.path = path;
}

var superImage = [
  new ProductImage('./img/bag.jpg'),new ProductImage('./img/banana.jpg'),new ProductImage('./img/bathroom.jpg'),new ProductImage('./img/boots.jpg'),
  new ProductImage('./img/breakfast.jpg'),new ProductImage('./img/bubblegum.jpg'),new ProductImage('./img/chair.jpg'),new ProductImage('./img/cthulhu.jpg'),
  new ProductImage('./img/dog-duck.jpg'),new ProductImage('./img/dragon.jpg'),new ProductImage('./img/pen.jpg'),new ProductImage('./img/pet-sweep.jpg'),
  new ProductImage('./img/scissors.jpg'),new ProductImage('./img/shark.jpg'),new ProductImage('./img/sweep.png'),new ProductImage('./img/tauntaun.jpg'),
  new ProductImage('./img/unicorn.jpg'),new ProductImage('./img/usb.gif'),new ProductImage('./img/water-can.jpg'),new ProductImage('./img/wine-glass.jpg')
];



function randomInclusive (min,max) {
  var min = Math.ceil(min);
  var max = Math.floor(max);
  return Math.floor(Math.random() * (max + 1 - min) + min);
};

function ImageFrame(imgElements) {
  this.imgElements = imgElements;
  this.newImgNo;
  this.imgHand = [];
  this.reroll = function() {
    this.newImgNo = randomInclusive(0,19);
  };

  this.addImage = function(x) {
    this.imgElements[x].setAttribute('src', superImage[this.newImgNo].path);
    // this.imgHand.push(this.newImgNo);
    superImage[this.newImgNo].isRedundant = true;
  };

  this.pickImages = function() {
    console.log('.pickImages() :: FUNCTION_EXECUTE');
    for (var i = 0; i === 0; i++) {
      console.log('.pickImages() :: ITERATE i = ' + i);
      this.reroll();
      console.log('.pickImages() :: .newImgNo = ' + this.newImgNo);
      console.log('.pickImages() :: setting imgElements[' + i + '] (' + imgElements[i] + 'src to superImage[' + this.newImgNo + '].path (' + superImage[this.newImgNo].path + ')');

      this.addImage(i);
    }
    for (i = 1; i < imgElements.length; i++) {
      console.log('.pickImages() :: ITERATE_2 i = ' + i);
      
      var collisions = true;
      var infBreak = 0;

      while (superImage[this.newImgNo].isRedundant) {
        console.log('.pickImages() :: Collision, ' + this.newImgNo + ':' + superImage[this.newImgNo].path + ' is redundant.')
        this.reroll();
      }
      this.addImage(i);
    }
  };
}

var imgElements;
document.addEventListener('DOMContentLoaded', function loadWrapper() {
  imgElements = [document.getElementById('img1'), document.getElementById('img2'), document.getElementById('img3')];
  function removeImgElAttrs(attrKey) {
    for (var i = 0; i < imgElements.length; i++) {
      console.log('removeImgElAttrs(' + attrKey + ') :: removing attrKey from imgElements[' + i + ']: ' + imgElements[i]);
      imgElements[i].removeAttribute(attrKey);
    }
  }

  // function setImgElAttrs(attrKey, attrVal) {
  //   for (var i = 0; i <= imgElements.length; i++) {
  //     imgElements[i].setAttribute(attrKey, attrVal);
  //   }
  // }

  var introText = document.getElementById('introText');
  introText.addEventListener('click', function introClick() {
    // console.log('introClick() :: FUNCTION_EXECUTE');

    if (windowLoaded) { //Initialize screen
      introText.setAttribute('class', 'hidden');
      removeImgElAttrs('class'); //remove 'hidden' class

      var imageFrame = new ImageFrame(imgElements);
      imageFrame.pickImages();
    }
  });
});

// var windowLoaded = true;
var windowLoaded = false;
window.addEventListener('load', function focusGroupApp() {
  windowLoaded = true;
});//all content loaded

