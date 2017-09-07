require("./lib/social"); //Do not delete
// require("d3");
// require("d3.chart");
// var Sankey = require('./lib/d3.chart.sankey');


// -----------------------------------------------------------------------------
// ANIMATIONS variables
// -----------------------------------------------------------------------------

var timeoutTime = 500;
var fadeTime = 300;
var timer;

// ----------------------------------------------------------------------------
// PARK animations --------------------------------------------------
// -----------------------------------------------------------------------------

var parkFloor = $("#overlay-floor3");
var iPark = -1;
var park_urls = ["transitcenter_PARKARROWS.png","transitcenter_PARKTEXTNOARROWS.png"].map(s => "../assets/graphics/" + s);

//callback
var swap_park = function() {
  parkFloor.fadeOut(fadeTime, function() {
    iPark = (iPark + 1) % park_urls.length; // hello modulo, my old friend
    parkFloor.attr("src", park_urls[iPark]);
    parkFloor.one("load", function() {
      parkFloor.fadeIn(fadeTime, () => setTimeout(swap_park, timeoutTime));
    });
  })
};

// -----------------------------------------------------------------------------
// BUS animations --------------------------------------------------
// -----------------------------------------------------------------------------

var busFloor = $("#overlay-floor2");
var iBus = -1;
var bus_urls = ["transitcenter_BUSARROWS3.png","transitcenter_BUSARROWS2.png","transitcenter_BUSARROWS1.png"].map(s => "../assets/graphics/" + s);

//callback
var swap_bus = function() {
  busFloor.fadeOut(fadeTime, function() {
    iBus = (iBus + 1) % bus_urls.length; // hello modulo, my old friend
    busFloor.attr("src", bus_urls[iBus]);
    busFloor.attr("z-index","100");
    busFloor.one("load", function() {
      busFloor.fadeIn(fadeTime, () => setTimeout(swap_bus, timeoutTime));
    });
  })
};

// -----------------------------------------------------------------------------
// MEZZANINE animations --------------------------------------------------
// -----------------------------------------------------------------------------

var mezFloor = $("#overlay-floor1");
var iMez = -1;
var mez_urls = ["transitcenter_MEZZANINEARROWS.png","transitcenter_MEZZANINETEXTNOARROWS.png"].map(s => "../assets/graphics/" + s);

//callback
var swap_mez = function() {
  mezFloor.fadeOut(fadeTime, function() {
    iMez = (iMez + 1) % mez_urls.length; // hello modulo, my old friend
    mezFloor.attr("src", mez_urls[iMez]);
    mezFloor.attr("z-index","100");
    mezFloor.one("load", function() {
      mezFloor.fadeIn(fadeTime, () => setTimeout(swap_mez, timeoutTime));
    });
  })
};

// -----------------------------------------------------------------------------
// GROUND animations --------------------------------------------------
// -----------------------------------------------------------------------------

var groundFloor = $("#overlay-floor0");
var iGround = -1;
var ground_urls = ["transitcenter_GROUNDARROWS.png","transitcenter_GROUNDTEXTNOARROWS.png"].map(s => "../assets/graphics/" + s);

//callback
var swap_ground = function() {
  groundFloor.fadeOut(fadeTime, function() {
    iGround = (iGround + 1) % ground_urls.length; // hello modulo, my old friend
    groundFloor.attr("src", ground_urls[iGround]);
    groundFloor.attr("z-index","100");
    groundFloor.one("load", function() {
      groundFloor.fadeIn(fadeTime, () => setTimeout(swap_ground, timeoutTime));
    });
  })
};


// timeline event listeners ----------------------------------------------------------------

var timelineOpen = 0;
var timeline_top;
var timeline_ticker;
var timeline_bottom;
var timeline_close;

// show the timeline on button click
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

// hide the timeline on button click
document.getElementById("close-timeline-button").addEventListener("click",function() {
  document.getElementById("timeline-wrapper").classList.remove("view");
  timelineOpen = 0;
  document.getElementById('timeline-top-border').scrollIntoView();
  // var top = $('#timeline-top-border').offset().top;
  // $('html,body').animate({scrollTop: top}, 1000);
  timeline_ticker.classList.remove('sticky');
  timeline_ticker.style.display = "none";
  timeline_close.classList.remove('sticky');
  timeline_close.style.display = "none";
},false);


// on scroll, run the activate function ----------------------------------------

window.onscroll = function() {activate()};

// desktop scrolling controls ----------------------------------------------------------------

// we are not using this but I'm keeping it for now in case I need it
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

// setting scrolly interactive variables

var IDXprev = -1;

if (screen.width <= 480) {
  // we are zooming on mobile
  var floorZoom = "160%";
  var zoomMult = 1.6;
  var zoomOffset = 450;
} else {
  // we are not zooming on desktop
  var floorZoom = "100%";
  var zoomMult = 1;
  var zoomOffset = 250;
}

var lastScrollTop = document.body.scrollTop;
var direction;
var swapPark = 0, swapBus = 0, swapMez = 0, swapGround = 0;
var circle = document.getElementById("highlightCircle");
var circleFlag, circleTop, circleLeft;

// this is the monster scrolling function
function activate() {

  // general scrolling position and direction ----------------------------
  var window_top = document.body.scrollTop;//getPageScroll();//
  if (window_top > lastScrollTop) {
    direction = "down";
  } else {
    direction = "up";
  }
  lastScrollTop = window_top;

  // scrolling commands for interactive graphic ----------------
  var sticker_start = document.getElementById('stick-here').getBoundingClientRect().top + window_top-37;
  var sticker_stop = document.getElementById('stop-stick-here').getBoundingClientRect().top + window_top;

  // loop through the floors to see which one we are in and display appropriate layers etc

  // initialize circle highlight to be hidden, in case we're not in the image section
  circleFlag = 0;

  // starting the loop
  for (var s = 0; s < floorplanData.stages.length; s++ ) {

    // placeholder for each section for when we take top image out of the page
    var sticker_ph = document.getElementById('stick-ph'+s);

    // how big the placeholder is (the top image)
    var placeholderHeight = document.getElementById('floor'+s).clientHeight;
    var placeholderWidth = document.getElementById('floor'+s).clientWidth;

    // top of section
    var showf = document.getElementById("showfloor"+s);
    var f_top = showf.getBoundingClientRect().top + window_top - 37;
    var f_bottom = showf.getBoundingClientRect().bottom + window_top;

    // fixed image at top of section
    var f = document.getElementById("floor"+s);

    // start of zooming part of section
    var zoomf = document.getElementById("zoom-floor"+s);

    // where to start zooming
    var zoomf_top = zoomf.getBoundingClientRect().top + window_top - 37 - zoomOffset;

    // image that we're going to fix at the top
    var floorImg = document.getElementById("background-floor"+s);

    // overlay image that we are going to swap out to show arrows
    var overlayDiv = document.getElementById("overlay-floor"+s);

    // we are in a section of the interactive, above the bottom and below the top
    if (window_top >= f_top && window_top <= f_bottom) {

      // console.log("we are in the interactive");
      f.classList.add('fixed');
      sticker_ph.style.height = placeholderHeight+"px";
      sticker_ph.style.display = 'block';
      IDXprev = s;

      // at the bottom of a section, un-zoom the image but keep it visible and sticky
      if ((window_top + 350) > f_bottom){
        // console.log("at the bottom of a section, unzooming but keeping it visible and sticky");
        floorImg.style.opacity = "1";
        floorImg.style.visibility = "visible";
        floorImg.style.width  = "100%";
        floorImg.style.marginLeft = "0px";

        overlayDiv.style.opacity = "1";
        overlayDiv.style.marginLeft = "0px";

      // going through the images part of a section: zoom & pan image
      } else if (window_top > zoomf_top){
        console.log("in the middle of a section, zooming and panning");

        // show the background image and zoom it (on mobile only)
        floorImg.style.opacity = "1";
        floorImg.style.width = floorZoom;

        // hide the overlay
        overlayDiv.style.opacity = "0";
        overlayDiv.style.visibility  = "hidden";

        // show the highlight circle
        circleFlag = 1;

        // on mobile, we want to zoom & pan the image and move the highlight up and down a little
        if (screen.width <= 480) {

          // was thinking about using this as a variable but not actually using it
          var panDiff = (zoomMult-1)*screen.width;

          // which image are we showing in the image sequence
          var testIDX = Math.min(Math.max(Math.floor((window_top - zoomf_top)/1000),0),floorplanData["stages"][s]["images"].length-1);

          // finding the left percent for that image
          var leftNum = +floorplanData["stages"][s]["images"][testIDX]["LeftPercent"]*zoomMult;

          // the feature is on the left side of the image
          if (leftNum <= 0.5) {
            console.log("feature is on left");
            var scrollLeft = (0.5 - leftNum)*placeholderWidth-20;//-20/zoomMult;
            circleTop = floorplanData["stages"][s]["images"][testIDX]["TopPercent"]*placeholderHeight+5*zoomMult;//*zoomMult;//*zoomMult;

          // the feature is on the right side of the image
          } else {
            console.log("feature is on right");
            var scrollLeft = -(leftNum - 0.5)*placeholderWidth-30;
            circleTop = floorplanData["stages"][s]["images"][testIDX]["TopPercent"]*placeholderHeight+5*zoomMult;//*zoomMult;//*zoomMult;//*zoomMult;
          }

          // apply the panning to the image and overlay
          floorImg.style.marginLeft = scrollLeft+ 'px';
          overlayDiv.style.marginLeft = scrollLeft+ 'px';

        } else {
          // find the image that we are showing in the image sequence
          var testIDX = Math.min(Math.max(Math.floor((window_top - zoomf_top)/600),0),floorplanData["stages"][s]["images"].length-1);

          // compute how to move the circle to center on the feature
          circleTop = floorplanData["stages"][s]["images"][testIDX]["TopPercent"]*placeholderHeight;
          circleLeft = floorplanData["stages"][s]["images"][testIDX]["LeftPercent"]*placeholderWidth;
        }

      // at the top of the image, showing the overlays and no zoom and no pan
      } else {
        // console.log("at top of section, showing overlays, no zoom, no pan");

        // activate correct overlays
        if ((s == 3) && (swapPark != 1)) {
          console.log("loop park overlays");
          setTimeout(swap_park, timeoutTime);
          swapPark = 1;
        } else if ((s == 2) && (swapBus != 1)) {
          console.log("loop bus overlays");
          setTimeout(swap_bus, timeoutTime);
          swapBus = 1;
        } else if ((s == 1) && (swapMez != 1)) {
          console.log("loop mezzanine overlays");
          setTimeout(swap_mez, timeoutTime);
          swapMez = 1;
        } else if ((s == 0) && (swapGround != 1)) {
          console.log("loop ground overlays");
          setTimeout(swap_ground, timeoutTime);
          swapGround = 1;
        }

        // showing the main image and unzooming and unpanning it
        floorImg.style.opacity = "1";
        floorImg.style.width  = "100%";
        floorImg.style.marginLeft = "0px";

        // showing the overlay and unzooming and unpanning it
        overlayDiv.style.opacity = "1";
        overlayDiv.style.width  = "100%";
        overlayDiv.style.marginLeft = "0px";
        overlayDiv.style.visibility  = "visible";
      }

    // we are not in the interactive
    } else {
      // do not want to show the images
      floorImg.style.opacity = "0";
      overlayDiv.style.opacity = "0";
    }

    // we are not in the interactive yet, everything should have position relative, no zooming, no overlays, no margins
    if ((window_top < sticker_start) || (window_top >= sticker_stop)) {
      f.classList.remove('fixed');
      sticker_ph.style.display = 'none';
      floorImg.style.width  = "100%";
      floorImg.style.marginLeft = "0px";
      overlayDiv.style.width  = "100%";
      overlayDiv.style.marginLeft = "0px";
      overlayDiv.style.visibility = "hidden";

      // not showing the highlight circle
      circleFlag = 0;
    }
    // we want to show the top image at the top
    if (window_top < sticker_start) {
      floorImg.style.opacity = "1";
    }
    // NOTE: showing the image at the bottom doesn't work because the relative position is above where you would see it as a reader
  };

  // checking to see if we are displaying the circle and applying styles
  if (circleFlag == 1) {

    // we are showing the highlight
    circle.style.opacity = "1";

    // we want to center the circle for mobile and move around the graphic
    if (screen.width <= 480) {
      circle.style.top = circleTop+"px";
      circle.style.right = "0";
      circle.style.left = "0";

    // we want to move the circle around on desktop
    } else {
      circle.style.left = circleLeft+"px";
      circle.style.top = circleTop+"px";
    }
  } else {
    // we are hiding the highlight
    circle.style.opacity = "0";
  }

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


// flow chart for financial data ---------------------------------------------------
//
//
// var units = "Widgets";
//
// // set the dimensions and margins of the graph
// var margin = {top: 10, right: 10, bottom: 10, left: 10},
//     width = 700 - margin.left - margin.right,
//     height = 300 - margin.top - margin.bottom;
//
// // format variables
// var formatNumber = d3.format(",.0f"),    // zero decimal places
//     format = function(d) { return formatNumber(d) + " " + units; },
//     color = d3.scaleOrdinal(d3.schemeCategory20);
//
// // append the svg object to the body of the page
// var svg = d3.select("#flowchart").append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//   .append("g")
//     .attr("transform",
//           "translate(" + margin.left + "," + margin.top + ")");
//
// // Set the sankey diagram properties
// var sankey = d3.sankey()
//     .nodeWidth(36)
//     .nodePadding(40)
//     .size([width, height]);
//
// var path = sankey.link();
//
// // load the data
// d3.csv("sankey.csv", function(error, data) {
//
//   //set up graph in same style as original example but empty
//   graph = {"nodes" : [], "links" : []};
//
//   data.forEach(function (d) {
//     graph.nodes.push({ "name": d.source });
//     graph.nodes.push({ "name": d.target });
//     graph.links.push({ "source": d.source,
//                        "target": d.target,
//                        "value": +d.value });
//    });
//
//   // return only the distinct / unique nodes
//   graph.nodes = d3.keys(d3.nest()
//     .key(function (d) { return d.name; })
//     .object(graph.nodes));
//
//   // loop through each link replacing the text with its index from node
//   graph.links.forEach(function (d, i) {
//     graph.links[i].source = graph.nodes.indexOf(graph.links[i].source);
//     graph.links[i].target = graph.nodes.indexOf(graph.links[i].target);
//   });
//
//   // now loop through each nodes to make nodes an array of objects
//   // rather than an array of strings
//   graph.nodes.forEach(function (d, i) {
//     graph.nodes[i] = { "name": d };
//   });
//
//   sankey
//       .nodes(graph.nodes)
//       .links(graph.links)
//       .layout(32);
//
//   // add in the links
//   var link = svg.append("g").selectAll(".link")
//       .data(graph.links)
//     .enter().append("path")
//       .attr("class", "link")
//       .attr("d", path)
//       .style("stroke-width", function(d) { return Math.max(1, d.dy); })
//       .sort(function(a, b) { return b.dy - a.dy; });
//
//   // add the link titles
//   link.append("title")
//         .text(function(d) {
//     		return d.source.name + " → " +
//                 d.target.name + "\n" + format(d.value); });
//
//   // add in the nodes
//   var node = svg.append("g").selectAll(".node")
//       .data(graph.nodes)
//     .enter().append("g")
//       .attr("class", "node")
//       .attr("transform", function(d) {
// 		  return "translate(" + d.x + "," + d.y + ")"; })
//       .call(d3.drag()
//         .subject(function(d) {
//           return d;
//         })
//         .on("start", function() {
//           this.parentNode.appendChild(this);
//         })
//         .on("drag", dragmove));
//
//   // add the rectangles for the nodes
//   node.append("rect")
//       .attr("height", function(d) { return d.dy; })
//       .attr("width", sankey.nodeWidth())
//       .style("fill", function(d) {
// 		  return d.color = color(d.name.replace(/ .*/, "")); })
//       .style("stroke", function(d) {
// 		  return d3.rgb(d.color).darker(2); })
//     .append("title")
//       .text(function(d) {
// 		  return d.name + "\n" + format(d.value); });
//
//   // add in the title for the nodes
//   node.append("text")
//       .attr("x", -6)
//       .attr("y", function(d) { return d.dy / 2; })
//       .attr("dy", ".35em")
//       .attr("text-anchor", "end")
//       .attr("transform", null)
//       .text(function(d) { return d.name; })
//     .filter(function(d) { return d.x < width / 2; })
//       .attr("x", 6 + sankey.nodeWidth())
//       .attr("text-anchor", "start");
//
//   // the function for moving the nodes
//   function dragmove(d) {
//     d3.select(this)
//       .attr("transform",
//             "translate("
//                + d.x + ","
//                + (d.y = Math.max(
//                   0, Math.min(height - d.dy, d3.event.y))
//                  ) + ")");
//     sankey.relayout();
//     link.attr("d", path);
//   }
// });
