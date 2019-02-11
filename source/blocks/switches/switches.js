'use strict';

;(function() {

  function Switches($switches) {
    var _this = this;

    _this.$el = $switches;

    _this.$items = $('.switches__btn', _this.$el);

    _this.states = {
      active: 'switches__btn--active'
    };

    _this.$active = _this.$items.eq(0);
    _this.$active.addClass(_this.states.active);

    _this.handler = function() { console.error('Нет обработчика'); };
  }

  Switches.prototype.changeActive = function(idx) {
    var $newBtn = this.$items.eq(idx);
    window.utils.changeState(this.states.active, $newBtn, this.$active);
    this.$active = $newBtn;
  };

  Switches.prototype.handle = function() {
    var handler = this.handler;

    this.$items.each(function(idx, btn) {
      $(btn).click(function() {
        handler(idx);
      });
    });
  };

  window.Switches = Switches;
})();
