$(window).scroll(function(){

    var pos = $(this).scrollTop();
    var top_pos = $('#sticky-map-top').offset().top-100;
    var bottom_pos = $('#sticky-map-bottom').offset().top;
    var mapHeight = $("#scroll-png").height();

    var inc = mapHeight/5; //how often we should see new map element
    if(pos >= top_pos) {
        $('.floor-info').css("display","none");
    }
    if(pos > top_pos) {
      $('.floor-info').css("display","block");
      var idx = Math.round((pos-top_pos)/inc);
      if (idx < 5 && idx >= 0) {
        var inc_new = inc*idx+20;
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
