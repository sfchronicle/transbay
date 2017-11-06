console.log(interactiveData);

$(window).scroll(function(){

    var pos = $(this).scrollTop();
    var top_pos = $('#sticky-map-top').offset().top-100;
    var mapHeight = $("#scroll-png").height();

    // var inc_list = [142, 291, 465, 565, 660, 797, 913, 973, 1203];
    var inc = mapHeight/5; //how often we should see new map element
    if(pos >= top_pos) {
        $('.floor-info').css("display","none");
    }
    if(pos > top_pos) {
      $('.floor-info').css("display","block");
      var idx = Math.round((pos-top_pos)/inc);
      if (idx < 5 && idx >= 0) {
        var inc_new = inc*idx;
        var top_padding = inc_new+"px";
        // if (interactiveData[idx].Image) {
        //   var html_str = "<div class='title'>"+interactiveData[idx].Title+ "</div><div class='deck'>"+interactiveData[idx].Deck+"<div class='inset-img'><img src='"+interactiveData[idx].Image+"'></div>";
        // } else {
        //   var html_str = "<div class='title'>"+interactiveData[idx].Title+ "</div><div class='deck'>"+interactiveData[idx].Deck+"</div>";
        // }
        $(".floor").css("display","none")
        $("#floor"+idx).css("display","block")
        // $('.floor-info').html(html_str);
        $('.floor-info').css('top',top_padding);
      }
    }
  });
