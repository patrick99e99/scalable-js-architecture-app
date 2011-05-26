Core.loadHelper('lucky', function(sandbox) {
	var pi = Math.PI;

	return {
		
		getRandomDegree: function() {
			return sandbox.randomWithinRange(0, 359);
		},
		
		circumfrenceXY: function(options) {		
			return {'x': options.x + Math.round((Math.cos(options.degree * pi / 180) * options.radius)) + 'px',
		 			  'y': options.y + Math.round((Math.sin(options.degree * pi / 180) * options.radius)) + 'px'};
		
		}
		
	};

});