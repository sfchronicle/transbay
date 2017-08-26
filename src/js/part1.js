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

var updateImg = function(i,testImg) {

  if (i > 0) {
    testImg.style.marginLeft = -100*i+ 'px';
  }
  if (screen.width <= 2000) {
    testImg.style.width  = "150%";
  } else {
    testImg.style.width  = "200%";
  }
}

// fills in HTML for year as years toggle
var updateInfo = function(data) {
  document.querySelector("#interactive-photo").innerHTML = "<img src="+data.image+"></img>";
  document.querySelector("#interactive-desc").innerHTML = "<div>"+data.text+"</div>";
};

// updateInfo(floor1Data[0]);
console.log(floor1Data);

function activate() {

  var sticker = document.getElementById('stick-me');
  var sticker_ph = document.getElementById('stick-ph');
  var sticker_ph_top = document.getElementById('stick-ph-top');
  var window_top = document.body.scrollTop;

  var sticker_stop = document.getElementById('stop-stick-here').getBoundingClientRect().top + window_top-document.getElementById('stick-me').clientHeight;
  var div_top = document.getElementById('stick-here').getBoundingClientRect().top + window_top;

  if ((window_top > div_top) && (window_top < sticker_stop)) {
    sticker.classList.add('fixed-class');
    sticker.classList.remove('absolute-class');
    sticker_ph.style.height = "800px";//document.getElementById('stick-me').clientHeight;
    sticker_ph.style.display = 'block'; // puts in a placeholder for where sticky used to be for smooth scrolling
    sticker_ph_top.style.display = "none";
  } else {
    sticker.classList.remove('fixed-class');
    // sticker.classList.add('absolute-class');
    // sticker_ph.style.height = "0px";
    // sticker_ph.style.height = "300px";
    sticker_ph.style.display = 'none'; // removes placeholder
    sticker_ph_top.style.display = 'none';

    testImg.style.width  = "100%";
    testImg.style.marginLeft  = "0px";
  }
  if (window_top >= sticker_stop) {
    sticker_ph_top.style.height = "800px";//document.getElementById('stick-me').clientHeight;
    sticker_ph_top.style.display = 'block'; // puts in a placeholder for where sticky used to be for smooth scrolling
    sticker_ph.style.display = 'none';
    sticker.classList.remove('fixed-class');
    sticker.classList.add('absolute-class');
  }

  var currentPosition = getPageScroll()-document.getElementById('stick-here').offsetTop;//-document.getElementById('floor-image').clientHeight;
  i = Math.floor(currentPosition/1500*4);
  console.log(i);
  if (i == 0) {
    updateImg(0,testImg);
  }
  if (i < 4 && i > 0) {
    var data = floor1Data[i-1];
    updateInfo(data);
    updateImg(i-1,testImg);
    document.querySelector("#intro").innerHTML = "";
  } else if (i <= -1) {
    document.querySelector("#interactive-photo").innerHTML = "";
    document.querySelector("#interactive-desc").innerHTML = "";
    document.querySelector("#intro").innerHTML = "The third level of the structure will hold 37 bus bays around an elongated central island where riders will wait, board and depart. The main tenant will be AC Transit, but some of the bays will be used by other buses crossing the bay, including Muni’s Treasure Island service. Unlike the gloomy 1939 terminal, this waiting area will be naturally lit and ventilated, thanks to perforated metal panels that surround it.";
  }
  // if (i >= 4) {
  //   document.getElementById('scroll-height').style.height = "500px";
  // } else {
  //   document.getElementById('scroll-height').style.height = "1500px";
  // }

}
