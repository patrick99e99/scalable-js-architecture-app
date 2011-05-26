Core.loadPlugin('ui', function($) {

	var self,
		 dom;

	return {
			init: function() {
				self = this;
	 			dom  = Core.getPlugin('dom');
			},
			
			makeDraggable: function(element, options) {
				element = dom.find(element);
				
				return element.draggable(options);
			},

			makeDroppable: function(collection, options) {
				return collection.droppable(options);
			},

			makeResizable: function(element, options) {
				return dom.find(element).resizable(options);
			},
			
			isResizable: function(element) {
				return dom.find(element).hasClass('ui-resizable');
			},
			
			disableResizable: function(element) {
				return dom.find(element).resizable('disable');
			},
			
			enableResizable: function(element) {
				return dom.find(element).resizable('enable');				
			},			
			
			makeSortable: function(element, options) {
				return dom.find(element).sortable(options);
			},
			
			makeSlider: function(element, options) {
				element = dom.find(element);

				var slider = element.slider(options),
					 handle = dom.down(slider, 'a.ui-slider-handle');
				
				// stop browsers from display status information when hovering over the slider handle
				dom.removeHref(handle);
				
				return slider;
			},
			
			destroySlider: function(element) {
				element = dom.find(element);
				
				return element.slider('destroy');
			},
			
			setSliderValue: function(element, value) {
				element = dom.find(element);
				
				return element.slider('value', value);
			},
			
			makeSelectMenu: function(element, options) {
				element = dom.find(element);
				element.selectmenu(options);
				
				return element;
			},
			
			getKeyCode: function(key) {
				return $.ui.keyCode[key.toUpperCase()];
			}
			
	};
	
});