/*
$('.odontogram').odontogram();

$odontogram2 = $('#odontogram2').odontogram({
  itemSelector: '.og-quadrant > div > div'
});
*/

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


var demoData = [
   {
     title: 'Limpiar',
     type: 'clean',
     all: false,
     menu: true
   },
   {
     title: 'Limpiar Todo',
     type: 'clean',
     all: true,
     menu: true
   },
   {
     index: 1,
     title: 'Caries',
     type: 'section',
     figure: {background: "#FF0000"},
     menu: true
   },
   {
     index: 2,
     title: 'Restauración',
     type: 'section',
     figure: {background: "#0000FF"},
     menu: true
   },
   {
     index: 57,
     title: 'Otra Cosa',
     type: 'section',
     figure: {background: "#00FF00"},
     menu: true
   },
   {
     type: 'separator',
     menu: true // true
   },
   {
     type: 'range',
     menu: false // true
   },
   {
     index: 1,
     title: 'Extracción Indicada',
     type: 'unit',
     figure: {background: "url(\"../img/x-red.svg\")"},
     menu: true
   },
   {
     index: 2,
     title: 'Perdida por Caries',
     type: 'unit',
     figure: {background: "url(\"../img/x-blue.svg\")"},
     menu: true
   },
   {
     index: 3,
     title: 'Endodoncia',
     type: 'unit',
     figure: {background: "url(\"../img/triangle-red.svg\")"},
     menu: true
   },
   {
     type: 'separator',
     menu: true // false
   },
   {
     title: 'Ejecutar Función',
     type: 'function',
     menu: true,
     action: function($item){
       console.log($item);
     }
   }
 ];