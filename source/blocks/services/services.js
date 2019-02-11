'use strict';

;(function($, utils) {
  var $services = $('.services');

  var $tabs = $('.services__tab', $services);
  var $tabsLink = $('.services__link', $services);
  var $tabsContent = $('.services__content', $services);

  var activeIdx = $tabs.filter('.services__tab--active').data('index');

  //Обработчики для переключению вкладок
  $tabsLink.click(function(e) {
    e.preventDefault();
    var $newTab = $(this).parent();
    var $newIdx = $newTab.data('index');

    if ($newIdx === activeIdx) return;

    var $newContent = $tabsContent.eq($newIdx);
    var $prevTab = $tabs.eq(activeIdx);
    var $prevContent = $tabsContent.eq(activeIdx);

    //Смена вкладки с анимацией
    $prevContent.fadeOut(150, function() {
      utils.changeState('services__tab--active', $newTab, $prevTab);
      $newContent.fadeIn(150);
      utils.changeState('services__content--active', $newContent, $prevContent);

      activeIdx = $newIdx;
    });
  });
})(jQuery, utils);
