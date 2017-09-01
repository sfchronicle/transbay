require("./lib/social"); //Do not delete

// timeline event listeners ----------------------------------------------------------------

var timelineOpen = 0;
var timeline_top;
var timeline_ticker;
var timeline_bottom;
var timeline_close;

document.getElementById("timeline-open").addEventListener("click",function() {
  document.getElementById("timeline-wrapper").classList.add("view");
  timelineOpen = 1;
  if (timeline_ticker) {
    timeline_ticker.classList.remove('sticky');
    timeline_ticker.style.display = "none";
    timeline_close.classList.remove('sticky');
    timeline_close.style.display = "none";
  }
},false);

document.getElementById("close-timeline-button").addEventListener("click",function() {
  document.getElementById("timeline-wrapper").classList.remove("view");
  timelineOpen = 0;
  // document.getElementById('timeline-top-border').scrollIntoView();
  var top = $('#timeline-top-border').offset().top;
  $('html,body').animate({scrollTop: top}, 1000);
  timeline_ticker.classList.remove('sticky');
  timeline_ticker.style.display = "none";
  timeline_close.classList.remove('sticky');
  timeline_close.style.display = "none";
},false);


// -----------------------------------------------------------------------------------------

window.onscroll = function() {activate()};

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

var updateImg = function(i,testImg) {

  if (i > 0) {
    testImg.style.marginLeft = -120*i+ 'px';
  }
  if (screen.width <= 2000) {
    testImg.style.width  = "150%";
  } else {
    testImg.style.width  = "200%";
  }
}

var placeholderHeight = document.getElementById('floor0').clientHeight;
console.log(placeholderHeight);
var IDXprev = -1;

function activate() {

  // general scrolling variable ----------------------------
  var window_top = document.body.scrollTop;//getPageScroll();//

  // scrolling commands for interactive graphic ----------------
  var sticker_start = document.getElementById('stick-here').getBoundingClientRect().top + window_top-37;
  var sticker_stop = document.getElementById('stop-stick-here').getBoundingClientRect().top + window_top;

  for (var s = 0; s < floorplanData.stages.length; s++ ) {
    // console.log(s);
    var sticker_ph = document.getElementById('stick-ph'+s);
    var showf = document.getElementById("showfloor"+s);
    var f = document.getElementById("floor"+s);

    var f_top = showf.getBoundingClientRect().top + window_top - 37;
    if (s < (floorplanData.stages.length-1)){
      var f_bottom = showf.getBoundingClientRect().bottom + window_top + 100;
    } else {
      var f_bottom = showf.getBoundingClientRect().bottom + window_top - placeholderHeight;
    }

    if (window_top > f_top && window_top < f_bottom) {
      console.log("we are at floor "+s);
      f.classList.add('fixed');
      sticker_ph.style.height = placeholderHeight+"px";
      sticker_ph.style.display = 'block';
      IDXprev = s;
    } else if (IDXprev == s){
      console.log("we are not at floor "+s)
      f.classList.remove('fixed');
      sticker_ph.style.display = 'none';
    }
    if ((window_top < sticker_start) || (window_top >= sticker_stop)) {
      console.log("we are not in the interactive");
      f.classList.remove('fixed');
      sticker_ph.style.display = 'none';
    }

  };

  // scrolling commands for timeline ------------------------------------------------------------------

  if (timelineOpen == 1) {
    timeline_top = document.getElementById('stick-timeline').getBoundingClientRect().top + window_top-100;
    timeline_ticker = document.getElementById('ticker');
    timeline_bottom = document.getElementById('e16').getBoundingClientRect().bottom + window_top - 30;
    timeline_close = document.getElementById('close-timeline-button');

    if ((window_top > timeline_top) && (window_top < timeline_bottom)) {
      timeline_ticker.style.display = "block";
      timeline_ticker.classList.add('sticky');
      timeline_close.style.display = "block";
      timeline_close.classList.add('sticky');
    } else {
      timeline_ticker.classList.remove('sticky');
      timeline_ticker.style.display = "none";
      timeline_close.classList.remove('sticky');
      timeline_close.style.display = "none";
    }

    for (var i = 0; i < timelineData.length; i++ ) {
    	var a = document.getElementById("e"+i);
    	var at = document.getElementById("t-"+i);

      var ed_top = a.getBoundingClientRect().top + window_top - 100;
  	  var ede_top = a.getBoundingClientRect().bottom + window_top - 100;

      if (window_top > ed_top && window_top < ede_top) {
        at.classList.add('active');
        a.classList.add('active');
      } else {
        at.classList.remove('active');
        a.classList.remove('active');
    	}
    }
  }

}
