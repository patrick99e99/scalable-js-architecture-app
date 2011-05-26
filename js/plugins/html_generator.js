Core.loadPlugin('html_generator', function($) {

	var dom,
		 utilities,
		 references,
	 	 self;
	
	return {
			init: function() {
				self      = this;
				dom       = Core.getPlugin('dom');
				utilities = Core.getPlugin('utilities');
			},
			
			create: function(arr) {
				references = {};
				
				var html = self.processArray(arr);

				// return references (using the 'as' option) and actual html markup
				return {'references': references, 'html': html};
			},
			
			processArray: function(arr) {
				arr = utilities.toArray(arr);
				
				var container = [];

				for (var i = 0, len = arr.length; i < len; i++) {
					var obj = self.generateMarkupAndReferences(arr[i]);
					container.push(obj.markup);
					
					if (obj.as) {
						// elements can be references with 'as'.  Example:
						// {'tag': 'div', 'as': 'foo' }
						//
						references[obj.as] = obj.markup;
					}
					
				}

				return container;
			},

			generateMarkupAndReferences: function(obj) {
				obj = self.processObject(obj);

				var markup = dom.createElement(obj.tag, obj.attributes);

				self.setText(markup, obj.text);
				self.setCSS(markup, obj.css);
				self.attachBehaviors(markup, obj.behaviors);
				self.processChildren(markup, obj.children);

				return {'markup': self.jQueryCleanup(markup), 'as': obj.as};
			},
 			
			processChildren: function(markup, children) {
				if (!children) {
					return false;
				}

				dom.insertHTML(markup, self.processArray(children));
			},

			setText: function(markup, text) {
				if (!text) {
					return false;
				}

				dom.setText(markup, text);
			},
			
			setCSS: function(markup, css) {
				if (!css) {
					return false;
				}
				
				dom.setCSS(markup, css);
			},

			attachBehaviors: function(markup, behaviors) {
				if (!behaviors) {
					return false;
				}

				behaviors = utilities.toArray(behaviors);

				for (var i = 0, len = behaviors.length; i < len; i++) {
					var behavior = behaviors[i];

					if (!utilities.isFunction(behavior.method)) {
						return false;
					}
					
					// options => {'skip_event_manager': true}
					dom.bind(markup, behavior.event, behavior.method.curry(markup, references), behavior.options);
				}
			},
			
			jQueryCleanup: function(element) {
				// creating elements with jQuery returns an array-like object, so remove the item from the array as we plan to pass this in our actual container
				return jQuery ? element.get(0) : element;
			},
			
			processObject: function(obj) {

				var attributes = utilities.without(obj, ['behaviors', 'children', 'text', 'tag', 'as', 'css']);

				// convert ['foo', 'bar'] into multiple css class names: 'foo bar'
				// use ['class'] to because .class is reserved in Safari 
				if (utilities.isArray(attributes['class'])) {
					attributes['class'] = attributes['class'].join(' ');
				}

				return { 'behaviors': obj.behaviors,
							 'children': obj.children, 
						 	  	  'text': obj.text, 
						  	   	'tag': obj.tag,
									 'as': obj.as,
									'css': obj.css,
						  'attributes': attributes };
			}
	};
	
});