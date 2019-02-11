'use strict';

;(function() {

  function Media() {
    var _this = this;

    //Текущее устройство
    _this.status = '';

    _this.breakpoint = {
      tablet: window.matchMedia('(min-width: 768px'),
      desktop: window.matchMedia('(min-width: 1360px')
    };

    //Добавляет обработчики на событие брекпоинта
    _this.onchange = function(changeHandler) {
      _this.breakpoint.tablet.addListener(changeHandler);
      _this.breakpoint.desktop.addListener(changeHandler);
    };

    //Сохранить текущее состояние для проверки функциями
    _this.changeStatus = function() {
      _this.status = 'mobile';
      if (_this.breakpoint.tablet.matches) _this.status = 'tablet';
      if (_this.breakpoint.desktop.matches) _this.status = 'desktop';
    };

    _this.init = (function(_this) {
      _this.changeStatus();
      //Обновлять status при изменении ширины экрана
      _this.onchange(_this.changeStatus);
    })(_this);
  }

  window.media = new Media();
})();
