function test() {
  alert("foi");
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function setWallpaper(lastNumber) {
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
    'background-size': 'cover',
    '-webkit-transition': 'background-image 0.6s ease-in-out',
    'transition': 'background-image 0.6s ease-in-out'
  });
  setTimeout(setWallpaper, 6000);
}

$(window).on("load", function () {
  $("#loaderWrapper").hide();
});
$(document).ready(function () {
  setWallpaper();
});