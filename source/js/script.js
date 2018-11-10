var menuBtn = document.querySelector(".menu__toggle");
var video = document.querySelector(".video__image");
var videoPlay = document.querySelector(".video__play");
var videoOverlay = document.querySelector(".video__overlay");

menuBtn.addEventListener("click", function(evt) {
  evt.preventDefault();
  menuBtn.classList.toggle("menu__toggle--off");
});

videoPlay.addEventListener("click", function(evt) {
  evt.preventDefault();
  videoOverlay.classList.toggle("video__overlay--play");
});

video.addEventListener("click", function() {
  videoOverlay.classList.toggle("video__overlay--play");
});
