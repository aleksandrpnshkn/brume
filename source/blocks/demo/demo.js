'use strict';

;(function() {
  var $demo = $('.demo');

  var $video = $('.video', $demo);
  var $overlay = $('.video__overlay', $video);
  var $controls = $('.video__controls', $video)

  var video = $('.video__video', $video)[0];

  function toggleControls() {
    if (video.paused) {
      $overlay.fadeIn(200);
      $controls.fadeIn(200);
    } else {
      $overlay.fadeOut(100);
      $controls.fadeOut(100);
    }
  }

  function playHandler() {
    $video.toggleClass('.video--play');

    (video.paused) ? video.play() : video.pause();
    toggleControls();
  }

  $video.click(playHandler);
  video.addEventListener('pause', toggleControls);

  video.controls = false;
})();
