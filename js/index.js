var 	_controls = bindByName();

bindEvents(_controls, {
	'menuItemFirst click': function(){
		_controls.menuActiveItem.innerHTML = '<i class="dropdown-icn __flag-en"></i>En';
	},
	'menuItemSecond click': function(){
		_controls.menuActiveItem.innerHTML = '<i class="dropdown-icn __flag-fr"></i>Fr';
	},
});

CtxMenu2({
	label: _controls.menuLabel,
	menu: _controls.menuList,
	active_cls: '__active',
});

	
function bindByName(root, bindings){
	var 	$nodes = (root || document).querySelectorAll('[data-co]'),
			collection = bindings || {},
			node, name,
			i = $nodes.length;

	while(i-- > 0){
		node = $nodes[i];
		name = node.getAttribute('data-co').replace(/-(\w)/g, function(s, p) {return p.toUpperCase();});

		if(Array.isArray(collection[name])){
			collection[name].push(node);
		}else if(collection[name]){
			collection[name] = [collection[name], node];
		}else{
			collection[name] = node;
		}
	}

	return collection;
};
function bindEvents(controls, events){
	var 	pos, control,
			controlName, eventName;

	for(var key in events){
		pos = key.indexOf(' ');
		
		if(pos != -1){
			eventName = key.substr(pos + 1);
			controlName = key.substr(0, pos);
			control = controls[controlName];

			if(Array.isArray(control)){
				pos = control.length;
				while(pos-- > 0){
					control[pos]['on' + eventName] = events[key];
				}
			}else if(control){
				control['on' + eventName] = events[key];
			}
		}
	}
};
// @param {HtmlElement} conf.label
// @param {HtmlElement} conf.menu
// @param {String} conf.active_cls - activity mark 
function CtxMenu2(conf){
	// Open or hide menu
	conf.label.onclick = function(){
		var $list = conf.menu;

		if($list.style.display == 'none'){ // is hidden
			$list.style.display = '';
			conf.label.classList.add(conf.active_cls);
		}else{
			$list.style.display = 'none';
			conf.label.classList.remove(conf.active_cls);
		}
	};
	// Hide menu list (1)
	conf.menu.onmouseout = function(e){
		var 	$target = e.toElement || e.relatedTarget,
				$label = conf.label;

		if(!(
			$target === $label || $label.contains($target)
		)){
			conf.menu.style.display = 'none';
			conf.label.classList.remove(conf.active_cls);	
		}
	};
	// Hide menu list (1)
	conf.label.onmouseout = function(e){
		var 	$target = e.toElement || e.relatedTarget,
				$list = conf.menu,
				$label = conf.label;

		if(
			!$label.contains($target) && !$list.style.display
		){
			$list.style.display = 'none';	
			$label.classList.remove(conf.active_cls);
		}
	};
}