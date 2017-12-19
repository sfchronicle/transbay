require("./lib/social"); //Do not delete
require('image-slider');

var viewer = {};
audio_info.forEach(function(d,dIDX){
  viewer[dIDX] = PhotoSphereViewer({
    container: 'panorama'+dIDX,
    panorama: d.Photo,
    default_fov: 90,
    time_anim: false,
    navbar: [
      'autorotate',
      'zoom',
      'caption',
      'fullscreen'
    ],
    default_long: +d.Lon,//d.Lon
    default_lat: 0//d.Lat,
  });
});

flyover_info.forEach(function(d,dIDX){
  if (d.Id){
    document.getElementById(d.Id).addEventListener("mouseenter", function( event ) {
      document.getElementById("flyover-text").innerHTML = "<div class='name'>"+d.Title+"</div><div class='address'>"+d.Address+"</div><div class='description'>"+d.Description+"</div><div class='timeline'>"+d.Timeline+"</div>";
    });
    document.getElementById(d.Id).addEventListener("mouseout", function( event ) {
      document.getElementById("flyover-text").innerHTML = "";
    });
  };
});

if (screen.width <= 480) {
  var mapHeight = document.getElementById("audio-map").offsetHeight;
  $("#audio-placeholder-mobile").css("height",mapHeight+"px");
}

var prevPDX = -1;
$(window).scroll(function(){

  var pos = $(this).scrollTop();
  var top_pos = $("#stick-here").offset().top-37;
  var bottom_pos = $("#stop-stick").offset().top - 450;

  if(pos <= top_pos) {
    if (screen.width <= 480) {
      $("#audio-placeholder-mobile").css("display","none");
    }
    $('#audio-map').removeClass("fixedmap");
    for (var idx=1; idx<audio_info.length; idx++){
      drawLine("#PATH"+idx,0);
    };
  }
  if(pos > top_pos) {
    $('#audio-map').addClass("fixedmap");
    // check to see where you are along paths
    audio_info.forEach(function(p,pdx){
      if (pdx == 0){
        var SectionStart = $('#audiotour'+pdx).offset().top-200;
      } else {
        var SectionStart = $('#audiotour'+pdx).offset().top-100;
      }
      if (pdx<audio_info.length-1){
        var SectionEnd = $('#audiotour'+(pdx+1)).offset().top-100;
      } else {
        var SectionEnd = bottom_pos;
      }
      if (pos > SectionStart && pos < SectionEnd) {
        if (screen.width <= 480) {
          $("#audio-placeholder-mobile").css("display","block");
        }
        var scrollPercentage = 1-(SectionEnd-pos)/(SectionEnd-SectionStart);
        var num = pdx+1;
        document.getElementById("audio-textbox").innerHTML = audio_info[pdx].Location;
        if (prevPDX != pdx){
          viewer[pdx].startAutorotate();
        }
        if (num < audio_info.length){
          drawLine("#PATH"+num,scrollPercentage);
        }
        prevPDX = pdx;
      }
    });
  }
  if (pos > bottom_pos) {
    // if (screen.width <= 480) {
    //   $("#audio-placeholder-mobile").css("display","none");
    // }
    $('#audio-map').removeClass("fixedmap");
    for (var idx=1; idx<audio_info.length; idx++){
      drawLine("#PATH"+idx,1)
    };
  }

});


function drawLine(pathName,scrollPercentage){
  // Get a reference to the <path>
  var path = document.querySelector(pathName).getElementsByTagName("polyline")[0];

  // Get length of path
  try {
    var pathLength = path.getTotalLength();
  }
  catch(d) {
    var pathLength = 0;
    var prevPos;
    for (var i = 0 ; i < path.points.numberOfItems;i++) {
      var pos = path.points.getItem(i);
      if (i > 0) {
          pathLength += Math.sqrt(Math.pow((pos.x - prevPos.x), 2) + Math.pow((pos.y - prevPos.y), 2));
      }
      prevPos = pos;
    }
  }


  // Make very long dashes (the length of the path itself)
  path.style.strokeDasharray = pathLength + ' ' + pathLength;

  // Offset the dashes so the it appears hidden entirely
  path.style.strokeDashoffset = pathLength;
  path.getBoundingClientRect();

  // Length to offset the dashes
  var drawLength = pathLength * scrollPercentage;

  // Draw in reverse
  path.style.strokeDashoffset = pathLength - drawLength;

  // When complete, remove the dash array, otherwise shape isn't quite sharp
 // Accounts for fuzzy math
  if (scrollPercentage >= 0.99) {
    path.style.strokeDasharray = "none";

  } else {
    path.style.strokeDasharray = pathLength + ' ' + pathLength;
  }
}
