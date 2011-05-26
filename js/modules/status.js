Core.loadModule('status', function(sandbox) {
	
	var self,
		 status = sandbox.find('status');
		
	return {
		
		init: function() {
			self = this;
			
			sandbox.listen('lucky-is-moving', self.travelMessage);
			sandbox.listen('lucky-has-stopped', self.stopMessage);
			sandbox.listen('lucky-is-moving-in-to-center', self.movingInMessage);
			sandbox.listen('lucky-is-moving-out-to-circumfrence', self.movingOutMessage);
			sandbox.listen('lucky-has-moved-in-to-center', self.movedInMessage);
		},

		onReady: function() {
			self.idleMessage();
		},

		idleMessage: function() {
			self.setMessage('Lucky is idle');
		},

		travelMessage: function() {
			self.setMessage('Lucky is going for a walk');
		},
		
		stopMessage: function() {
			self.setMessage('Lucky has stopped');
		},
		
		movingInMessage: function() {
			self.setMessage('Lucky is coming back');
		},
		
		movingOutMessage: function() {
			self.setMessage('Lucky is preparing');
		},
		
		movedInMessage: function() {
			self.setMessage('Lucky is back');
		},
		
		setMessage: function(message) {
			sandbox.setText(status, message);
		}
	};

});
