Core.loadPlugin('ajax', function($) {

	var self,
		 config,
		 utilities,
		 event_manager,
		 
		 counter = 0,
		 
		 xhrs = {},
		 
		 removeXHRObj = function(xhr_id) {
		 	delete xhrs[xhr_id];
		 },
		 
		 nextXHRObj = function() {
		 	for (var key in xhrs) {
		 		return xhrs[key];
		 	}
		 },
		 
		 getAllAttributes = function(attribute) {
		 	return utilities.map(xhrs, function(xhr_id, xhr_obj) {
		 		return xhr_obj.ajax[attribute];
		 	});
		 },
		 
		 xhrObject = function(obj, self) {
			this.id         = obj.id;
			this.xhr        = null;
			this.delayedFn  = null;
			this.delay      = obj.delay || 0;
			this.beforeSend = obj.beforeSend;
		 	
		 	this.ajax = {'data': obj.data,
							 'type': obj.method || 'get',
		 				'dataType': obj.data_type || 'json',
							  'url': obj.url,
		 				 'isLocal': config.is_local_ajax,
		 	
		 			    	'error': function(jqXHR, textStatus, errorThrown) {

		 									if (utilities.isFunction(obj.failure)) {
												var response;
												
												try {
		 											response = $.parseJSON(jqXHR.responseText);
												}
												catch(err) {
													response = jqXHR.responseText;
												}
												
		 										obj.failure(response, jqXHR.status);
		 									}
	 						
		 				 					Core.log('ajax error: ' + textStatus);
		 								},
		 		
			 			 'success': function(data, textStatus, jqXHR) {
			 							  		if (utilities.isFunction(obj.success)) {
			 										obj.success(data, textStatus, jqXHR );
			 									}
			 							},
       
			 			'complete': function(data, textStatus, jqXHR) {
			 									if (utilities.isFunction(obj.complete)) {
			 										obj.complete(data, textStatus, jqXHR);
			 									}
		 					
			 									removeXHRObj(obj.id);
		 						
			 									// continue executing pending ajax requests if there are any...
			 									var next_xhr_obj = nextXHRObj();
       
			 									if (next_xhr_obj) {
			 										self.execute(next_xhr_obj);
			 									}
			 							}
		 	};
		 };

	return {
			init: function() {
				self = this;
				
				config 		  = Core.getPlugin('config');
				utilities	  = Core.getPlugin('utilities');
				event_manager = Core.getPlugin('event_manager');
			},
			
			request: function(obj) {
				obj.id = 'xhr_' + (counter += 1);
				
				// build the xhr object
				var xhr_obj = new xhrObject(obj, self);
				
				// store it in the queue if there isn't already an identical request
				if (self.isUnique(xhr_obj)) {
					xhrs[obj.id] = xhr_obj;

					if (obj.asynchronous || utilities.getKeys(xhrs).length == 1) {
						// only execute the request if it's the only one in the queue, otherwise allow the ajax request's complete callback to execute the next one.
						self.execute(xhr_obj);
					}
				}
				
				return xhr_obj;
			},
			
			isUnique: function(xhr_obj) {
				var unique = true,
					 ajax;
				
				// get all xhr objects' url, type, data, dataType, and data attributes and compare them against the current xhr object
				for (var xhr_id in xhrs) {
					ajax = xhrs[xhr_id].ajax;
					
					if (ajax.url	   == xhr_obj.ajax.url &&
						 ajax.type	   == xhr_obj.ajax.type &&
						 ajax.data 	   == xhr_obj.ajax.data &&
						 ajax.dataType == xhr_obj.ajax.dataType) {
							
						unique = false;
						break;
					}
				}

				return unique;
			},

			execute: function(xhr_obj) {
				// wrap the actual ajax request in a delayed function
				xhr_obj.delayedFn = event_manager.delay(function() {
					
					xhr_obj.xhr = $.ajax(xhr_obj.ajax);
					
				}, xhr_obj.delay);
				
				// execute the beforeSend callback
				if (utilities.isFunction(xhr_obj.beforeSend)) {
					xhr_obj.beforeSend();
				}

				// start the function
				xhr_obj.delayedFn.start();
			},

			stop: function(xhr_obj) {
				if (!xhr_obj) {
					return false;
				}
				
				// stop the request in progress if the request has begun..
				if (xhr_obj.xhr) {
					xhr_obj.xhr.abort();
				}

				// stop the request from firing if it hasn't yet and it's delayed...
				if (xhr_obj.delayedFn) {
					xhr_obj.delayedFn.stop();
				}
				
				// remove it from the queue
				removeXHRObj(xhr_obj.id);
			}

	};
	
});