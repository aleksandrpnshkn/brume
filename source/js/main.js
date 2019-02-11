'use strict';

;(function($) {
  var dom = {
    $portfolio: $('.portfolio'),
    $intro: $('.intro'),
    $menu: $('.menu')
  };

  (function showHidden() {
    $('.switches').removeClass('hidden');
    $('.controls').removeClass('hidden');
    $('.video__controls').removeClass('hidden');
    $('.video__overlay').removeClass('hidden');
  })();

  (function menu() {
    var $btn = $(".menu__toggle", dom.$menu);

    $btn.click(function(e) {
      e.preventDefault();
      $btn.toggleClass('menu__toggle--off');
    });
  })();

  (function() {
    var $portfolioLinks = $('.portfolio__slide-link');

    $portfolioLinks.click(function(e) {
      e.preventDefault();
    });
  })();

  svg4everybody();
})(jQuery);
