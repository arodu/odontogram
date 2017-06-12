(function($) {

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
       figure: {background: "url(\"img/triangle-red.svg\")"},
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

  $.fn.odontogram = function(options){
    
  }

  $.fn.ogItem = function(options){
    var $item = $(this);
    var dataItem;
    var values = {};
    var $menu;
    
    var options = $.extend({
      'format': 'icon,iconTitle,title,unit,mobility,recession',   //icon,iconTitle,title,unit,mobility,recession
      'sections': 'up,down,left,right,center',    // can be skipped the center section
      'size': '40px',
      'form': true,
      'input-name': 'odontogram',
      'empty-value': '',
      'figure-unit-empty': {background: "none"},
      'figure-section-empty': {background: "#FFF"},
      'data': demoData,
      'icon': 'img/unit-1.svg',
      'icon-height': '50px',
      'icon-text-aling': '15%',
      'icon-aling': 'down', // top, center, down
      'mobility-values': ['', '1', '2', '3'],
      'recession-values': ['', '1', '2', '3'],
      
      'debug': true,
      
      sectionClick: function(){},
      buttonMenuClick: function(){},
      selectChange: function(){},
      beforeChange: function(){},
    },options);
    
    var classes = {
      config: 'og-config',
      item: 'og-item',
      unit: 'og-unit',
      unitInput: 'og-unit-input',
      section: 'og-section',
      sectionInput: 'og-section-input',
      title: 'og-title',
      icon: 'og-icon',
      mobility: 'og-mobility',
      mobilityInput: 'og-mobility-input',
      recession: 'og-recession',
      recessionInput: 'og-recession-input',
      noCenter: 'no-center',
      input: 'og-input',
      overSection: 'og-over-section',
      menuButton: 'og-menu-button',
    };

    $item.init = function(){
      destroy();
      create();
      enable();
    }
    
    $item.destroy = function(){
      destroy();
    }
    
    $item.enable = function(isEnable){
      if(isEnable){ // enable
        enable();
      }else if(!isEnable){ //disable
        disable();
      }
    }
    
    $item.empty = function(){
      values = $.extend(values,{
        unit: null,
        left: null,
        right: null,
        center: null,
        up: null,
        down: null,
        mobility: null,
        recession: null,
      });
      paint();
    }
    
    $item.getValues = function(){
      return values;
    }
    
    $item.setOptions = function(){}
    
    $item.setData = function(data){
      options['data'] = data;
    }
    
    $item.setValues = function(new_values){
      values = $.extend(values, new_values);
      paint();
    }
    
    $item.displayMenu = function(){
      $menu.display();
    }
    
    function getDataItem(){
      dataItem = $item.data('item');
      return dataItem;
    }
    
    function disable(){
      $item.find(_c(classes.section)).off('click');
      $item.find(_c(classes.menuButton)).off('click');
      $item.find(_c(classes.mobilityInput)+","+_c(classes.recessionInput)).prop('disabled',true);
    }
    
    function enable(){
      
      $(window).click(function() {
        $menu.destroy();
      });
      
      $item.find(_c(classes.menuButton)).on('click', function(event){
        $menu.destroy();
        event.stopPropagation();
        $menu.display();
      });
      
      $item.find(_c(classes.section)).on('click', function(){
        //_destroyMenus();
        var $section = $(this);
        //var $section_input = $section.find(_c(classes.sectionInput));
        //var $unit_input = $item.find(_c(classes.unitInput));
        
        //_reloadValues($odontogram);
        
        clickSection($section);
        options.beforeChange($item);
        return false;
      });
      
      $mobilityRecession = $item.find(_c(classes.mobilityInput)+","+_c(classes.recessionInput));
      $mobilityRecession.prop('disabled',false);
      $mobilityRecession.on('change', function(){
        selectChange($(this));
      });
      
    }
    
    function destroy(){ }
    
    function create(){
      getDataItem();
      $item.addClass(classes.item);
      loadConfig($item);
      
      debug(options['format']);
      
      var format = options['format'].split(',');
      format.forEach(function(v, i){
        switch ( v.trim() ) {
          case 'mobility':
            create_mobility();
          break;
          case 'recession':
            create_recession();
          break;
          case 'title':
            create_title();
          break;
          case 'unit':
            create_unit();
          break;
          case 'icon':
            create_icon(false);
          break;
          case 'iconTitle':
            create_icon(true);
          break;
        }
      });
      $menu = $('<div />').ogMenu($item, options);
      $item.append($menu);
      paint();
    }
    
    function create_title(){
      $title = $('<div />').addClass(classes.title).addClass(classes.menuButton).html(dataItem);
      $item.append($title);
    }
    
    function create_unit(){
      $unit = $('<div />')
        .addClass(classes.unit)
        .css({width: options['size'], height: options['size']});
      values['unit'] = options['empty-value'];
      if(options['form']){
        var unit_input_name = options['input-name']+"["+dataItem+"][unit]";
        var $unit_input = $('<input />')
          .prop('type','hidden').prop('name',unit_input_name).val(options['empty-value'])
          .addClass(classes.input).addClass(classes.unitInputn);
        $unit.append( $unit_input );
      }
      
      var sections = options['sections'].split(',');
      if(sections.indexOf('center') <= 0){
        $unit.addClass(classes.noCenter);
      }
      sections.forEach(function(section){
        $unit.append(create_section(section));
      });
      
      $overSection = $('<div />').addClass(classes.overSection);
      $unit.append( $overSection );
      
      $item.append($unit);
    }
    
    function create_section(name){
      $section = $('<div />').addClass(classes.section).addClass(name).data('name',name);
      values[name] = options['empty-value'];
      if(options['form']){
        var section_input_name = options['input-name']+"["+dataItem+"]["+name+"]";
        var $section_input = $('<input />')
          .prop('type','hidden').prop('name',section_input_name).val(options['empty-value'])
          .addClass(classes.input).addClass(classes.sectionInput).addClass(name);
        $section.html($section_input);
      }
      return $section;
    }
    
    function create_icon(title){
      $img = $('<div />')
          .addClass('image')
          .append( $('<img />').prop('src',options['icon']).css({width: options['size']}) );
      
      if(title){
        $img.addClass(classes.menuButton)
        $title = $('<span />').css('top',options['icon-text-aling']).html(dataItem);
        $img.append($title);
      }
      
      switch(options['icon-aling']){
        case 'top':  aling = {'display': 'flex', 'align-items': 'flex-start'}; break;
        case 'down':  aling = {'display': 'flex', 'align-items': 'flex-end'}; break;
        default: aling = {'display': 'flex', 'align-items': 'center'}; break;
      }
      
      $icon = $('<div />')
          .addClass(classes.icon)
          .css({'height': options['icon-height']}).css(aling)
          .html($img);

      $item.append($icon);
    }
    
    function create_mobility(){
      var mobility_input_name = options['input-name']+"[" +dataItem+"][mobility]";
      var mobility_input = $('<select />')
          .prop('name',mobility_input_name)
          .data('name','mobility')
          .addClass(classes.input).addClass(classes.mobilityInput);
      options['mobility-values'].forEach(function(val){
        mobility_input.append( $('<option>', {value: val, text: val}) );
      });
      var mobility = $('<div/>')
          .addClass(classes.mobility)
          .css({width: options['size']})
          .html(mobility_input);
      values['mobility'] = options['mobility-values'][0];
      $item.append(mobility);
    }
    
    function create_recession(){
      var recession_input_name = options['input-name']+"[" +dataItem+"][recession]";
      var recession_input = $('<select />')
          .prop('name',recession_input_name)
          .data('name','recession')
          .addClass(classes.input).addClass(classes.recessionInput)
        ;
      options['recession-values'].forEach(function(val){
        recession_input.append( $('<option>', {value: val, text: val}) );
      });
      var recession = $('<div/>')
          .addClass(classes.recession)
          .css({width: options['size']})
          .html(recession_input);
      values['recession'] = options['recession-values'][0];
      $item.append(recession);
    }
    
    function paint(){
      $item.find(_c(classes.unit)).each(function(){
        var $unit = $(this);
        var unit_value = values['unit'];
        var $over = $unit.find(_c(classes.overSection));
        
        $unit.find(_c(classes.section)).each(function(){
          $section = $(this);
          var section_name = $section.data('name');
          var section_value = values[section_name];
          addFigure($section, section_value, 'section');
        });
        
        //if(unit_value > 0){
        //  _addFigure($unit.find(_c(classes.overSection)), 'unit', unit_value);
        //  $over.css('display', 'block');
        //}else{
        //  $over.css('display', 'none');
        //}
      });
    }
    
    function addFigure($tag, value, type){
      var css = {};
      dataElement = getDataElement(type, value);
      if(dataElement !== false){
        css = dataElement.figure;
      }else{
        if(type == 'unit'){
          css = options['figure-unit-empty'];
        }else if(type == 'section'){
          css = options['figure-section-empty'];
        }
      }
      $tag.css(css);
    }
    
    function getDataElement(type, value){
      var out = false;
      options['data'].forEach(function(dataElement){
        if(dataElement.type == type && dataElement.index == value){
          out = dataElement;
        }
      });
      return out;
    }
    
    function selectChange($select){
      var select_name = $select.data('name');
      $select.find('option:selected').each(function(){
        values[select_name] = $(this).val();
      })
      options.selectChange($item);
      options.beforeChange($item);
    }
    
    function clickSection($section){
      var section_name = $section.data('name');
      var value = values[section_name];
      var dataSections = getDataList('section'); // get data sections list
      var position = getListPosition(dataSections, value)
      if(position === false){ // get actual position of list
        newValue = dataSections[0].index;
      }else{
        if(_isset(dataSections[position + 1])){
          newValue = dataSections[position + 1].index;
        }else{
          newValue = options['empty-value'];
        }
      }
      values[section_name] = newValue;
      if(options['form']){
        var $input = $section.find(_c(classes.sectionInput));
        $input.val(newValue);
      }
      addFigure($section, newValue, 'section');
      options.sectionClick($item);
      return $section;
    }
    
    function getDataList(type){
      var dataList = [];
      options['data'].forEach(function(dataElement){
        if(dataElement.type == type){
          dataList.push(dataElement);
        }
      });
      return dataList;
    }
    
    function getListPosition(list, indexValue){
      var out = false;
      list.forEach(function(v, i){
        if(v.index == indexValue){
          out = i;
        }
      });
      return out;
    }
    
    function loadConfig(){
      var review = ['size','format','sections','icon'];
      $item.parents(_c(classes.config)).reverse().each(function(){
        $.extend(options,_getDataConfig($(this), review));
      });
      $.extend(options, _getDataConfig($item, review));
    }
    
    function debug(msg){
      if(options['debug']){
        console.log(msg);
      }
    }
    
    $item.init();
    return $item;
  }
  
  $.fn.ogMenu = function($item, options){
    var $menuList = $(this);
    var dataItem = $item.data('item');
    
    var options = $.extend({
      'menu-title': 'Piece %dataItem%',
      'menu-icon': true,   // false or url_image
    },options);
    
    var classes = {
      menu: 'og-menu',
      menuItem: 'og-menu-item',
      menuIcon: 'og-menu-icon',
    }
    
    $menuList.destroy = function(){
      $(_c(classes.menu)).each(function(){
        $(this).html('');
      })
    }
    
    $menuList.display = function(){
      $menuList.destroy();
      $menuList.addClass(classes.menu);
      console.log('display menu');
      var menu = $('<ul />');
      
      var menuIcon = '';
      if(options['menu-icon']){
        var img = $("<img />").prop('src',options['icon']).css({'max-width': '15px', 'max-height': '15px'});
        menuIcon = $('<div />').addClass(classes.menuIcon).html(img);
      }
      
      var title = $('<li />')
          .addClass('ui-widget-header')
          .append(menuIcon)
          .append('<div>'+options['menu-title'].replace("%dataItem%", dataItem)+'</div>');
      
      menu.append(title);
      
      dataMenuList = getDataMenuList();
      
      dataMenuList.forEach(function(itemMenu, i){
        var menuDisplay = $('<li />');
        if(itemMenu.type == 'separator' || itemMenu.type == 'divider'){
          menuDisplay.addClass('ui-menu-divider');
        }else{
          var out = $('<div />');
          var $icon = $('<div />').addClass(classes.menuIcon)
          if(_isset(itemMenu.figure)){
            $icon.css(itemMenu.figure);
          }
          out.append($icon);
          out.append(itemMenu.title);
          menuDisplay.html(out)
          //.on('click', function(){
          //  _clickMenu(itemMenu, $item);
          //});
          ;
        }
        menu.append(menuDisplay);
      });
      $item.find(_c(classes.unit)).append(menu);
      
      
      
      
      menu.menu({
        items: "> :not(.ui-widget-header)"
      });
      
      $menuList.html(menu);
    }
    
    function getDataMenuList(){
      var dataMenuList = [];
      options['data'].forEach(function(dataElement){
        if(dataElement['menu']){
          dataMenuList.push(dataElement);
        }
      });
      return dataMenuList;
    }
    
    
    /*
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
          var out = $('<div />');
          var $icon = $('<div />').addClass(classes.menuIcon)
          if(_isset(itemMenu.figure)){
            $icon.css(itemMenu.figure);
          }
          out.append($icon);
          out.append(itemMenu.title);
          menuDisplay.html(out)
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
    */
    
    return $menuList;
  }
  
  
  function _c(class_name){
    return '.'+class_name;
  }
  
  function _getDataConfig($tag, review){
    var out = {};
    review.forEach(function(data){
      if(r = $tag.data(data)){
        out[data] = r;
      }
    });
    return out;
  }
  
  function _isset(object){
    return (typeof object !=='undefined');
  }
  
  $.fn.reverse = [].reverse;
  
})(window.jQuery);
