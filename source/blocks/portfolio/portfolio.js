'use strict';

;(function($, Carousel, Controls, utils, media) {

  function PortfolioCarousel($carousel, $controls) {
    Carousel.call(this, $carousel);

    var _this = this;

    _this.controls = new Controls($controls);
    _this.controls.handlers = {
      prev: function() {
        _this.changeSlide(_this.active.idx - 1);
      },
      next: function() {
        _this.changeSlide(_this.active.idx + 1);
      }
    };
    _this.controls.handle();

    _this.changeStructure = function() {
      var device = media.status;

      if (device === 'desktop') {
        //Если уже изменена - ничего не делать
        if ($('.portfolio__group', _this.$el).length > 0) return;

        var $group = $([]); //Массив для 4ех слайдов

        _this.dom.$items
          .removeClass('carousel__item')
          .each(function(i, item) {
            $group.push(item);

            //На каждый четвертый слайд оборачивать слайды из group
            if ($group.length === 4 || i == _this.dom.$items.length - 1) {
              $group.wrapAll('<div class="portfolio__group carousel__item"></div>');
              $group = $([]);
            }
          });

        //Обновить элементы в dom.$items
        _this.dom.$items = $('.carousel__item', _this.$el);
        //Добавить состояние активному элементу
        _this.$active = _this.dom.$items
          .eq(0)
          .addClass('carousel__item--active');
      } else {
        //Проверить изменена ли структура
        if ($('.portfolio__group', _this.$el).length === 0) return;

        //_this.dom.$items = $('portfolio__slide', _this.$el)
        _this.dom.$items.unwrap().addClass('carousel__item');
      }
    };

    _this.refresh = function() {
      Carousel.prototype.refresh.call(this);
      _this.dom.$items = $('.portfolio__slide');
      _this.changeStructure();
    }

    _this.init = (function(_this) {
      Carousel.prototype.init.call(_this);
      _this.changeStructure();
    })(_this);
  }

  PortfolioCarousel.prototype = Object.create(Carousel.prototype);


  var $portfolio = $('.portfolio');

  var $carousel = $('.carousel', $portfolio);
  var $controls = $('.controls', $portfolio);

  var carousel = new PortfolioCarousel($carousel, $controls);

  var $filters = $('.portfolio__filter', $portfolio);
  var $container = $('.carousel__container', $portfolio);
  var $items = $('.portfolio__slide', $portfolio);

  function fixFilterWidth() {
    $filters = $filters || $('.portfolio__filter');

    if (media.status === 'desktop') {
      //Зафиксировать ширину строк для фильтров
      $filters.each(function(i, filter) {
        var $filter = $(filter);
        $filter.width($filter.width() + 12);
      });
      return;
    }

    $filters.each(function(i, filter) {
      $(filter).width('auto');
    });
  }
  fixFilterWidth();
  media.onchange(fixFilterWidth);

  //Обработчики на фильтры
  $filters.click(function(e) {
    e.preventDefault();
    var $this = $(this);
    var state = 'portfolio__filter--active';

    var type = $this.data().filter;
    var $filtered;
    if (type === 'all') {
      $filtered = $items;
    } else {
      $filtered = $items.clone().filter('[data-filter="' + type + '"]');
    }

    $container.empty().append($filtered);
    carousel.refresh();

    //Стиль
    var $prevFilter = $filters.filter('.' + state);
    utils.changeState(state, $this, $prevFilter);
  });

})(jQuery, Carousel, Controls, utils, media);
