(function($) {

  $.fn.odontogram = function(user_options){
    var $odontogram = $(this);
    var items = {};

    var options = $.extend({
      'json': {},
      'item-selector': '[data-item]',
      'enable': true,
    },user_options);

    var classes = {
      odontogram: 'og-diagram',
    };

    $odontogram.init = function(){
      $odontogram.addClass(classes.odontogram);
      $odontogram.find(options['item-selector']).each(function(){
        var dataItem = $(this).data('item');
        items[dataItem] = $(this).ogItem(options);
        if(_isset(options['json'][dataItem.toString()])){
          items[dataItem].setValue(options['json'][dataItem.toString()]);
        }
        if(!options['enable']){
          items[dataItem].enable(false);
        }
      });
      return $odontogram;
    }

    $odontogram.getItem = function(id){
      if(_isset(id)){
        return items[parseInt(id)];
      }
      return items;
    }

    $odontogram.json = function(json){
      if(_isset(json)){
        // setter
        options['json'] = json;
        $.each(items, function(i){
          var dataItem = items[i].getDataItem();
          if(_isset(options['json'][dataItem.toString()])){
            items[i].setValue( options['json'][dataItem.toString()] );
          }
        });
        return $odontogram;
      }else{
        // getter
        var out = {};
        $.each(items, function(i){
          var dataItem = items[i].getDataItem();
          out[dataItem] = items[i].getValue();
        });
        return out;
      }
    }

    return $odontogram.init();
  }

  $.fn.ogItem = function(user_options){
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
      'data': null,
      'icons_dir': 'img/',
      'icon': 'unit-1.svg',
      'icon-height': '50px',
      'icon-text-aling': '15%',
      'icon-aling': 'down', // top, center, down
      'mobility-values': ['1', '2', '3'],
      'recession-values': ['1', '2', '3'],

      'debug': true,

      sectionClick: function($item, section){},
      buttonMenuClick: function($item){},
      selectChange: function($item, select){},
      beforeChange: function($item){},
    },user_options);

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

      return $item;
    }

    $item.destroy = function(){
      destroy();

      return $item;
    }

    $item.enable = function(isEnable){
      if(isEnable){ // enable
        enable();
      }else if(!isEnable){ //disable
        disable();
      }

      return $item;
    }

    //$item.empty = function(){
    //  paint();
    //}

    $item.setOptions = function(){}

    $item.setData = function(data){
      options['data'] = data;

      return $item;
    }

    $item.setValue = function(parts, new_value){
      if(typeof parts === 'string'){
        setValue(parts, new_value);
      }else if(typeof parts === 'object' && _isset(new_value)){
        parts.forEach(function(part){
          setValue(part, new_value);
        });
      }else if(typeof parts === 'object' && !_isset(new_value)){
        Object.keys(parts).forEach(function(key) {
          if(parts[key] !== null){
            setValue(key, parseInt(parts[key]) );
          }
        });
      }
      updateForm();
      paint();
      return $item;
    }

    function setValue(part, new_value){
      values[part] = new_value;
      var sections = options['sections'].split(',');
      if(part == 'unit'){
        sections.forEach(function(section){
          values[section] = options['empty-value'];
        });
      }else if( sections.indexOf(part) > 0){
        values['unit'] = options['empty-value'];
      }
    }

    $item.getValue = function(parts){
      if(_isset(parts)){
        var out = {};
        $.each(parts, function(index, part){
          out[part] = values[part];
        });
        return out;
      }
      return values;
    }

    $item.getSection = function(section){
      return $item.find(_c([classes.section, section],''));
    }

    $item.getDataItem = function(){
      return getDataItem();
    }

    $item.displayMenu = function(){
      $menu.display();

      return $item;
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
        var $section = $(this);
        clickSection($section);
        options.beforeChange($item);
        return false;
      });

      $item.find( _c([classes.mobilityInput, classes.recessionInput], ' ') )
        .prop('disabled', false)
        .on('change', function(){
          selectChange($(this));
        });

    }

    function destroy(){
      // ToDo

    }

    function create(){
      getDataItem();
      $item.addClass(classes.item);
      loadConfig($item);

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
      var name = 'unit'
      $unit = $('<div />')
        .addClass(classes.unit)
        .css({width: options['size'], height: options['size']});
      values[name] = options['empty-value'];
      if(options['form']){
        var unit_input_name = options['input-name']+"["+dataItem+"]["+name+"]";
        var $unit_input = $('<input />')
          .prop('type','hidden').prop('name',unit_input_name).val(options['empty-value'])
          .data('name',name)
          .addClass(classes.input).addClass(classes.unitInput);
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
          .data('name',name)
          .addClass(classes.input).addClass(classes.sectionInput).addClass(name);
        $section.html($section_input);
      }
      return $section;
    }

    function create_icon(title){
      $img = $('<div />')
          .addClass('image')
          .append( $('<img />').prop('src',options['icons_dir']+options['icon']).css({width: options['size']}) );

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
      var name = 'mobility';
      var mobility_input_name = options['input-name']+"[" +dataItem+"]["+name+"]";
      var mobility_input = $('<select />')
          .prop('name',mobility_input_name)
          .data('name',name)
          .addClass(classes.input).addClass(classes.mobilityInput);

      mobility_values = [options['empty-value']].concat(options['mobility-values']);
      mobility_values.forEach(function(val){
        mobility_input.append( $('<option>', {value: val, text: val}) );
      });
      var mobility = $('<div/>')
          .addClass(classes.mobility)
          .css({width: options['size']})
          .html(mobility_input);
      values[name] = mobility_values[0];
      $item.append(mobility);
    }

    function create_recession(){
      var name = 'recession';
      var recession_input_name = options['input-name']+"[" +dataItem+"]["+name+"]";
      var recession_input = $('<select />')
          .prop('name',recession_input_name)
          .data('name',name)
          .addClass(classes.input).addClass(classes.recessionInput)
        ;
      recession_values = [options['empty-value']].concat(options['recession-values']);
      recession_values.forEach(function(val){
        recession_input.append( $('<option>', {value: val, text: val}) );
      });
      var recession = $('<div/>')
          .addClass(classes.recession)
          .css({width: options['size']})
          .html(recession_input);
      values[name] = recession_values[0];
      $item.append(recession);
    }

    function updateForm(){
      $item.find(_c(classes.input)).each(function(){
        var input = $(this);
        var name = input.data('name');
        input.val(values[name]);
      });
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

        if( unit_value !== options['empty-value'] ){
          addFigure($unit.find(_c(classes.overSection)), unit_value, 'unit');
          $over.css('display', 'block');
        }else{
          $over.css('display', 'none');
        }
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
      options.selectChange($item, select_name);
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

      $item.setValue(section_name, newValue);

      options.sectionClick($item, section_name);
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

  $.fn.ogMenu = function($item,user_options){
    var $menuList = $(this);
    var dataItem = $item.data('item');

    var options = $.extend({
      'menu-title': 'Piece #%dataItem%',
      'menu-icon': true,   // false or url_image

      menuClick: function($item, menuElement){}
    },user_options);

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
      var menu = $('<ul />');

      var menuIcon = '';
      if(options['menu-icon']){
        var img = $("<img />").prop('src',options['icons_dir']+options['icon']).css({'max-width': '15px', 'max-height': '15px'});
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
              .on('click', function(){
                clickMenu(itemMenu);
              });
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

    function clickMenu(itemMenu){
      if(itemMenu.type == 'unit'){
        $item.setValue('unit', itemMenu['index']);

      }else if(itemMenu.type == 'section'){
        var sections = options['sections'].split(',');
        $item.setValue(sections, itemMenu['index']);

      }else if(itemMenu.type == 'clean' && itemMenu.all ){
        var sections = options['sections'].split(',') ;
        var all = sections.concat(['recession','mobility','unit']);
        $item.setValue(all, options['empty-value']);

      }else if(itemMenu.type == 'clean'){
        var sections = options['sections'].split(',');
        $item.setValue(sections, options['empty-value']);

      }else if(itemMenu.type == 'function'){
        itemMenu.action($item);

      }
      options.menuClick($item, itemMenu);
    }

    return $menuList;
  }

  function _c(class_name, separator){
    if(typeof class_name == 'object' && _isset(separator)){
      var out = '';
      $.each(class_name, function(c){
        out = out + '.' + class_name[c] + separator;
      });
      return out.trim();
    }else{
      return '.'+class_name;
    }
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
