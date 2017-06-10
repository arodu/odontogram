(function($) {

  $.fn.ogItem = function(options){
    var $item = $(this);
    
    var values = {
      unit: null,
      left: null,
      right: null,
      center: null,
      up: null,
      down: null,
      mobility: null,
      recession: null,
    }
    
    options = $.extend({
      format: 'icon,title,unit,mobility,recession',
      
    },options);
    
    $item.classes = {
      item: 'og-item',
      unit: 'og-unit',
      section: 'og-section',
    }
    
    $item.init = function(){
      $item.addClass($item.classes.item);
      create();
    }
    
    $item.getValues = function(){
      return values;
    }
    
    function create(){
      var format = options.format.split(',');
      format.forEach(function(v, i){
        switch (v) {
          case 'mobility':
            console.log('mobility');
          break;
          case 'recession':
            console.log('recession');
          break;
          case 'title':
            console.log('title');
          break;
          case 'unit':
            console.log('unit');
          break;
        }
      });
    }
    
    function create_title(){
      
      
      
    }
    
    $item.init();
    return $item;
  }
  
})(window.jQuery);

/*
(function($) {
  $.fn.odontogram = function(method, aux){
    
    var data = [
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
        figure: {background: "url(\"img/x-red.svg\")"},
        menu: true
      },
      {
        index: 2,
        title: 'Perdida por Caries',
        type: 'unit',
        figure: {background: "url(\"img/x-blue.svg\")"},
        menu: true
      },
      {
        index: 3,
        title: 'Endodoncia',
        type: 'unit',
        figure: {background: "url(\"img/triangle.svg\")"},
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

    var options = {}
    var options_default = {
      size: '40px',
      figureSectionEmpty: {background: "#FFFFFF"},
      figureUnitEmpty: {background: "none"},
      emptyValue: '',

      titleView: 'up', // up, down, false/none
      mobilityView: 'up',   // up, down, false/none
      recessionView: 'up',   // up, down, false/none
      
      // Order to view de item
        viewFormat: 'title,unit,recession,mobility', // any order of title,unit,recession,mobility

      menuTitle: 'Pieza %dataItem%',
      data: data,

      itemSelector: '.og-quadrant > div',

      sectionClick: function($section, $item){},
      menuClick: function(itemMenu, $item){},
      changeSelect: function($item){},
      changeItem: function($item){},
      sectionHover: function($section){},
      
      json: {},
      
      inputName: 'odontogram',

      sectionTag: 'span',
      unitTag: 'div',
      titleTag: 'div',
      
      enable: true,
      
      classes: {},
      
      legend: {
        mobility: "Movilidad",
        recession: "Recesión",
        title: "titulo",
      },

      debug: false,
    };

    var classes = {
      config: 'og-config',
      diagram: 'og-diagram',
      item: 'og-item',
      title: 'og-title',
      input: 'og-input',
      unit: 'og-unit',
      unitInput: 'og-unit-input',
      section: 'og-section',
      sectionInput: 'og-section-input',
      disable: 'og-disable',
      menu: 'og-menu',
      menuItem: 'og-menu-item',
      overSection: 'og-over-section',
      mobility: 'og-mobility',
      mobilityInput: 'og-mobility-input',
      recession: 'og-recession',
      recessionInput: 'og-recession-input',
      itemLegend: 'og-item-legend',
    }
    
    var methods = {
      init: function($odontogram){ $odontogram.each(function(){ init( $(this) ) }); return $odontogram; },
      destroy: function($odontogram){ $odontogram.each(function(){ destroy( $(this) ) }); return $odontogram; },
      paint: function($odontogram){ $odontogram.each(function(){ paint( $(this) ) }); return $odontogram; },
      setOptions: function($odontogram, options){ $odontogram.each(function(){ setOptions( $(this), options ) }); return $odontogram; },
      setClasses: function($odontogram, classes){ $odontogram.each(function(){ setClasses( $(this), classes ) }); return $odontogram; },
      setData: function($odontogram, data){ $odontogram.each(function(){ setData( $(this), data ) }); return $odontogram; },
      disable: function( $odontogram ){ $odontogram.each(function(){ disable( $(this) ) }); return $odontogram; },
      enable: function( $odontogram ){ $odontogram.each(function(){ enable( $(this) ) }); return $odontogram; },
      empty: function( $odontogram ){ $odontogram.each(function(){ empty( $(this) ) }); return $odontogram; },
      loadJson: function( $odontogram, json ){ $odontogram.each(function(){ loadJson( $(this), json ) }); return $odontogram; },
      //unloadJson: function( $odontogram, toText ){ return unloadJson( $odontogram, toText ) },
    };
    
    if( methods[method] ){
      options = $(this).data('options');
      classes = $(this).data('classes');
      data = $(this).data('data');
      return methods[method]($(this), aux );
    }else if( typeof method === 'object' || !method ){
      var options_user = method;
      setOptions($(this), options_user);
      return init( $(this) );
    }else{
      console.error( 'the "'+method+'" method does not exist');
    }
    
    function setOptions($odontogram, options_user){
      options = $.extend(options_default, options, options_user);
      $odontogram.data('options',options);
      setClasses($odontogram, options.classes);
      setData($odontogram, options.data);
      debug('options saved');
      return $odontogram;
    }
    
    function setClasses($odontogram, classes_user){
      classes = $.extend(classes, classes_user);
      $odontogram.data('classes',classes);
      return $odontogram;
    }
    
    function setData($odontogram, data_user){
      data = data_user;
      $odontogram.data('data',data);
      return $odontogram;
    }
    
    function init($odontogram){
      destroy($odontogram);
      $odontogram.addClass(classes.diagram);
      
      $odontogram.find(options.itemSelector).not(_c(classes.itemLegend)).each(function(){
        $item = $(this);
        _generateItem($item, options.json);
        
        var $sections = $item.find(_c(classes.section));
        $sections.on('mouseenter', function(){
          var $section = $(this);
          var $item = $section.closest(_c(classes.item));
          var $section_input = $section.find(_c(classes.sectionInput));
          var $unit_input = $item.find(_c(classes.unitInput));

          options.sectionHover({
            'section': $section.data('section'),
            'item': $item.data('item'),
            'section_value': $section_input.val(),
            'unit_value': $unit_input.val(),
          });
        });
        _paintItem( $item );
      });
      
      if(options.enable){
        enable( $odontogram );
      }else{
        disable( $odontogram );
      }
      debug('odontogram init');
      return $odontogram;
    }
    
    function destroy($odontogram){
      $odontogram.find(_c(classes.item)).each(function(){
        _destroyItem( $(this) );
      })
      $odontogram.removeClass(classes.diagram);
      debug('odontogram destroyed');
      return $odontogram;
    }
    
    function paint( $odontogram ){
      $odontogram.find(_c(classes.item)).each(function(){
        _paintItem( $(this) );
      });
      return $odontogram;
    }
    
    function disable( $odontogram ){
      $odontogram.addClass(classes.disable);
      $odontogram.find(_c(classes.section)).off('click');
      $odontogram.find(_c(classes.title)).off('click');
      $odontogram.find(_c(classes.input)).prop('disabled', true);
    }

    function enable( $odontogram ){
      $odontogram.removeClass(classes.disable);
      
      $odontogram.find(_c(classes.input)).prop('disabled', false);
      
      $(window).click(function() {
        _destroyMenus();
      });

      $odontogram.find(_c(classes.title)).on('click', function(event){
        _reloadValues($odontogram);
        _destroyMenus();
        event.stopPropagation();
        var $item = $(this).closest(_c(classes.item));
        _displayMenu($item);
      });
      
      $odontogram.find(_c(classes.section)).on('click', function(){
        _destroyMenus();
        var $section = $(this);
        var $item = $section.closest(_c(classes.item));
        var $section_input = $section.find(_c(classes.sectionInput));
        var $unit_input = $item.find(_c(classes.unitInput));
        
        _reloadValues($odontogram);
        
        _onClickSection($section);
        
        options.sectionClick($section, $item);
        options.changeItem($item);
        
        return false;
      });
      
    }
    
    function empty( $odontogram ){
      classInputs = _c(classes.sectionInput)+", "+_c(classes.unitInput);
      $odontogram.find(classInputs).each(function(){
        $(this).val(options.emptyValue);
      });
      classInputsText = _c(classes.mobilityInput)+", "+_c(classes.recessionInput);
      $odontogram.find(classInputsText).each(function(){
        $(this).val('');
      });
      paint($odontogram);
      return $odontogram;
    }
    
    function loadJson($odontogram, json){
      $odontogram.find(_c(classes.item)).each(function(){
        _loadJsonItem($(this), json);
      });
      paint($odontogram);
      return $odontogram;
    }
    
    // ************************************************************************ 
    
    function _reloadValues($odontogram){
      data = $odontogram.data('data');
      classes = $odontogram.data('classes');
      options = $odontogram.data('options');
    }
    
    function _destroyItem( $item ){
      $item.removeClass(classes.item);
      $item.css({width: '',height: ''});
      $item.html('');
      return $item;
    }
    
    function _generateItem( $item, json ){
      _destroyItem($item);
      $item.addClass(classes.item);
      var dataItem = $item.data('item');
      _loadConfig($item);
      // createUnit
      var $unit = $('<'+options.unitTag+' />')
        .addClass(classes.unit)
        .css({width: options.size, height: options.size});
      
      var unit_input_name = options.inputName+"["+dataItem+"][unit]";
      var $unit_input = $('<input />')
        .prop('type','hidden').prop('name',unit_input_name).val(options.emptyValue)
        .addClass(classes.input).addClass(classes.unitInput);
      
      $unit.append( $unit_input );
      
      // createSections
      var sections = ['up','down','right','left','center'];
      sections.forEach( function(section) {
        var $section = $('<'+options.sectionTag+' />')
          .addClass(classes.section).addClass(section);

        var section_input_name = options.inputName+"[" +dataItem+"]["+section+"]";
        var $section_input = $('<input />')
          .prop('type','hidden').prop('name',section_input_name).val(options.emptyValue)
          .addClass(classes.input).addClass(classes.sectionInput).addClass(classes.sectionInput+"-"+section);

        $section.html($section_input);
        $unit.append( $section );
      });
      var $over = $('<'+options.sectionTag+' />').addClass(classes.overSection);
      $unit.append( $over );
      // /createSections
      $item.append( $unit );
      // /createUnit
      
      // createTitle
      if(options.titleView !== false && options.titleView !== "none"){
        var $item_title = $('<'+options.titleTag+' />').addClass(classes.title).html(dataItem);
        if(options.titleView == 'down'){
          $item.append( $item_title );
        }else if(options.titleView == 'up'){
          $item.prepend( $item_title );
        }
      }
      // /createTitle
      
      
      var values = ['', '1', '2', '3'];
      // createMobility
      if(options.mobilityView !== false && options.mobilityView !== "none"){
        //var $item_title = $('<'+options.titleTag+' />').addClass(classes.title).html(dataItem);
        var mobility_input_name = options.inputName+"[" +dataItem+"][mob]";
        
        var mobility_input = $('<select />').prop('name',mobility_input_name)
          .addClass(classes.input).addClass(classes.mobilityInput)
          .prop('placeholder','Mov')
          .change(function(){
            options.changeSelect($item);
            options.changeItem($item);
          });
        values.forEach(function(val){
          mobility_input.append( $('<option>', {value: val, text: val}) );
        });
        
        var mobility = $('<div/>').addClass(classes.mobility).css({width: options.size}).html(mobility_input);
        if(options.mobilityView == 'down'){
          $item.append( mobility );
        }else if(options.mobilityView == 'up'){
          $item.prepend( mobility );
        }
      }
      // /createMobility
      
      // createRecession
      if(options.recessionView !== false && options.recessionView !== "none"){
        //var $item_title = $('<'+options.titleTag+' />').addClass(classes.title).html(dataItem);
        var recession_input_name = options.inputName+"[" +dataItem+"][rec]";
        var recession_input = $('<select />').prop('name',recession_input_name)
          .addClass(classes.input).addClass(classes.recessionInput)
          .prop('placeholder','Rec')
          .change(function(){
            options.changeSelect($item);
            options.changeItem($item)
          });
        values.forEach(function(val){
          recession_input.append( $('<option>', {value: val, text: val}) );
        });
        //var recession_input = $('<input/>').prop('type','text').prop('name',recession_input_name)
        //  .addClass(classes.input).addClass(classes.recessionInput)
        //  .prop('placeholder','Rec')
        //  .change(function(){ options.changeItem($item) });
        var recession = $('<div/>').addClass(classes.recession).css({width: options.size}).html(recession_input);
        if(options.recessionView == 'down'){
          $item.append( recession );
        }else if(options.recessionView == 'up'){
          $item.prepend( recession );
        }
      }
      // /createRecession
      
      if(json !== undefined){
        _loadJsonItem( $item, json);
      }
      
      return $item;
    }
    
    function _loadJsonItem($item, json){
      var dataItem = $item.data('item');
      $item.find(_c(classes.input)).each(function(){
        $input = $(this);
        var review = {
          'unit': classes.unitInput,
          'mob': classes.mobilityInput,
          'rec': classes.recessionInput,
          'up': classes.sectionInput+"-up",
          'down': classes.sectionInput+"-down",
          'right': classes.sectionInput+"-right",
          'left': classes.sectionInput+"-left",
          'center': classes.sectionInput+"-center"
        };

        $.each(review, function(index, class_value){
          //console.log(class_value);
          if($input.hasClass(class_value)){
            //console.log(typeof(json[dataItem][index]));
            if( (dataItem in json) && (index in json[dataItem])){
              $input.val(json[dataItem][index]);
            }
          }
        });
        
      });
      return $item;
    }
    
    function _c( class_name ){
      return '.'+class_name;
    }
    
    function _paintItem( $item ){
      $item.find(_c(classes.unit)).each(function(){
        var $unit = $(this);
        var unit_value = $unit.find(_c(classes.unitInput)).val();
        var $over = $unit.find(_c(classes.overSection));
        
        $unit.find(_c(classes.section)).each(function(){
          $section = $(this);
          var section_value = $section.find(_c(classes.sectionInput)).val();
          //$section = _addColorClass($section, _selectSectionClass(section_value), 'section');
          _addFigure($section, 'section', section_value);
        });
        
        if(unit_value > 0){
          _addFigure($unit.find(_c(classes.overSection)), 'unit', unit_value);
          $over.css('display', 'block');
        }else{
          $over.css('display', 'none');
        }
      });
    }
    
    function _addFigure($tag, type, value){
      var css = {};
      dataItem = _getData(type, value);
      if(dataItem !== false){
        css = dataItem.figure;
      }else{
        if(type == 'unit'){
            css = options.figureUnitEmpty;
        }else if(type == 'section'){
            css = options.figureSectionEmpty;
        }
      }
      $tag.css(css);
    }
    
    function _getData(type, value){
      var out = false;
      data.forEach(function(dataItem){
        if(dataItem.type == type && dataItem.index == value){
          out = dataItem;
        }
      });
      return out;
    }
    
    function _getDataList(type){
      var dataList = [];
      data.forEach(function(dataItem){
        if(dataItem.type == type){
          dataList.push(dataItem);
        }
      });
      return dataList;
    }
    
    function _destroyMenus(){
      $(_c(classes.menu)).remove();
    }
    
    function _getListPosition(list, indexValue){
      var out = false;
      list.forEach(function(v, i){
        if(v.index == indexValue){
          out = i;
        }
      });
      return out;
    }
    
    function _onClickSection( $section ){
      var $input = $section.find(_c(classes.sectionInput));
      var value = $input.val();
      var dataSections = _getDataList('section');
      
      pos = _getListPosition(dataSections, value);
      
      if(pos === false){
        newValue = dataSections[0].index;
      }else{
        if(_isset(dataSections[pos + 1])){
          newValue = dataSections[pos + 1].index;
        }else{
          newValue = options.emptyValue;
        }
      }
      
      $input.val(newValue);
      _addFigure($section, 'section', newValue);
      
      return $section;
    }
    
    function _isset(object){
      return (typeof object !=='undefined');
    }
    
    function debug(out){
      if(options.debug){
        console.log(out);
      }
    }
    
    function _loadConfig($item){
      $item.parents(_c(classes.config)).reverse().each(function(){
        $.extend(options,_getDataConfig($(this)));
      });
      $.extend(options, _getDataConfig($item));
    }

    function _getDataConfig($tag){
      var out = {};
      if(size = $tag.data('size')){ // data-size
        out['size'] = size;
      }
      if(titleView = $tag.data('title-view')){ // data-title-view
        out['titleView'] = titleView;
      }
      if(mobilityView = $tag.data('mobility-view')){ // data-mobility-view
        out['mobilityView'] = mobilityView;
      }
      if(recessionView = $tag.data('recession-view')){ // data-recession-view
        out['recessionView'] = recessionView;
      }
      if(sectionTag = $tag.data('section-tag')){ // data-section-tag
        out['sectionTag'] = sectionTag;
      }
      if(unitTag = $tag.data('unit-tag')){ // data-unit-tag
        out['unitTag'] = unitTag;
      }
      if(titleTag = $tag.data('title-tag')){ // data-title-tag
        out['titleTag'] = titleTag;
      }
      if(viewFormat = $tag.data('view-format')){ // data-view-format
        out['viewFormat'] = viewFormat;
      }
      return out;
    }

    function _getMenuList(){
      var menuList = [];
      data.forEach(function(dataItem){
        if(dataItem.menu){
          menuList.push(dataItem);
        }
      });
      return menuList;
    }

    function _displayMenu($item){
      var menu = $('<ul />').addClass(classes.menu);
      var title = $('<li />')
        .addClass('ui-widget-header')
        .html('<div>'+options.menuTitle.replace("%dataItem%", $item.data('item'))+'</div>');
      menu.append(title);
      
      menuList = _getMenuList();
      
      menuList.forEach(function(itemMenu, i){
        var menuDisplay = $('<li />');
          if(itemMenu.type == 'separator' || itemMenu.type == 'divider'){
            menuDisplay.addClass('ui-menu-divider');
          }else{
            menuDisplay.html('<div>'+itemMenu.title+'</div>')
              .on('click', function(){
                _clickMenu(itemMenu, $item);
              });
          }
        menu.append(menuDisplay);
      });
      $item.find(_c(classes.unit)).append(menu);
      menu.menu({
        items: "> :not(.ui-widget-header)"
      });
    }
    
    function _clickMenu(itemMenu, $item){
      if(itemMenu.type == 'unit'){
        $item.find(_c(classes.sectionInput)).each(function(){
          $(this).val(options.emptyValue);
        });
        $item.find(_c(classes.unitInput)).each(function(){
          $(this).val(itemMenu.index);
        });
      }else if(itemMenu.type == 'section'){
        $item.find(_c(classes.sectionInput)).each(function(){
          $(this).val(itemMenu.index);
        });
        $item.find(_c(classes.unitInput)).each(function(){
          $(this).val(options.emptyValue);
        });
      }else if(itemMenu.type == 'clean'){
        $item.find(_c(classes.sectionInput)).each(function(){
          $(this).val(options.emptyValue);
        });
        $item.find(_c(classes.unitInput)).each(function(){
          $(this).val(options.emptyValue);
        });
        if(itemMenu.all){
          $item.find(_c(classes.recessionInput)+","+_c(classes.mobilityInput)).each(function(){
            $(this).val(options.emptyValue);
          });
        }
        
      }else if(itemMenu.type == 'function'){
        itemMenu.action($item);
      }
      
      options.menuClick(itemMenu.type, $item);
      options.changeItem($item);
      
      _paintItem($item);
    }
    
    return $(this);
  }

  $.fn.odontogramItem = function(method, aux){
    var itemData = {
      dataItem: null,
      unit: null,
      section: null,
      mobility: null,
      recession: null,
    }
    
    var options = {}
    var options_default = {
      size: '40px',
      figureSectionEmpty: {background: "#FFFFFF"},
      figureUnitEmpty: {background: "none"},
      emptyValue: '',

      titleView: 'up', // up, down, false/none
      mobilityView: 'up',   // up, down, false/none
      recessionView: 'up',   // up, down, false/none

      menuTitle: 'Pieza %dataItem%',
      data: data,

      //itemSelector: '.og-quadrant > div',

      sectionClick: function($section){},
      menuClick: function(){},
      changeItem: function($item){},
      sectionHover: function($section){},
      
      json: {},
      
      inputName: 'odontogram',

      sectionTag: 'span',
      unitTag: 'div',
      titleTag: 'div',
      
      enable: true,
      
      classes: {},
      
      debug: false,
    };
    
    
    return $(this);
  }

  $.fn.reverse = [].reverse;

})(window.jQuery); */