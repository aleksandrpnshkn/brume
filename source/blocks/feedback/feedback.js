'use strict';

;(function($) {
  var $feedback = $('.feedback');

  var $form = $('.form', $feedback);

  var $name = $('[name="name"]', $form);
  var $phone = $('[name="phone"]', $form);
  var $email = $('[name="email"]', $form);

  $form.submit(function(e) {
    e.preventDefault();

    var data = new FormData(this);

    var value = {
      name: $name.val().trim(),
      phone: $phone.val().trim(),
      email: $email.val().trim()
    };

    //Немного проверок
    if (!/^[a-zа-я ]*$/i.test(value.name)) return;
    if (!/^[\d() -_]*$/.test(value.phone)) return;
    if (value.email && !value.email.includes('@')) return;

    $.ajax({
      url: 'page.php',
      data: data,
      type: 'post',
      processData: false,
      contentType: false
    })
      .done(function() {
        console.log('Успешно');
      })
      .fail(function(xhr, status, err) {
        console.log('Ошибка: ' + err);
        console.log('Статус: ' + status);
        console.log(xhr);
      })
      .always(function() {
        console.log('Обработка реквеста закончена');
      });
  })
})(jQuery);
