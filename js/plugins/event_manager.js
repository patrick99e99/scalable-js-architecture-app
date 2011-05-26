Core.loadPlugin('event_manager', function($) {

	var self,
		 dom;

	return {
		
		init: function() {
			self = this;
	 		dom = Core.getPlugin('dom');
		},
		
		stop: function() {
			self.state = 'stopped';

			self.removeElements();
			self.disableHoverCSS();
			self.disableAllInteractiveElements();
		},
		
		start: function() {
			self.state = 'active';

			self.enableHoverCSS();
			self.enableAllInteractiveElements();
		},
		
		limit: function(fn, frequency) {
			return $.throttle(frequency, fn);
		},
		
		delay: function(fn, delay) {
			return $.debounce(delay, fn);
		},
		
		wrapBindFunction: function(element, type, fn) {
			// stop any binded events from executing if the event manager is not active.
			
			return function() {
				if (self.state == 'active') {

					try {
						return fn.apply(this, arguments);
					}
					catch(err) {
						Core.log('exception in wrapBindFunction for \'' + type + '\' event on element \'' + dom.getId(element) + '\':');
						Core.log(err.message);
						
						// stop execution of native html elements (such as form submit buttons)
						return false;
					}
				}
				
			};
		},
		
		removeElements: function() {
			var to_remove = dom.findBySelector('.remove_for_event_manager');
			dom.remove(to_remove);
		},
		
		enableHoverCSS: function() {
			dom.addClass('<body>', 'hoverable');
		},

		disableHoverCSS: function() {
			dom.removeClass('<body>', 'hoverable');			
		},

		disableAllInteractiveElements: function() {
			var elements = self.getInteractiveElements();
			
			self.disable(elements.inputs);
			self.disable(elements.selects);
			self.disableUI(elements.selects, 'selectmenu');
			self.disableUI(elements.draggables, 'draggable');
			self.disableUI(elements.resizables, 'resizable');
			
		},
		
		enableAllInteractiveElements: function() {
			var elements = self.getInteractiveElements();

			self.enable(elements.inputs);
			self.enable(elements.selects);
			self.enableUI(elements.selects, 'selectmenu');
			self.enableUI(elements.draggables, 'draggable');
			self.enableUI(elements.resizables, 'resizable');
		},
		
		getInteractiveElements: function() {
			var elements = {};
			
			elements.inputs     = dom.findBySelector('input, textarea');
			elements.selects    = dom.findBySelector('select');
			elements.actions    = dom.findBySelector('.submenu ul');
			elements.draggables = dom.findBySelector('.ui-draggable');
			elements.resizables = dom.findBySelector('.ui-resizable');
			
			return elements;
		},
		
		disable: function(collection) {
			collection.each(function() {
				var element = dom.find(this);
				
				if (!dom.hasClass(element, 'skip_event_manager')) {
					dom.attr(element, {'disabled': true});
				}
			});
		},
		
		enable: function(collection) {
			collection.each(function() {
				var element = dom.find(this);
				dom.removeAttr(element, 'disabled');
			});
		},
		
		disableUI: function(collection, method) {
			collection.each(function() {
				var element = dom.find(this);
				
				if (!dom.hasClass(element, 'skip_event_manager')) {

					// call jQuery-UI disable
					element[method]('disable');
				}
			});
		},
		
		enableUI: function(collection, method) {
			collection.each(function() {
				var element = dom.find(this);
				
				// call jQuery-UI enable
				element[method]('enable');
			});
		}
		
	};
	
});