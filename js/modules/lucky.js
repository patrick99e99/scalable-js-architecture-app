Core.loadModule('lucky', function(sandbox) {
	
	var self,
		 lucky = sandbox.find('lucky'),
		 radius,
		 speed,
		 moving = false,
		 pi = Math.PI,
		 center;
		
	return {
		
		init: function() {
			self = this;
			
			sandbox.listen('wrapper-height-changed', self.center);
			sandbox.listen('radius-changed', self.setRadius);
			sandbox.listen('speed-changed', self.setSpeed);
			sandbox.listen('go-button-clicked', self.revolve);
			sandbox.listen('stop-button-clicked', self.stop);
		},
		
		center: function() {
			var container = sandbox.find('wrapper');
			center = sandbox.center(lucky, container);
		},
		
		setRadius: function(r) {
			radius = parseInt(r, 10);
		},
		
		setSpeed: function(s) {
			speed = parseInt(s, 10);
		},
		
		revolve: function() {
			if (moving) {
				return false;
			}
			
			self.moveOutToCircumfrence(function() {			
				moving = true;
				sandbox.notify('lucky-is-moving');

				// start moving at degree 1
				self.move(1);
			});

		},
		
		move: function(i) {
			// stop lucky
			if (!moving || i >= 360) {
			  self.stop();
			  return false;
			}
			
			var x = center.x + Math.round((Math.cos(i * pi / 180) * radius)) + 'px';
		   var y = center.y + Math.round((Math.sin(i * pi / 180) * radius)) + 'px';
         
		   sandbox.setCSS(lucky, {'top': y, 'left': x});
			
			// recursively call this function until we've achieved 360 degrees
			setTimeout(self.move.curry(i + 1), speed);
		},
		
		stop: function() {
			if (!moving) {
				return false;
			}
			
			moving = false;
			
			self.moveInToCenter();
		},
		
		moveInToCenter: function() {
			sandbox.notify('lucky-is-moving-in-to-center');

			sandbox.animate(lucky, {'top': center.y, 'left': center.x}, {'duration': 1000, 'complete': function() {
				sandbox.notify('lucky-has-moved-in-to-center');
			}});	
		},
		
		moveOutToCircumfrence: function(callback) {
			sandbox.notify('lucky-is-moving-out-to-circumfrence');
			
			var x = center.x + Math.round((Math.cos(pi / 180) * radius)) + 'px';
		   var y = center.y + Math.round((Math.sin(pi / 180) * radius)) + 'px';
		
			sandbox.animate(lucky, {'top': y, 'left': x}, {'duration': 1000, 'complete': function() {
				sandbox.notify('lucky-has-moved-out-to-circumfrence');
				
				if (sandbox.isFunction(callback)) {
					callback();
				}
				
			}});
		}
		
	};

});