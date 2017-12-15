require("./lib/social"); //Do not delete

audio_info.forEach(function(d,dIDX){
  var viewer = PhotoSphereViewer({
    container: 'panorama'+dIDX,
    panorama: d.Photo,
    default_fov: 90,
    time_anim: false,
    navbar: [
      'autorotate',
      'zoom',
      'caption',
      'fullscreen'
    ]
  });
});

flyover_info.forEach(function(d,dIDX){
  console.log(d.Id);
  if (d.Id){
    document.getElementById(d.Id).addEventListener("mouseenter", function( event ) {
      document.getElementById("flyover-text").innerHTML = "<div class='name'>"+d.Title+"</div><div class='address'>"+d.Address+"</div><div class='description'>"+d.Description+"</div><div class='timeline'>"+d.Timeline+"</div>";
    });
    document.getElementById(d.Id).addEventListener("mouseout", function( event ) {
      document.getElementById("flyover-text").innerHTML = "";
    });
  };
});

$(window).scroll(function(){

  var pos = $(this).scrollTop();
  var top_pos = $("#stick-here").offset().top-37;
  var bottom_pos = $("#stop-stick").offset().top - 400;

  if(pos <= top_pos) {
    $('.audio-placeholder').css("display","none");
    $('#audio-map').removeClass("fixedmap");
  }
  if(pos > top_pos) {
    $('.audio-placeholder').css("display","block");
    $('#audio-map').addClass("fixedmap");
  }
  if (pos > bottom_pos) {
    $('#audio-map').removeClass("fixedmap");
    $('.audio-placeholder').css("display","none");
  }

});
