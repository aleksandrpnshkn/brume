'use strict';

;(function() {
  /**
   * Переключает состояние у элементов.
   * @param {string} state - класс состояния
   * @param {jQuery} $new - новый элемент
   * @param {jQuery} $old - старый элемент, которому состояние
   * нужно убрать
   */
  function changeState(state, $new, $old) {
    if ($old) {
      $old.removeClass(state);
    }
    if ($new) {
      $new.addClass(state);
    }
  }

  window.utils = {
    changeState: changeState
  };
})();
