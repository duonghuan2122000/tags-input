(function($){
	var tags = [];
	var divTags;
	var _this;
	var dataTags;
	$.fn.tagsinput = function(options){
		var defaults = {
			typeahead: {
				url: ''
			}
		};

		var ops = $.extend({}, defaults, options);
		_this = $(this);

		_this.css('display', 'none');

		divTags = $('<div class="tagsinput"></div>');

		var vTags = _this.val();
		var placeholder = _this.attr('placeholder') ? _this.attr('placeholder') : '';
		if(vTags){
			tags = vTags.trim(',').split(',');
			tags.forEach(i => {
				$('<span></span>').addClass('__tagsinput_tag label label-info').text(i.trim(' ')).append('<span>x</span>').children().attr('data-role', 'remove').parent().appendTo(divTags);
			});
		}
		input = $('<input>').attr({
			'type': 'text',
			'placeholder': placeholder,
			'data-provide': typeahead
		}).appendTo(divTags);
		_this.before(divTags);

		divTags.on('keypress', 'input', function(e){
			var keycode = (event.keyCode ? event.keyCode : event.which);
		    if(keycode == '13'){
		        e.preventDefault();
		       	var v = $(this).val();
		       	add(v);
		       	$(this).val('');
		    }
		});
		divTags.on('click', '.__tagsinput_tag span', function(){
			remove($(this));
		});

		if(ops.typeahead && ops.typeahead.url){
			$.ajax({
				url: ops.typeahead.url,
				method: 'get',
				dataType: 'json'
			})
			.done(d => divTags.find('input').typeahead({source: d}));
		}
	}

	function add(item){
		if(typeof item !== 'string') return;
		if(!item){
			return;
		}
		var equal = false;
		tags.forEach(i => {
			if(i.toLowerCase() == item.toLowerCase()){
				equal = true;
				return false;
			}
		});
		if(equal) return false;

		var tagNew = $('<span></span>').addClass('__tagsinput_tag label label-info').text(item.trim(' ')).append('<span>x</span>').children().attr('data-role', 'remove').parent();
		divTags.find('input').before(tagNew);
		_this.attr('value', _this.val()+','+item);
		return;
	}
	function remove(object){
		if(typeof object !== 'object') return;
		var tag = object.parent();
		var name = tag.text().replace('x', '');
		tag.remove();
		_this.attr('value',_this.val()+',');
		_this.attr('value',_this.val().replace(name+',', '').slice(0, -1));
		tags = tags.filter(i => i !== name);
	}

	function typeahead(url){
		if(typeof url !== 'string') return;
		var data;
		$.get(url, d => {
			data = d;
			return data;
		});
	}
}(jQuery));