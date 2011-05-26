Core.loadModule('lucky', function(sandbox) {
	
	var self,
		 helpers,
		 lucky = sandbox.find('lucky'),
		 radius,
		 speed,
		 moving = false,
		 center;
		
	return {
		
		init: function() {
			self = this;
			helpers = self.helpers;
			
			sandbox.listen('viewport-ready', self.fadeIn);
			sandbox.listen('wrapper-height-changed', self.center);
			sandbox.listen('radius-changed', self.setRadius);
			sandbox.listen('speed-changed', self.setSpeed);
			sandbox.listen('go-button-clicked', self.revolve);
			sandbox.listen('stop-button-clicked', self.stop);
		},
		
		helpers: ['lucky'],
		
		fadeIn: function() {
			sandbox.appear(lucky);
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
			
			var pos = helpers.lucky.circumfrenceXY({'x': center.x, 'y': center.y, 'degree': i, 'radius': radius});

		   sandbox.setCSS(lucky, {'top': pos.y, 'left': pos.x});
			
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
			
			var pos = helpers.lucky.circumfrenceXY({'x': center.x, 'y': center.y, 'degree': 1, 'radius': radius});
		
			sandbox.animate(lucky, {'top': pos.y, 'left': pos.x}, {'duration': 1000, 'complete': function() {
				sandbox.notify('lucky-has-moved-out-to-circumfrence');
				
				if (sandbox.isFunction(callback)) {
					callback();
				}
				
			}});
		}
		
	};

});