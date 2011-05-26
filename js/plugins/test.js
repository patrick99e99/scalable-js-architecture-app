Core.loadPlugin('test', function($) {

	var self,
		 dom;
		
	return {
		init: function() {
			dom = Core.getPlugin('dom');
		},
			
		testBounds: function(bounds, color) {
			if (Core.isUndefined(color)) {
				color = 'red';
			}
			
			var viewport_top = sandbox.getScrollTop(),
				
				makeTestElement = function() {
					return sandbox.createElement('div', {'style': 'position: absolute; z-index: 99999; top: 0px; bottom: auto; background: ' + color + ';'});
				},
				
				top	   = makeTestElement(),
				bottom = makeTestElement(),
				left   = makeTestElement(),
				right  = makeTestElement();
				
			dom.setCSS(top,    { 'top': bounds.top + 'px', 'height': '1px', 'width': '100%' });
			dom.setCSS(right,  {'left': bounds.left + 'px', 'height': '100%', 'width': '1px', 'top': viewport_top + 'px' });
			dom.setCSS(bottom, { 'top': bounds.bottom + 'px', 'height': '1px', 'width': '100%' });
			dom.setCSS(left,   {'left': bounds.right + 'px', 'height': '100%', 'width': '1px', 'top': viewport_top + 'px' });

			dom.insertHTML(self.body, top);
			dom.insertHTML(self.body, right);
			dom.insertHTML(self.body, bottom);
			dom.insertHTML(self.body, left);
		},
		
		bench: function(method, iterations, args) {
		    /*
		     * Returns the execution time of @param func method with the given 
		     * @param Array arguments over @param int iterations number of executions. 
		     */
		    var _args = Array.prototype.slice.call(arguments);

		    var time = 0;
		    var timer = function(action){
				var d = new Date();
		
				if (time < 1 || action === 'start') {
		            time = d.getTime();
		            return 0;
		        }
				else if(action === 'stop') {
					var t = d.getTime() - time;
					time = 0;
					return t;
		        }
				else{
					return d.getTime() - time;
		        }
		    };

			var result = [];
			var i=0;
			timer('start');
	
			while(i < iterations) {
		        result.push(method(_args.slice(2)));
		        i++;
		    }

			var execTime = timer('stop');

			if (typeof(console) === "object") {
		        Core.log('execTime/iterations: ' + execTime/iterations);
		        Core.log('execTime: ' + execTime);
		        Core.log('result: ' + result[0]);
		    }
		    return execTime;
		}
	}
});