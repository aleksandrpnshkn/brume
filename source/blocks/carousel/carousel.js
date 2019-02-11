'use strict';

;(function($, utils, media) {

  function Carousel($carousel) {
    var _this = this;

    _this.$el = $carousel;

    _this.dom = {
      $container: $('.carousel__container', _this.$el),
      $items: $('.carousel__item', _this.$el)
    };

    _this.states = {
      active: 'carousel__item--active'
    };

    //Активный элемент
    _this.active = {
      $el: _this.dom.$items.eq(0),
      idx: 0
    };

    _this.sizes = {
      width: null,
      //height: null
    };

    _this.slideShow = {
      timeout: null,
      interval: null
    };
  }

  Carousel.prototype.move = function(idx) {
    var idx = idx || 0;
    var width = this.sizes.width;
    this.dom.$container.css('left', function() {
      return -width * idx + 'px';
    });
  };

  Carousel.prototype.refreshSizes = function() {
    this.sizes.width = this.$el.width();
    //this.sizes.height = this.dom.$container.height()
  };

  Carousel.prototype.changeSlide = function(idx) {
    if (idx === -1) return;
    if (idx >= this.dom.$items.length) return;

    var $newSlide = this.dom.$items.eq(idx);
    if ($newSlide.length === 0) return; //Многовато проверок

    utils.changeState(this.states.active, $newSlide, this.active.$el);

    this.active.$el = $newSlide;
    this.active.idx = idx;

    this.move(idx);
  };

  Carousel.prototype.startSlideShow = function(time) {
    var _this = this;
    var time = time || 5000;

    clearInterval(_this.slideShow.interval);
    _this.slideShow.interval = setInterval(function() {
      var idx = _this.active.idx + 1;
      if (idx >= _this.dom.$items.length) {
        idx = 0;
      }
      _this.changeSlide(idx);
    }, time);
  };

  Carousel.prototype.stopSlideShow = function() {
    clearInterval(this.slideShow.interval);
    clearTimeout(this.slideShow.timeout);
    this.slideShow.timeout = setTimeout(
      this.startSlideShow.bind(this)
    , 15000);
  };

  //Метод для обновления слайдера при ресайзе, фильтрации и т.д
  Carousel.prototype.refresh = function() {
    this.refreshSizes();
    this.changeSlide(0);
  };

  Carousel.prototype.init = function() {
    this.refresh();
    //Обновлять на брекпоинтах
    media.onchange(this.refresh.bind(this));
  };

  window.Carousel = Carousel;
})(jQuery, utils, media);
