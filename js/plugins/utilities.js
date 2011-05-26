Core.loadPlugin('utilities', function($) {

	var self,
		 dom,
		
		 getType = function(o) {
			return Object.prototype.toString.call(o).match(/\w+/g)[1]; 
		 },
		
		 types = {'str': getType(''),
					 'num': getType(0),
					 'obj': getType({}),
					 'arr': getType([]),
					  'fn': getType(Function())};

	return {
		init: function() {
			self = this;
			dom  = Core.getPlugin('dom');
		},
		
		isBlank: function(obj) {
			return self.isString(obj) ? (self.strip(obj).length == 0) : (obj.length == 0);
		},
		
		strip: function(str) {
			return str.replace(/^\s+|\s+$/g, '');
		},
		
		isUndefined: function(obj) {
			return (typeof obj === 'undefined');
		},
		
		isFunction: function(obj) {
			return getType(obj) === types.fn;
		},      
		
		isArray: function(obj) {         
			return getType(obj) === types.arr;
		},                         
                                         
		isString: function(obj) {        
			return getType(obj) === types.str;
		},
		                                 
		isNumber: function(obj) {        
			return getType(obj) === types.num;
		},                               
		                                 
		isObject: function(obj) {        
			return getType(obj) === types.obj;
		},

		toArray: function(obj) {
			return (self.isArray(obj) || obj instanceof jQuery) ? obj : [obj];
		},

		each: function(collection, block) {
			return $.each(collection, block);
		},
		
		map: function(collection, block) {
			if (self.isObject(collection)) {
				var arr = [];
				
				for (var key in collection) {
					arr.push(block(key, collection[key]));
				}
				
				return arr;
			}
			else {
				return $.map(collection, block);
			}
		},
		
		extend: function(obj) {
			// merge objects into a new object so that this is not a destructive action
			return $.extend.apply(this, [{}].concat(Array.prototype.slice.call(arguments)));
		},
		
		clone: function(obj) {
			if (self.isObject(obj)) {
				return $.extend(true, {}, obj);
			}
			else if (self.isArray(obj)) {
				return [].concat(obj);
			}
		},
		
		serializeArray: function(form) {
			form = dom.find(form);
			
			return form.serializeArray();
		},
		
		urlWriter: function(base, params) {
			var arr = [];
			
			for (var key in params) {
				// create foo=bar
				arr.push(key + '=' + params[key]);
			}
			
			return base + '?' + arr.join("&");
		},
		
		hasClassFn: function(element) {
			return function(class_name) { return dom.hasClass(element, class_name); };
		},

		capitalize: function(str) {
			return str.charAt(0).toUpperCase() + str.slice(1, str.length).toLowerCase();
		},
		
		singularize: function(str) {
			// simple singularize function turns "photos" into "photo", but does not turn "stories" into "story"!
			var len = str.length - 1;

			if (str.charAt(len) == 's') {
				str = str.slice(0, len);
			}
			
			return str;
		},
		
		floatTrim: function(number, options) {
			options = self.extend({'precision': 2}, options);
			
			return parseFloat(number).toFixed(options.precision);
		},
		
		zeroPad: function(number) {
			// pad single digits 1 => 01
			
			if (!number) {
				number = 0;
			}
			
			return ('0' + number).slice(-2);
		},
		
		randomWithinRange: function(min, max) {
			return Math.floor(Math.random() * (max - min)) + min;
		},
		
		toTimeCode: function(str) {
			// takes a string containing a floating point number and converts it to timecode
			// 1234.56 => 12:34:56
			//   12.34 => 00:12:34
			var match_data = /(\d??\d??)(\d\d?)(?:\.(\d\d?))?$/.exec(str);

			var timecode = self.zeroPad('0' + match_data[1]) + ':' +
						   	self.zeroPad(match_data[2])		 + ':' +
						   	self.zeroPad(match_data[3]);

			return timecode;
		},
		
		resizeByAspect: function(image, options) {
			options = self.extend({'force': false}, options);
			var new_size,
				 image_size = {'x': dom.getWidth(image),
									'y': dom.getHeight(image)};
				
			if (image_size.x > image_size.y) {
				new_size = {'x': options.x,
								'y': Math.round(options.x * (image_size.y / image_size.x))};
			}
			else if (image_size.x < image_size.y) {
				new_size = {'x': Math.round(options.y * (image_size.x / image_size.y)),
								'y': options.y};
			}
			else {
				new_size = {'x': options.x, 'y': options.y};
			}
			
			// enlarge the image to match the specified sizes
			if (options.force) {
				var enlarge = function(a, b) {
					if (a < b) {
						var diff = b - a;
						new_size.x += diff;
						new_size.y += diff;
					}
				};
				
				enlarge(new_size.x, options.x);
				enlarge(new_size.y, options.y);
			}
			
			dom.setCSS(image, {'width': new_size.x + 'px',
								 	'height': new_size.y + 'px'});

			return new_size;
		},
		
		center: function(element, container) {
			var container_size = {'x': dom.getWidth(container),
										 'y': dom.getHeight(container)},
				 element_size	 = {'x': dom.getWidth(element),
									 	 'y': dom.getHeight(element)},
									
				 centered		 = {'x': Math.round((container_size.x - element_size.x) / 2),
										 'y': Math.round((container_size.y - element_size.y) / 2)};

			dom.setCSS(element, {'top': centered.y + 'px', 'left': centered.x + 'px'});
			
			// return the center pixel data
			return centered;
		},
	
		getBounds: function(element) {

			var height  	    = dom.getHeight(element, false),
				 width  		    = dom.getWidth(element, false),
				 offset 		    = dom.getOffset(element),

             border_width   = self.getBorderWidth(element),               
				 padding		    = self.getPadding(element),

				 outer_width	 = (width + border_width.left + border_width.right + padding.left + padding.right),
				 outer_height	 = (height + border_width.top + border_width.bottom + padding.top + padding.bottom),

			 	 bounds = { 'top': Math.round(offset.top),
							 'right': (offset.left + outer_width),
							'bottom': Math.round(offset.top + outer_height),
							  'left': (offset.left),
							 'width': outer_width,
							'height': outer_height };

			return bounds;
		},

		getPadding: function(element) {
			return {'top': dom.getCSSAsInt(element, 'padding-top'),
				   'right': dom.getCSSAsInt(element, 'padding-right'),
				  'bottom': dom.getCSSAsInt(element, 'padding-bottom'),
				    'left': dom.getCSSAsInt(element, 'padding-left')};
		},

		getBorderWidth: function(element) {
			return {'top': dom.getCSSAsInt(element, 'border-top-width'),
				  	'right': dom.getCSSAsInt(element, 'border-right-width'),
				  'bottom': dom.getCSSAsInt(element, 'border-bottom-width'),
				  	 'left': dom.getCSSAsInt(element, 'border-left-width')};
		},

		getAbsoluteCSS: function(element) {
			return { 'top': dom.getCSS(element, 'top'),
					 'right': dom.getCSS(element, 'right'),
					'bottom': dom.getCSS(element, 'bottom'),
					  'left': dom.getCSS(element, 'left') };
		},
		
		first: function(arr) {
			return self.toArray(arr)[0];
		},
		
		last: function(arr) {
			arr = self.toArray(arr);
			return arr[arr.length - 1];
		},
		
		getKeyFromObjectValue: function(obj, value) {			
			// passing in the object {'foo': 'bar'} and value 'bar' will return ==> 'foo'
			var found;
			
			for (var name in obj) { 
				if (obj[name] == value) {
					found = true;
					break;
				}
			}
			
			return found ? name : null;
		},
		
		without: function(items, to_remove) {
			to_remove = self.toArray(to_remove),
			len		  = to_remove.length;

			if (self.isArray(items)) {
				// if an array was passed in, remove the list of items from it
				var arr = [].concat(items);
				
				for (var i = 0; i < len; i++) {
					var index = arr.indexOf(to_remove[i]);

					if (index != -1) {
						arr.splice(index, 1);
					}
				}
				
				return arr;
			}
			else if (self.isObject(items)) {
				// if an object was passed in, remove the items by key
				var obj = self.extend({}, items);
				
				for (var i = 0; i < len; i++) {
					delete obj[to_remove[i]];
				}

				return obj;
			}
		},
		
		arrayIncludes: function(arr, item) {
			return arr.indexOf(item) != -1;
		},
		
		arrayInsert: function(arr, to_insert, index) {
			// make it so that -1 means at the end of the array
			if (index == -1) {
				index = arr.length;
			}
			// make it so that -2 means 2nd from the last position
			else if (index < -1) {
				index += 1;
			}
			
			arr.splice(index, 0, to_insert);
		
			return arr;
		},
		
		getKeys: function(obj) {
			var keys = [];
			
			for (var name in obj) {
				keys.push(name);
			}
			
			return keys;
		},
		
		findObjectInArrayByKeyAndValue: function(arr, key, value) {
			// returns an object based off of a known key and value:
			//
			// arr = [{'name': 'picasa', 'login': 'foobar'}, {'name': 'flickr', 'login': 'johnson'}] 
			// findObjectInArrayByKeyAndValue(arr, 'name', 'picasa') => {'name': 'picasa', 'login': 'foobar'}
			//
			var found,
				len = arr.length;
			
			for (var i = 0; i < len; i++) {
				var obj = arr[i];
				
				if (obj[key] == value) {
					found = obj;
					break;
				}
				
			}
			
			return found;
		},

		interpolate: function(str, obj) {
			for (var key in obj) {
				str = str.replace(new RegExp('#{' + key + '}', 'gi'), obj[key]);
			}
			
			return str;
		},
		
		truncate: function(str, max_chars) {
			return str.length > max_chars ? str.slice(0, max_chars) + '...' : str;
		},
		
		bracketizeData: function(obj) {
			// should take {foo: {'bar': 123, 'baz': 456}, bar: {'foo': 999}} 
			//
			//	and turn it into:	{'foo[bar]': 123, 'foo[baz]': 456, 'bar[foo]': 999}
			//
			var bracketized = {};
			
			for (var k1 in obj) {
				if (self.isObject(obj[k1])) {
					
					for (k2 in obj[k1]) {
						// foo[bar]
						bracketized[k1 + '[' + k2 + ']'] = obj[k1][k2];
					}
					
				}
				else {
					bracketized[k1] = obj[k1];
				}
			}
			
			return bracketized;
		},
		
		toPostData: function(form, namespace) {
			var serialized_form = self.serializeArray(form);
		
			return self.toSerializedJSON(serialized_form, namespace);
		},
	
		toSerializedJSON: function(arr, namespace) {
			// takes a serialized array of objects and outputs a namespaced JSON object
			//
			// { 'photo':  { 'name': 'foobar' } }
		
			if (!self.isArray(arr)) {
				return false;
			}
		
			var namespaced = {},
				len = arr.length;

			namespaced[namespace] = {};
		
			// serialized array looks like: [Object { name="foo", value="bar"}]

			for (var i = 0; i < len; i++) {
				var obj = arr[i];
				namespaced[namespace][obj.name] = obj.value;
			}
		
			return namespaced;
		},
	
		namespacedObject: function(namespace, obj) {
			var namespaced_obj = {};
			namespaced_obj[namespace] = obj;
		
			return namespaced_obj;
		},
		
		areObjectsEqual: function(obj1, obj2) {
			// check that all key/values in obj1 match that of obj2.
			// {'a': 123}, 			 {'a': 123, 'b': 456} => true
			// {'a': 123, 'b': 456}, {'a': 456, 'b': 456} => false
			
			var equal = true;
						
			for (key in obj1) {
				value = obj1[key];
				
				if (obj2[key] != value) {
					equal = false;
					break;
				}
			}
			
			return equal;
		},
		
		copyObjectValues: function(values, obj1, obj2) {
			values = self.toArray(values);
			
			var new_obj = self.clone(obj2);
			
			for (var i = 0; i < len; i++) {
				var value = values[i];
				new_obj[value] = obj1[value];
			}
			
			return new_obj;
		},
		
		dasherize: function(str) {
			return str.replace(/[\s_]/g, '-').toLowerCase();
		}
	};
	
});