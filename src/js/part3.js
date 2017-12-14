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


$("#SalesforceTower").on("click",function(){
  console.log("CLICK");
});

console.log(flyover_info);

flyover_info.forEach(function(d,dIDX){
  console.log(d.Id);
  if (d.Id){
    document.getElementById(d.Id).addEventListener("mouseenter", function( event ) {
      event.target.addClass("highlight");
      console.log("HERE");
    });
  };
});
