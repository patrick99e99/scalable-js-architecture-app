Core.loadModule('lucky', function(sandbox) {
	
	var self,
		 helpers,
		 lucky = sandbox.find('lucky'),
		 radius,
		 speed,
		 start_degree,
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
		
		center: function(wrapper) {
			center = sandbox.center(lucky, wrapper);
		},
		
		setRadius: function(r) {
			radius = r;
		},
		
		setSpeed: function(s) {
			speed = s;
		},
		
		revolve: function() {
			if (moving) {
				return false;
			}
			
			self.moveOutToCircumfrence(function() {
				// after lucky is ready, set her moving state to true and start moving her 		
				moving = true;
				sandbox.notify('lucky-is-moving');

				self.move(start_degree);
			});

		},
		
		move: function(degree) {
			// stop lucky
			if (!moving || degree >= start_degree + 360) {
			  self.stop();
			  return false;
			}
			
			// figure out the X & Y point of the circle that she should be at...
			var pos = helpers.lucky.circumfrenceXY({'x': center.x, 'y': center.y, 'degree': degree, 'radius': radius});

		   sandbox.setCSS(lucky, {'top': pos.y, 'left': pos.x});
			
			// recursively call this function until we've achieved 360 degrees
			setTimeout(self.move.curry(degree + 1), speed);
		},
		
		stop: function() {
			if (!moving) {
				return false;
			}

			// tell lucky to stop traveling around the circle and come back!
			moving = false;
			self.moveInToCenter();
		},
		
		moveInToCenter: function() {
			sandbox.notify('lucky-is-moving-in-to-center');

			// tell lucky to come back to the center of the viewport
			sandbox.animate(lucky, {'top': center.y, 'left': center.x}, {'duration': 1000, 'complete': function() {
				sandbox.notify('lucky-has-moved-in-to-center');
			}});	
		},
		
		moveOutToCircumfrence: function(callback) {
			sandbox.notify('lucky-is-moving-out-to-circumfrence');
		
			start_degree = helpers.lucky.getRandomDegree();
		
			// figure out the X & Y point of the start of the circle path
			var pos = helpers.lucky.circumfrenceXY({'x': center.x, 'y': center.y, 'degree': start_degree, 'radius': radius});
		
			// tell lucky to start moving out to that point of the path
			sandbox.animate(lucky, {'top': pos.y, 'left': pos.x}, {'duration': 1000, 'complete': function() {
				sandbox.notify('lucky-has-moved-out-to-circumfrence');

				// after she has reached the outer point of the circle, tell her to start moving along the path
				if (sandbox.isFunction(callback)) {
					callback();
				}
				
			}});
		}
		
	};

});