'use strict';

;(function($, Carousel, Switches, media) {

  function IntroCarousel($carousel, $switches) {
    Carousel.call(this, $carousel);

    var _this = this;

    _this.switches = new Switches($switches);
    _this.switches.handler = function(idx) {
      _this.changeSlide(idx);
      _this.stopSlideShow();
    };

    _this.startSlideShow = function(time) {
      if (media.status === 'desktop') {
        Carousel.prototype.startSlideShow.call(_this, time);
        _this.switches.$active.blur();
      }
    };

    _this.refresh = function() {
      Carousel.prototype.refresh.call(_this);
      _this.stopSlideShow();
      _this.startSlideShow();
    };

    //Дополнить родительский метод сменой состояния у кнопки
    _this.changeSlide = function(idx) {
      Carousel.prototype.changeSlide.call(this, idx);
      this.switches.changeActive(idx);
    };

    _this.init = function() {
      Carousel.prototype.init.call(this);
      _this.switches.handle();
    };
  }

  IntroCarousel.prototype = Object.create(Carousel.prototype);


  var $intro = $('.intro');

  var $carousel = $('.carousel', $intro);
  var $switches = $('.switches', $intro);

  var carousel = new IntroCarousel($carousel, $switches);
  carousel.init();

})(jQuery, Carousel, Switches, media);
