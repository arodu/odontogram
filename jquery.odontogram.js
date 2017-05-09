(function($) {
  $.fn.odontogram = function(method, aux){
    
    var menu = [
      /*{
        title: 'Caries',
        type: 'section',
        value: 1,
      },
      {
        title: 'Restauración',
        type: 'section',
        value: 2,
      },
      { type: 'separator' }, */
      {
        title: 'Extracción Indicada',
        type: 'unit',
        value: 1,
        class: 'og-x-red'
      },
      {
        title: 'Perdida por Caries',
        type: 'unit',
        value: 2,
        class: 'og-x-blue'
      },
      {
        title: 'Endodoncia',
        type: 'unit',
        value: 3,
        class: 'og-x-triangle'
      },
      {
        title: 'Test',
        type: 'unit',
        value: 4,
        class: 'og-x-blue'
      },
      {
        title: 'Test',
        type: 'unit',
        value: 4,
        class: 'og-x-blue'
      },
      {
        title: 'Test',
        type: 'unit',
        value: 4,
        class: 'og-x-blue'
      },
      {
        title: 'Test',
        type: 'unit',
        value: 4,
        class: 'og-x-blue'
      },
    ];
    
    var options = {}
    var options_default = {
      size: '40px',
      sectionClasses: {
        1: 'og-red',
        2: 'og-blue',
      },
      unitClasses: {
        1: 'og-x-red',
        2: 'og-x-blue',
        3: 'og-triangle',
        4: 'og-test',
      },
      menuTitle: 'Pieza %dataItem%',
      menu: menu,
      emptyColor: 'og-empty-color',
      bgColor: 'og-bg-color',
      json: {},
      
      itemSelector: '.og-quadrant > div',
      sectionTag: 'span',
      unitTag: 'div',
      titleView: true,
      titleLocation: 'up', // down
      titleTag: 'div',
      inputName: 'odontogram',

      beforeClick: function(){},
      afterClick: function(){},
      hover: function(){}
    };
    
    var classes = {
      diagram: 'og-diagram',
      item: 'og-item',
      title: 'og-title',
      unit: 'og-unit',
      unitInput: 'og-unit-input',
      section: 'og-section',
      sectionInput: 'og-section-input',
      disable: 'og-disable',
      menu: 'og-menu',
      menuItem: 'og-menu-item',
      overSection: 'og-over-section',
    }
    
    var methods = {
      init: function($odontogram){ $odontogram.each(function(){ init( $(this) ) }); return $odontogram; },
      destroy: function($odontogram){ $odontogram.each(function(){ destroy( $(this) ) }); return $odontogram; },
      paint: function($odontogram){ $odontogram.each(function(){ paint( $(this) ) }); return $odontogram; },
      setOptions: function($odontogram, options){ $odontogram.each(function(){ setOptions( $(this), options ) }); return $odontogram; },
      //setClasses: function($odontogram, classes){ $odontogram.each(function(){ setClasses( $(this), classes ) }); return $odontogram; },
      
      //loadJson: function( $odontogram, json ){ return loadJson( $odontogram, json ) },
      //unloadJson: function( $odontogram, toText ){ return unloadJson( $odontogram, toText ) },
      disable: function( $odontogram ){ $odontogram.each(function(){ disable( $(this) ) }); return $odontogram; },
      enable: function( $odontogram ){ $odontogram.each(function(){ enable( $(this) ) }); return $odontogram; },
      empty: function( $odontogram ){ $odontogram.each(function(){ empty( $(this) ) }); return $odontogram; },
    };
    
    if( methods[method] ){
      options = $(this).data('options');
      return methods[method]($(this), aux );
    }else if( typeof method === 'object' || !method ){
      setOptions($(this), method)
      $(this).data('options',options);
      return init( $(this) );
    }else{
      console.error( 'the "'+method+'" method does not exist');
    }
    
    function init($odontogram){
      destroy($odontogram);
      $odontogram.addClass(classes.diagram).addClass(options.bgColor);
      
      $odontogram.find(options.itemSelector).each(function(){
        $item = $(this);
        _generateItem($item, options.json );
        
        var $sections = $item.find(_c(classes.section));
        $sections.on('mouseenter', function(){
          var $section = $(this);
          var $item = $section.closest(_c(classes.item));
          var $section_input = $section.find(_c(classes.sectionInput));
          var $unit_input = $item.find(_c(classes.unitInput));

          options.hover({
            'section': $section.data('section'),
            'item': $item.data('item'),
            'section_value': $section_input.val(),
            'unit_value': $unit_input.val(),
          });
        });
        _paintItem( $item );
      });
      enable( $odontogram );
      return $odontogram;
    }
    
    function destroy($odontogram){
      $odontogram.find(_c(classes.item)).each(function(){
        _destroyItem( $(this) );
      })
      $odontogram.removeClass(classes.diagram);
      return $odontogram;
    }
    
    function setOptions($odontogram, options_user){
      options = $.extend(options_default, options, options_user);
      return $odontogram;
    }
    
    //function setClasses($odontogram, classes_user){
    //  classes = $.extend(classes, classes_user);
    //  return $odontogram;
    //}
    
    function disable( $odontogram ){
      $odontogram.addClass(classes.disable);
      $odontogram.find(_c(classes.section)).off('click');
      $odontogram.find(_c(classes.title)).off('click');
    }

    function enable( $odontogram ){
      $odontogram.removeClass(classes.disable);
      
      $(window).click(function() {
        $(_c(classes.menu)).remove();
      });

      $odontogram.find(_c(classes.title)).on('click', function(event){
        $(_c(classes.menu)).remove();
        event.stopPropagation();
        var $item = $(this).closest(_c(classes.item));
        _displayMenu($item);
      });
      
      $odontogram.find(_c(classes.section)).on('click', function(){
        $(_c(classes.menu)).remove();
        var $section = $(this);
        var $item = $section.closest(_c(classes.item));
        var $section_input = $section.find(_c(classes.sectionInput));
        var $unit_input = $item.find(_c(classes.unitInput));
        
        options.beforeClick({
          'item': $item.data('item'),
          'section': $section.data('section'),
          'section_value': $section_input.val(),
          'unit_value': $unit_input.val()
        });
        
        _onClickSection( $section );
        
        options.afterClick({
          'item': $item.data('item'),
          'section': $section.data('section'),
          'section_value': $section_input.val(),
          'unit_value': $unit_input.val()
        });
        
        return false;
      });
      
      
      /*
      $odontogram.find('.og-title').on('click', function(){
        var $item = $(this).closest('.og-item');
        
        $sections = $item.find(".og-section");
        
        //$item.find("input").each(function(){
        //  console.log($(this).val());
        //  $(this).val(0);
        //});
        
        $sections.each(function(){
          _onClickSection( $(this) );
        });
        return false;
      }); */
    }
    
    function empty( $odontogram ){
      classInputs = _c(classes.sectionInput)+", "+_c(classes.unitInput);
        $odontogram.find(classInputs).each(function(){
          $(this).val(0);
        });
        paint($odontogram);
        return $odontogram;
    }
    
    function paint( $odontogram ){
      $odontogram.find(_c(classes.item)).each(function(){
        _paintItem( $(this) );
      });
      return $odontogram;
    }
    
    /* ************************************************************************ */
    
    function _getUnitClasses(index){
      var uc;
      menu.forEach(function(i, data){
        if(data.type == 'unit'){
          uc[data.value] = data.class
        }
      });
      
      if(index === undefined){
        return uc;
      }{
        return uc[index]
      }
    }
    
    function _generateItem( $item, json ){
      _destroyItem($item);
      $item.addClass(classes.item);
      var dataItem = $item.data('item');
      
      // createUnit
      var $unit = $('<'+options.unitTag+' />')
        .addClass(classes.unit)
        .css({width: options.size, height: options.size});
      
      var unit_input_name = options.inputName+"["+dataItem+"][unit]";
      var $unit_input = $('<input />')
        .prop('type','hidden').prop('name',unit_input_name).val(0)
        .addClass(classes.unitInput);
      
      $unit.append( $unit_input );
      
      // createSections
      var sections = ['up','down','right','left','center'];
      sections.forEach( function(section) {
        var $section = $('<'+options.sectionTag+' />')
          .addClass(classes.section).addClass(section);

        var section_input_name = options.inputName+"[" +dataItem+"]["+section+"]";
        var $section_input = $('<input />')
          .prop('type','hidden').prop('name',section_input_name).val(0)
          .addClass(classes.sectionInput);

        $section.html($section_input);
        $unit.append( $section );
      });
      var $over = $('<'+options.sectionTag+' />').addClass(classes.overSection);
      $unit.append( $over );
      // /createSections
      $item.append( $unit );
      // /createUnit
      
      if(options.titleView){
        var $item_title = $('<'+options.titleTag+' />').addClass(classes.title).html(dataItem);
        if(options.titleLocation == 'down'){
          $item.append( $item_title );
        }else if(options.titleLocation == 'up'){
          $item.prepend( $item_title );
        }
      }
      
      /* **
      if(json !== 'undefined'){
        _loadJsonItem( $item, json);
      }
      */
      
      return $item;
    }
    
    function _destroyItem( $item ){
      $item.removeClass(classes.item);
      $item.css({width: '',height: ''});
      $item.html('');
      return $item;
    }
    
    function _c(class_name){
      return '.'+class_name;
    }
    
    function _displayMenu($item){
      var menu = $('<ul />').addClass(classes.menu);
      var title = $('<li />')
        .addClass('ui-widget-header')
        .html('<div>'+options.menuTitle.replace("%dataItem%", $item.data('item'))+'</div>');
      menu.append(title);
      
      options.menu.forEach(function(itemMenu, i){
        var imenu = $('<li />');
          if(itemMenu.type == 'separator' || itemMenu.type == 'divider'){
            imenu.addClass('ui-menu-divider');
          }else{
            imenu
              .html('<div>'+itemMenu.title+'</div>')
              .on('click', function(){
                _clickMenu(itemMenu, $item);
              });
          }
        menu.append(imenu);
      });
      $item.append(menu);
      menu.menu({
        items: "> :not(.ui-widget-header)"
      });
    }
    
    function _clickMenu(itemMenu, $item){
      if(itemMenu.type == 'unit'){
        $item.find(_c(classes.sectionInput)).each(function(){
          $(this).val(0);
        });
        $item.find(_c(classes.unitInput)).each(function(){
          $(this).val(itemMenu.value);
        });
      }else if(itemMenu.type == 'section'){
        $item.find(_c(classes.sectionInput)).each(function(){
          $(this).val(itemMenu.value);
        });
        $item.find(_c(classes.unitInput)).each(function(){
          $(this).val(0);
        });
      }
      _paintItem($item);
    }
    
    function _paintItem( $item ){
      $item.find(_c(classes.unit)).each(function(){
        var $unit = $(this);
        var unit_value = $unit.find(_c(classes.unitInput)).val();
        var $over = $unit.find(_c(classes.overSection));
        
        $unit.find(_c(classes.section)).each(function(){
          $section = $(this);
          var section_value = $section.find(_c(classes.sectionInput)).val();
          $section = _addColorClass($section, _selectSectionClass(section_value), 'section');
        });
        
        if(unit_value > 0){
          _addColorClass($over, _selectUnitClass( unit_value ), 'unit');
          $over.css('display', 'block');
        }else{
          $over.css('display', 'none');
        }
        
        //_addColorClass($unit, _selectUnitClass( unit_value ), 'unit');
        
        /*
        unit_value = $unit.find(_c(classes.unitInput)).val();
        if(unit_value > 0){
          
          
        }else{
          
          
          $unit.find(_c(classes.section)).each(function(){
            $section = $(this);
            var section_value = $section.find(_c(classes.sectionInput)).val();
            $section = _addColorClass($section, _selectSectionClass(section_value));
          });
        }*/
      });
      
    }
    
    function _addColorClass($itemElement, className, type){
      if(type == 'unit'){
        var remove_class = _join(options.unitClasses, " ");
      }else{
        var remove_class = _join(options.sectionClasses, " ");
      }
      
      $itemElement
        .removeClass(options.emptyColor +" "+remove_class)
        .addClass(className);
      return $itemElement;
    }
    
    function _selectSectionClass( value ){
      var color = options.emptyColor;
      if( value > 0){
        color = options.sectionClasses[value];
      }
      return color;
    }
    
    function _selectUnitClass( value ){
      var color = "";
      if( value > 0){
        color = options.unitClasses[value];
      }
      return color;
    }
    
    function _join(list, separator){
      var out = "";
      $.each(list, function(i, val) {
        out += separator+val;
      });
      return out.trim();
    }
    
    function _onClickSection( $section ){
      var $input = $section.find(_c(classes.sectionInput));
      var value = parseInt( $input.val() );
      var qtyColors = Object.keys(options.sectionClasses).length;

      if( value < qtyColors ){
        $input.val( value+1 );
        color = _selectSectionClass( value+1 );
      }else{
        $input.val( 0 );
        color = _selectSectionClass(0);
      }
      _addColorClass($section, color, 'section');
      return $section;
    }
    
    return $(this);
  }
})(jQuery);