Core.loadModule('viewport', function(sandbox) {
	
	var self,
		 wrapper = sandbox.find('wrapper');
		
	return {
		
		init: function() {
			self = this;

			self.assignBehaviors();
		},
		
		onReady: function() {
			self.adjustWrapperHeight();
		},
		
		assignBehaviors: function() {
			
			sandbox.addBehavior(window, 'resize', function() {

				self.adjustWrapperHeight();
				
			});
		},
		
		adjustWrapperHeight: function() {
		 	viewport_height = sandbox.getHeight(window);
			sandbox.setCSS(wrapper, {'height': viewport_height + 'px'});
			
			sandbox.notify('wrapper-height-changed');
		}
		
	};

});
