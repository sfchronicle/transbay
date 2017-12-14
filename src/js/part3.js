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
