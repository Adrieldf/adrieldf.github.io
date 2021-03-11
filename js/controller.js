function test() {
  alert("foi");
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

$(window).on("load", function () {
  // $(".bg").attr("background-image", 'url("../wallpapers/wallpaper0'+ this.getRndInteger(0,5) + '.jpg");');
  $("#loaderWrapper").hide();
});
$(document).ready(function () {
  var images = ['./wallpapers/wallpaper00.jpg',
    './wallpapers/wallpaper01.jpg',
    './wallpapers/wallpaper02.jpg',
    './wallpapers/wallpaper03.jpg',
    './wallpapers/wallpaper04.jpg'];

  var randomNumber = Math.floor(Math.random() * images.length);
  var bgImg = 'url(' + images[randomNumber] + ')';

  $('body').css({
    'background': bgImg,
    'height': '100%',
    'background-position': 'center',
    'background-repeat': 'no-repeat',
    'background-size': 'cover'
  });

});