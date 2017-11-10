require("./lib/social"); //Do not delete

var windowWidth = screen.width;
console.log(windowWidth);
if (windowWidth <= 480) {
  var popup_padding = 20;
  var popup_padding_min = 5;
} else if (windowWidth <= 800) {
  var popup_padding = 200;
  var popup_padding_min = 5;
} else {
  var popup_padding = 300;
  var popup_padding_min = 20;
}

$(window).scroll(function(){

  var pos = $(this).scrollTop();
  var top_pos = $('#sticky-map-top').offset().top-100;
  var bottom_pos = $('#sticky-map-bottom').offset().top;
  var mapHeight = $("#scroll-png").height();

  var inc = mapHeight/6; //how often we should see new map element
  if(pos >= top_pos) {
      $('.floor-info').css("display","none");
  }
  if(pos > top_pos) {
    $('.floor-info').css("display","block");
    var idx = Math.round((pos-top_pos)/inc);
    if (idx < 5 && idx >= 0) {
      // console.log(idx);
      if (idx == 4) {
        var inc_new = inc*idx+popup_padding;
      } else {
        var inc_new = inc*idx+popup_padding_min;
      }
      var top_padding = inc_new+"px";
      $(".floor").css("display","none")
      $("#floor"+idx).css("display","block")
      $('.floor-info').css('top',top_padding);
    }
  }
  if (pos > bottom_pos) {
    $(".floor").css("display","none")
  }

});


var r = [];
var e = document.getElementById("event");
var s = document.getElementById("statement");

for ( var i = 0; i < statementsData.length; i++ ) {
	r.push(statementsData[i].Statement);
}

var count = 0;
function changeText() {
	  e.style.opacity = 0;

	  var last = +new Date();
	  var tick = function() {
	    e.style.opacity = +e.style.opacity + (new Date() - last) / 1000;
	    last = +new Date();

	    if (e.style.opacity < 1) {
	      (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
	    }
	  };

	  tick();

    e.innerHTML = r[count];
    count < statementsData.length - 1 ? count++ : count = 0;
}

changeText();
setInterval(changeText,3000);
