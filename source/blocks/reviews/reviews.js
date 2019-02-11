'use strict';

;(function($, Carousel, Switches, utils) {
  var $reviews = $('.reviews');

  var $carousel = $('.carousel', $reviews);
  var $switches = $('.switches', $carousel);

  function ReviewsCarousel($carousel, $switches) {
    Carousel.call(this, $carousel, $switches);

    var _this = this;

    _this.dom.$overlayBtns = $('.reviews__item-overlay', _this.$el);

    _this.states.prev = 'reviews__item--prev';
    _this.states.next = 'reviews__item--next';

    _this.controls = {
      switches: new Switches($switches)
    };
    _this.controls.switches.handler = function(idx) {
      _this.changeSlide(idx);
    };
    _this.controls.switches.handle();

    _this.dom.$overlayBtns.each(function(idx, btn) {
      $(btn).click(function(e) {
        e.preventDefault();
        _this.changeSlide(idx);
      })
    });

    _this.changeSlide = function(idx) {
      //Поменять модификаторы для боковых кнопок
      var $newPrev = (idx > 0) ? _this.dom.$items.eq(idx - 1) : null;
      var $oldPrev = _this.active.$el.prev();
      utils.changeState(_this.states.prev, $newPrev, $oldPrev);

      var $newNext = _this.dom.$items.eq(idx + 1);
      var $oldNext = _this.active.$el.next();
      utils.changeState(_this.states.next, $newNext, $oldNext);

      Carousel.prototype.changeSlide.call(_this, idx);
      //Переключить switches
      _this.controls.switches.changeActive(idx);
    }

    _this.init();
  }

  ReviewsCarousel.prototype = Object.create(Carousel.prototype);

  var carousel = new ReviewsCarousel($carousel, $switches);

})(jQuery, Carousel, Switches, utils);
