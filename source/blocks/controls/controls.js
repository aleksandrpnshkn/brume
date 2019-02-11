'use strict';

;(function(){
  //Кнопки prev next
  function Controls($controls) {
    var _this = this;

    //_this.$el = $controls;

    _this.dom = {
      $prev: $('.controls__prev', $controls),
      $next: $('.controls__next', $controls)
    };

    //Описать обработчики
    _this.handlers = {
      prev: function() { console.error('Не переопределен'); },
      next: function() { console.error('Не переопределен'); }
    }

    //Навесить обработчики
    _this.handle = function() {
      _this.dom.$prev.click(_this.handlers.prev);
      _this.dom.$next.click(_this.handlers.next);
    };
  }

  window.Controls = Controls;
})();
