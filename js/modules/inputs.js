Core.loadModule('inputs', function(sandbox) {
	
	var self,
		 go_button = sandbox.find('go'),
		 stop_button = sandbox.find('stop'),
		 radius	  = sandbox.find('radius');
		 speed	  = sandbox.find('speed');

	return {
		
		init: function() {
			self = this;
			
			self.assignBehaviors();
		},
		
		onReady: function() {
			var r = sandbox.getValue(radius),
				 s = sandbox.getValue(speed);
				
			sandbox.setValue(radius, r);
			sandbox.notify('radius-changed', r);

			sandbox.setValue(speed, s);
			sandbox.notify('speed-changed', s);
		},
		
		assignBehaviors: function() {
			
			sandbox.addBehavior(go_button, 'click', function() {
				sandbox.notify('go-button-clicked');
			});
			
			sandbox.addBehavior(stop_button, 'click', function() {
				sandbox.notify('stop-button-clicked');
			});
			
			sandbox.addBehavior(radius, 'keyup', function() {
				var val = sandbox.getValue(radius);
				sandbox.notify('radius-changed', val);
			});
			
			sandbox.addBehavior(speed, 'keyup', function() {
				var val = sandbox.getValue(speed);
				sandbox.notify('speed-changed', val);
			});
		}

	};

});
