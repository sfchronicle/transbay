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

$(document).ready(function(e) {
	$('img[usemap]').rwdImageMaps();

	$('area').on('click', function() {
		alert($(this).attr('alt') + ' clicked');
	});
});
