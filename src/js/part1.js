require("./lib/social"); //Do not delete

var i = 0;
window.onscroll = function() {activate()};

if (screen.width <= 480) {
  var offset = 400;
} else {
  var offset = 500;
}

// desktop scrolling controls ----------------------------------------------------------------

function getPageScroll() {
  var yScroll;

  if (window.pageYOffset) {
    yScroll = window.pageYOffset;
  } else if (document.documentElement && document.documentElement.scrollTop) {
    yScroll = document.documentElement.scrollTop;
  } else if (document.body) {
    yScroll = document.body.scrollTop;
  }
  return yScroll;
}

var testDiv = document.getElementById("floor-image");
var testImg = testDiv.getElementsByTagName('img')[0];

// fills in HTML for year as years toggle
var updateInfo = function(data) {
  document.querySelector("#interactive-photo").innerHTML = "<img src="+data.image+"></img>";
  document.querySelector("#interactive-desc").innerHTML = "<div>"+data.text+"</div>";

  testImg.style.marginLeft = -100*i+ 'px';
  testImg.style.width  = "130%";
};


function activate() {

  var sticker = document.getElementById('stick-me');
  var sticker_ph = document.getElementById('stick-ph');
  var window_top = document.body.scrollTop;
  var sticker_stop = document.getElementById('stop-stick-here').getBoundingClientRect().top + window_top-offset;
  var div_top = document.getElementById('stick-here').getBoundingClientRect().top + window_top - 37;

  if ((window_top > div_top) && (window_top < sticker_stop)) {
    sticker.classList.add('fixed-class');
    if (screen.width <= 480) {
      sticker_ph.style.height = "3000px";
    } else {
      sticker_ph.style.height = "2500px";
    }
    sticker_ph.style.display = 'block'; // puts in a placeholder for where sticky used to be for smooth scrolling
  } else {
    sticker.classList.remove('fixed-class');
    sticker_ph.style.display = 'none'; // removes placeholder
  }

  var currentPosition = getPageScroll();
  if (screen.width <= 480) {
    i = Math.floor(currentPosition/2900*10)-1;
  } else {
    i = Math.floor(currentPosition/2500*3)-1;
  }
  if (i < 5 && i > -1) {
    var data = floor1Data[i-1];
    updateInfo(data);
  }
}






// function resizeImg (img){
//
//   console.log(img);
//
//   var resize = 150; // resize amount in percentage
//   var origH  = 61;  // original image height
//   var origW  = 250; // original image width
//   var mouseX = event.x;
//   var mouseY = event.y;
//   var newH   = origH * (resize / 100);
//   var newW   = origW * (resize / 100);
//
//   console.log(newH);
//   console.log(newW);
//
//   // Set the new width and height
//   img.style.width  = "120%";
//
//   console.log(img.style.width);
//
//   var c = img.parentNode;
//
//   // Work out the new center
//   c.scrollLeft = (mouseX * (resize / 100)) - (newW / 2) / 2;
//   c.scrollTop  = (mouseY * (resize / 100)) - (newH / 2) / 2;
// }
//
// var testDiv = document.getElementById("Test");
// var testImg = testDiv.getElementsByTagName('img')[0];
//
// console.log(testDiv);
// console.log(testImg);
//
// testDiv.addEventListener('click', function() {
//   resizeImg(testImg);
// }, false);
