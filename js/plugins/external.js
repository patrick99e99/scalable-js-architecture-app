Core.loadPlugin('external', function($) {
	
	var self,
		 dom,
		 data,
		 config,
		 utilities,
		 
		 uploadifyExists = function() {
			return data.current_uploadify && data.current_uploadify.data();
		 };

	return {
			init: function() {
				self = this;
	 		
				dom       = Core.getPlugin('dom');
				config    = Core.getPlugin('config');
				data      = Core.getPlugin('data');
				utilities = Core.getPlugin('utilities');

			},
			
			uploadify: function(element, options) {
				element = $(element);
				
				if (data.current_uploadify) {
					self.destroyUploadifyWrapper();
				}
				
				data.current_uploadify = element;
				
				var one_megabyte = 1048576;
				
				options = utilities.extend({ 'auto': false,
								 		   	 'uploader': config.flash_path + 'uploadify.swf',
										  		'cancelImg': config.css_image_path + 'uploadify_cancel.png',
										 'expressInstall': config.flash_path + 'flash/expressInstall.swf',
													 'multi': false,
										  		'sizeLimit': one_megabyte * config.upload_size_limit_in_mb,
													 'wmode': 'transparent',
										'removeCompleted': false,
										 	  'hideButton': true,
											 'wrapElement': {'tag': 'div', 'attributes': {'id': 'uploadify_wrapper'}},
										  'buttonElement': {'tag': 'input', 'attributes': {'type': 'button',
																									 	  'value': options.buttonText, 
																									 	  'class': 'button uploadify_button'}} 
							}, options);
				
				return element.uploadify(options);
			},
			
			upload: function() {
				return data.current_uploadify.uploadifyUpload();
			},
			
			cancelUpload: function() {
				return data.current_uploadify.uploadifyClearQueue();
			},
			
			addUploadParams: function(params) {
				var results = [];
				for (var param in params) {
					results.push(data.current_uploadify.uploadifySettings(param, params[param]));
				}
				
				return results;
			},
			
			updateUploadifyWrapperPosition: function() {
				if (uploadifyExists() && data.current_uploadify.data().updateWrapper) {
					return data.current_uploadify.data().updateWrapper();
				}
			},
			
			hideUploadifyWrapper: function() {
				if (uploadifyExists() && data.current_uploadify.data().hideWrapper) {
					return data.current_uploadify.data().hideWrapper();
				}
			},
			
			showUploadifyWrapper: function() {
				if (uploadifyExists() && data.current_uploadify.data().showWrapper) {
					return data.current_uploadify.data().showWrapper();
				}
			},
			
			destroyUploadifyWrapper: function() {
				if (uploadifyExists() && data.current_uploadify.data().destroyWrapper) {
					data.current_uploadify && data.current_uploadify.data().destroyWrapper();
					data.current_uploadify = null;
				}
			},
			
			
	};
	
});