Core.loadPlugin('dom', function($) {

	var cached,
	 	 self,
		 body,
		 utilities,
		 event_manager,
		
		 doc,
		 wind,
       
		 findByCache = function(el_id) {
		 	var element = cached[el_id];
         
		 	if (!element) {
		 		var found = doc.getElementById(el_id);
         
		 		if (found) {
		 			element = cached[el_id] = $(found);
		 		}
		 		else {
		 		 	element = false;
		 		}
		 	}
         
		 	return element;
		 },
         
		 removeCachedElements = function(element) {
		 	var id = element.attr('id');
         
		 	if (cached[id]) {
		 		delete cached[id];
		 	}
         
		 	// find all nested elements with ids and remove them from the cache if they exist
		 	element.find('[id]').map(function () {
		 		id = this.id;
		 		if (cached[id]) {
		 			delete cached[id];
		 		}
		 	});
		 };
       
		 
	return {
			init: function() {
				self = this;

 				cached = {};

				doc = document;
				win = window;
				
				body = $(doc.getElementsByTagName("body")[0]);
				
				event_manager = Core.getPlugin('event_manager');
				utilities	  = Core.getPlugin('utilities');
			},
			
			find: function(element) {

				// avoid looking up the element if it's already a jQuery object.
				if (element instanceof jQuery) {
					return element;
				}
				else if (utilities.isString(element)) {

					// return the cached body
					if (element == '<body>') {
						return body;
					}

					var cached = findByCache(element);

					return cached ? cached : self.findBySelector(element);
				}
				else {
					// if raw html is passed in, wrap it as a jQuery object
					return $(element);
				};
			},
			
			findBySelector: function(selector) {
				// returns a jQuery object of elements
				if (selector instanceof jQuery) {
					return selector;
				}
				
				else {
					return $(selector);		
				}
			},
			
			getBody: function() {
				return body;
			},
			
			bind: function(element, event, fn, options) {
				options = utilities.extend({'skip_event_manager': false}, options);
				
				if (!options.skip_event_manager) {
					fn = event_manager.wrapBindFunction(element, event, fn);
				}

				return self.find(element).bind(event, fn);
			},

			unbind: function(element, event, fn) {
				return self.find(element).unbind(event, fn);
			},
			
			hasEvent: function(element, event) {
				element = self.find(element);
				
				if (element.data && element.data('events')) {
					return element.data('events')[event];
				}
				
				return false;
			},

			down: function(element, selector) {
				// return the first found selector inside a container
				element = self.find(element);
				var found = element.find(selector).eq(0);
				
				return !utilities.isBlank(found) ? found : null;
			},

			up: function(element, selector) {
				// returns the outer html element
				element = self.find(element);
				
				return selector ? element.closest(selector) : element.parent();
			},
			
			next: function(element) {
				return self.find(element).next();
			},
			
			focus: function(element) {
				return self.find(element).focus();
			},
			
			blur: function(element) {
				return self.find(element).blur();
			},
			
			findElementWithChild: function(element, to_return, child) {
				//  to return all submenus that have a nested .volume: 
				//	$('.clip').find('.submenu:has(.volume)')
				
				return self.find(element).find(to_return + ':has(' + child + ')');
			},
			
			isOnPage: function(element) {
				var element = self.find(element);
				return element.parent().length != 0;
			},

			children: function(element, selector) {
				return self.find(element).find(selector);
			},
			
			hasChild: function(element, child) {
				var found = self.find(element).find(child);
				
				return !utilities.isBlank(found);
			},
			
			each: function(collection, block) {
				collection.each(block);
			},

			resetSelect: function(select) {
				select = self.find(select);
				var values = self.getSelectOptionValues(select);

				return self.setValue(select, values[0]);
			},

			getSelectOptionValues: function(select) {
				return self.find(select).find('option').map(function() { 
						return this.value;
					}).get();
			},
			
			getValue: function(input) {
				return self.find(input).val();
			},

			setValue: function(input, value) {
				return self.find(input).val(value);
			},

			clone: function(element) {
				var deep = true;

				return self.find(element).clone(deep);
			},

			attr: function(element, attributes) {
				return self.find(element).attr(attributes);
			},
			
			removeAttr: function(element, attributes) {
				return self.find(element).removeAttr(attributes);
			},
			
			trigger: function(element, event) {
				return self.find(element).trigger(event);
			},

			insertHTML: function(element, html, position) {
				element = self.find(element);
				html = utilities.toArray(html);
				
				var len = html.length;
				
				for (var i = 0; i < len; i++) {
					var el = html[i];
					
					if (position == 'top') {
						element.prepend(el);
					}
					else {
						element.append(el);
					}
				}

				return element;
			},
			
			moveElement: function(container, element) {
				return self.find(container).append(self.find(element));
			},

			hide: function(element) {
				return self.find(element).hide();
			},

			show: function(element, effect, duration) {
				return self.find(element).show(effect, duration);
			},

			hideAll: function(collection) {
				return self.hide(collection);
			},

			showAll: function(collection) {
				return self.show(collection);
			},
			
			visibleHide: function(element) {
				 return self.setCSS(element, {'visibility': 'hidden'}); 
			},
			
			visibleShow: function(element) {
				return self.setCSS(element, {'visibility': 'visible'});
			},
			
			isVisible: function(element) {
				return self.find(element).css('visibility') == 'visible';
			},
			
			without: function(collection, element) {
				element = self.find(element);
				return collection.not(element);
			},

			getText: function(element) {
				// handle text from text areas as well as from standard elements
				return (self.isTextArea(element)) ? self.find(element).val() : self.find(element).text();
			},

			setText: function(element, text) {
				return (self.isTextArea(element)) ? self.find(element).val(text) : self.find(element).text(text);
			},

			setHTML: function(element, html) {
				return (self.find(element)).html(html);
			},

			clearHTML: function(element) {
				return (self.find(element)).html('');
			},

			isTextArea: function(element) {
				element = self.find(element);
				
				return self.getTagName(element) === 'textarea';
			},

			hasClass: function(element, class_name) {
				return self.find(element).hasClass(class_name);
			},

			createElement: function(element, attributes) {
				element = $('<' + element + '>');

				if (attributes) {
					element.attr(attributes);
					
					// add to cache object
					if (attributes.id) {
						cached[attributes.id] = element;
					}
				}
				
				return element;
			},

			addClass: function(element, class_name) {
				return self.find(element).addClass(class_name);
			},

			removeClass: function(element, class_name) {
				return self.find(element).removeClass(class_name);
			},
			
			swapClasses: function(element, class_1, class_2) {
				element = self.find(element);
				
				if (element.hasClass(class_1) && !element.hasClass(class_2)) {
					self.removeClass(element, class_1);
					self.addClass(element, class_2);
				}
				else if (element.hasClass(class_2) && !element.hasClass(class_1)) {
					self.removeClass(element, class_2);
					self.addClass(element, class_1);
				}

				return element;
			},

			getWidth: function(element, outer) {
				if (self.isWindowOrDocument(element)) {
					return $(element).width();
				}
				
				element = self.find(element);
				
				if (self.isImageElement(element)) {
					// if it's an actual image element, then just return the width property of the element
					return element.get(0).width;
				}
				else if (outer == false) {
					// just get the raw width, not computing the border/padding
					return element.width();
				}
				else {
					// get the total width
					return element.outerWidth(true);
				}
			},
			
			setWidth: function(element, width) {
				return self.find(element).width(width);			
			},

			getHeight: function(element, outer) {
				
				if (self.isWindowOrDocument(element)) {
					return $(element).height();
				}
				
				element = self.find(element);
				
				if (self.isImageElement(element)) {
					// if it's an actual image element, then just return the height property of the element
					return element.get(0).height;
				}
				else if (outer == false) {
					// just get the raw height, not computing the border/padding
					return element.height();
				}
				else {
					// get the total height
					return element.outerHeight(true);
				}
			},
			
			setHeight: function(element, height) {
				return self.find(element).height(height);
			},
			
			isImageElement: function(element) {
				return self.getTagName(element) === 'img';
			},
			
			getTagName: function(element) {
				return self.find(element).get(0).tagName.toLowerCase();
			},
			
			isWindowOrDocument: function(obj) {
				return (obj === win || obj === doc);
			},

			getCSS: function(element, attribute) {
				element = self.find(element);
				
				// convert the attribute to a lowercased string
				return (element.css(attribute) + '').toLowerCase();
			},
			
			getCSSAsInt: function(element, attribute) {
				return parseInt(self.getCSS(element, attribute), 10);
			},

			setCSS: function(element, obj) {
				return self.find(element).css(obj);
			},

			remove: function(collection) {

				collection = utilities.toArray(collection);

				for (var i = 0, len = collection.length; i < len; i++) {
					var el = $(collection[i]);
					removeCachedElements(el);
					el.remove();
				}

				return collection;				
			},

			getPosition: function(element) {
				return self.find(element).position();
			},

			getOffset: function(element) {
				return self.find(element).offset();
			},

			setOffset: function(element, offset) {
				return self.find(element).offset(offset);
			},

			getId: function(element) {
				return self.find(element)[0].id;
			},
			
			setId: function(element, new_id) {
				element = self.find(element);

				var id = element.attr('id');
				cached[new_id] = cached[id];
				delete cached[id];
				
				return element.attr('id', new_id);
			},
			
			getScrollTop: function() {
				return $(window).scrollTop();
			},

			disableTextSelection: function(element) {
				return self.find(element).disableTextSelect();
			},

			enableTextSelection: function(element) {
				return self.find(element).enableTextSelect();	
			},
			
			removeHref: function(element) {
				self.removeAttr(element, 'href');
				self.attr(element, {'tabindex': 0});
				
				return element;
			},
			
			stopBubbles: function(event) {
				return event.stopPropagation();
			},
			
			isInside: function(outer, inner) {
				outer = self.find(outer);
				inner = self.find(inner);
				return inner.parents(outer).length == 1;
			}

	};
	
});