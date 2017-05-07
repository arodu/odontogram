$('.odontogram').odontogram();

$odontogram2 = $('#odontogram2').odontogram({
  itemSelector: '.og-quadrant > div > div'
});

$('.controls2 .init').on('click', function(){
  $odontogram2.odontogram('init');
});

$('.controls2 .destroy').on('click', function(){
  $odontogram2.odontogram('destroy');
});

$('.controls2 .lock').on('click', function(){
  $odontogram2.odontogram('disable');
});

$('.controls2 .unlock').on('click', function(){
  $odontogram2.odontogram('enable');
});

$('.controls2 .empty').on('click', function(){
  $odontogram2.odontogram('empty');
});