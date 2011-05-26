Core.loadPlugin('effects', function($) {

	var self,
		 utilities,
		 dom,

		 defaultize = function(options_from_fn, options_from_module) {
		 	 options_from_module = utilities.extend({'duration': 1000}, options_from_module);
          
		 	 // this adds default options, and attaches a convenience method for removing properties so that we can do something like:
		 	 //
		 	 // sandbox.opacityAppear(foo, {'duration': 250, 'to': 1, 'from': 0.5, 'callback': fn});
		 	 //
		 	 // and have it actually turn into this;
		 	 //
		 	 // foo.animate('opacity', {'to': 1}, {'duration': 250, 'complete': fn})
		 	 
		 	 options_from_module.without = function() {
          
		 	 	 if (this.callback) {
		 	 	 	 this.complete = this.callback;
		 	 	 }
             
		 	 	 return utilities.without(this, Array.prototype.slice.call(arguments, 0).concat(['without', 'callback']));
		 	 };
          
		 	 return utilities.extend(options_from_fn || {}, options_from_module);
		 };
		
	return {
			init: function() {
				self      = this;
				
				dom       = Core.getPlugin('dom');
				utilities = Core.getPlugin('utilities');
			},
			
			animate: function(element, css, options) {
				options = utilities.extend({'stop': true}, options);
				
				element = dom.find(element);
				
				// stop any animations currently in progress
				if (options.stop) {
					element.stop();
				}
				
				// remove the non-jquery stop option
				delete options.stop;
				
				return element.animate(css, options);
			},
			
			appear: function(element, callback) {
				element = dom.find(element);
				element.stop();
				element.fadeIn(callback);
			},

			fade: function(element, callback) {
				element = dom.find(element);
				element.stop();
				element.fadeOut(callback);
			},
			
			show: function(element, effect, duration, callback) {
				element = dom.find(element);
				return element.show(effect, duration, callback);
			},

			hide: function(element, effect, duration, callback) {
				element = dom.find(element);
				return element.hide(effect, duration, callback);
			},

			opacityFadeIn: function(element, options) {
				options = defaultize({'from': 0, 'to': 1}, options);

				element = dom.find(element);
				element.stop();

				dom.setCSS(element, {'opacity': options.from, 'visibility': 'visible'});
				self.animate(element, {'opacity': options.to}, options.without('to', 'from'));
			},
			
			opacityFadeOut: function(element, options) {
				options = defaultize({'from': 1, 'to': 0}, options);

				element = dom.find(element);
				element.stop();
								
				dom.setCSS(element, {'opacity': options.from, 'visibility': 'visible'});
				self.animate(element, {'opacity': options.to}, options.without('to', 'from'));
			},
			
			scrollTo: function(element, options) {
				element = dom.find(element);
				options = utilities.extend({'stop': true}, options);
				var browser_window = $('html, body');
				return self.animate(browser_window, {scrollTop: element.offset().top}, options);
			},
			
			glow: function(element, options) {
				// this does not work because jQuery animation has bugs when tweening colors..
				
				options = defaultize(options);
				// options.css => {'border-color': ['#000', '#fff], {'background-color': ['#000']}}
				element = dom.find(element);
				
				element.stop();
				
				var index = 0,
					completeFunction = function() { index += 1; glow(); };
					glow  = function() {
								// loop through all keys in the css hash and set it's value to the current index of it's array value
								for (var name in options.css) {
									
									var css_values = utilities.toArray(options.css[name]),
										css		   = {};
									
									// reset the index back to 0 if it's past it's last element
									if (index == css_values.length) {
										index = 0;
									}
									
									css[name] = css_values[index];
									
								}

								self.animate(element, css, {'duration': options.duration, 'complete': completeFunction, 'stop': false});
							};
							
				glow();
			},
			
			onImagesLoad: function(selector, options) {
				var images = dom.findBySelector(selector);

				images.onImagesLoad({'itemCallback': options.item, 'selectorCallback': options.selector});
			}
			
			
	};
	
});