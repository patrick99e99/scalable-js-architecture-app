var Core = (function($) {

	var self,
		 test,
		 debug = true,
		 modules = {},
		 plugins = {},
		 helpers = {},
		 tests = {},
		
		 dom,
		 utilities,
		
		 isFunction = function(obj) {
			return typeof obj === 'function';
		 },
		
		 addErrorLogging = function(object) {
			var name, method;

		    for (var name in object) {
		        method = object[name];

		    	if (isFunction(method)) {
		    		object[name] = function(name, method) {

		    			return function() {

							try {
								return method.apply(this, arguments);
							} catch (err) {
								if (debug) {
									throw(err);
								}
								else {
									self.log(name + "(): " + err.message);
								}

							}
		            	};
					}(name, method);
				}
			}

			return object;
		};

	return addErrorLogging({

		init: function() {
			self 		 = this;
			dom 		 = self.getPlugin('dom');
			utilities = self.getPlugin('utilities');

			self.setTestMode();
			
			self.addCurryToFunction();

			self.initializePlugins();

			self.resetSelects();
			
			self.startModules();
			
			self.startEventManager();

			self.runTests();
		},
		
		loadModule: function(module_name, fn) {

			modules[module_name] = { constructor: fn, 
			  					        		 instance: null, 
							      	 listening_list: {} };
		},

		loadHelper: function(helper_name, fn) {
			helpers[helper_name] = fn;	
		},
		
		loadPlugin: function(plugin_name, fn) {
			var plugin = fn($, new Sandbox(name));

			// insert try/catch blocks into all functions
			addErrorLogging(plugin);

			plugins[plugin_name] = plugin;
		},

		initializePlugins: function() {
			for (var name in plugins) {
				var plugin = plugins[name];
				
				if (isFunction(plugin.init)) {
					plugin.init();
				}
				
				if (test) {
					// add test file to page
					self.appendTestFileToPage('plugin', name);
				}
			}
		},
		
		startModules: function() {
			for (var name in modules) {

				var module      = modules[name];

				// create new sandbox for module
				var sandbox     = new Sandbox(name);

				module.sandbox  = sandbox;
				module.instance = module.constructor(sandbox);

				// apply the specified helpers so they are accessible in the module
				self.applyHelpers(module);
				
				// insert try/catch blocks into all functions
				addErrorLogging(module.instance);
				
				// initialize the module
				if (isFunction(module.instance.init)) {
					module.instance.init();
				}

				if (!test) {
					// start the module if we're not in test mode
					if (isFunction(module.instance.onReady)) {
						module.instance.onReady();
					}
				}
				else {
					// add test file to page
					self.appendTestFileToPage('module', name);
				}
			}
		},
		
		appendTestFileToPage: function(type, name) {
			var path = 'js/test/' + type + 's/' + name + '.js',
				 file = $('<script>').attr('src', path);
					
			$('body').append(file);

			if (typeof console === 'object' && typeof console.clear === 'function') {
				console.clear();
			}
		},

		applyHelpers: function(module) {
			if (!module.instance.helpers) {
				return false;
			}

			// convert text helper names specified in module files ( helpers: ['foo', 'bar']) and turns them into real helper objects accessible by module.instance.foo, module.instance.bar		

			var module_helpers = {},
				 helper_names   = utilities.toArray(module.instance.helpers),
				 owner_module;

			// give the helper access to a module with the same name
			if (modules[module]) {
				owner_module = modules[module];
			}

			utilities.each(helper_names, function(i, name) {
				// instantiate the helper
				var helper_instance = helpers[name](module.sandbox, owner_module);

				// insert try/catch blocks into all functions
				addErrorLogging(helper_instance);

				// call init method
				if (isFunction(helper_instance.init)) {
					helper_instance.init();
				}

				module_helpers[name] = helper_instance;
			});
			
			// replace the array of helper names with the actual helpers
			module.instance.helpers = module_helpers;
		},

		addToListeningList: function(name, fn, module_name) {

			var module = modules[module_name];
			
			if (module) {
				// store the function
				module.listening_list[name] = fn;
			}
			
		},
		
		fireEvent: function(name) {
			// get all arguments after the name
			var data = Array.prototype.slice.call(arguments, 1);

			for (var module_name in modules) {

				// get all items the module is listening for
				var list = modules[module_name].listening_list;

				// check if the target method specified by sandbox.listen() is part of the module
				if (list[name] && isFunction(list[name])) {
					
					// execute the method with the specified data
					list[name].apply(this, data);
				}
			}
		},
		
		getModule: function(module_name) {
			return modules[module_name];
		},
		
		getPlugin: function(plugin_name) {
			return plugins[plugin_name];
		},

		resetSelects: function() {
			var selects = dom.findBySelector('select');
			
			utilities.each(selects, function() {
				dom.resetSelect(this);
			});
		},

		loadTest: function(type, name, testFn) {
			if (!test) {
				return false;
			}
			
			tests[name] = {'type': type, 'fn': testFn};
		},
		
		runTests: function() {
			if (!test) {
				return false;
			}
			
			// Create a new YUI instance and populate it with the required modules.
			YUI().use('node', 'console', 'test', function (Y) {
				
				for (var name in tests) {
					
					var test_case_obj = tests[name],
						 obj;
					
					switch(test_case_obj.type) {
						case 'module':
							obj = modules[name].instance;
							break;
						case 'helper':
							obj = helpers[name];
							break;
						case 'plugin':
							obj = plugins[name];
							break;
						default:
							obj = self;
							break;
					};
					
					var test_cases = tests[name].fn(obj, Y);
					
					for (var case_name in test_cases) {
						Y.Test.Runner.add(new Y.Test.Case(test_cases[case_name]));
					}
				}
				
				$('body').addClass('yui3-skin-sam');
				$('body').addClass('yui-skin-sam');
				$('#wrapper').hide();

		    	var r = new Y.Console({
		        	newestOnTop : false,
		        	style: 'block' // to anchor in the example content
		    	});

		    	r.render('#testLogger');
				
				//run all tests
				Y.Test.Runner.run();
			});
		},
		
		addCurryToFunction: function() {
			// add .curry method to functions to allow assignment of arguments before the function's execution

			if (typeof Function.prototype.curry === 'undefined') {

			  Function.prototype.curry = function() {
			    var func = this,
			   	  a 	 = Array.prototype.slice.call(arguments, 0);

			    return function() {

			      var a_len  = a.length,
			      	 length = arguments.length;

			      while (length--) {
			        a[a_len + length] = arguments[length];
				  }

			      return func.apply(this, a);
			    };
			  };
			}
		},
		
		startEventManager: function() {
			self.getPlugin('event_manager').start();
		},
		
		log: function(message, visual) {
			var timestamp = new Date().getTime();
			message = [timestamp, message].join(": ");
			
			if (visual && !self.debug_container) {
				self.startVisualDebug();
			}
			
			if (debug) {
				if (window.console && typeof window.console === 'object') {
				 	console.warn(message);
				}
				
				if (self.debug_container) {
					var to_log = dom.createElement('p');
					dom.setText(to_log, message);
					
					dom.insertHTML(self.debug_container, to_log);
				}
			}
			else {
				// log the errors to the server

//				var fake_image = new Image();
//				fake_image.src = 'somescript.php?msg=' + encodeURIComponent(message); 
			}
		},
		
		overrideWindowOnerror: function() {
			window.onerror = function(msg, url, line) {
				if (debug) {
					return false;
				}
				else {
					self.log(msg);
					return true;
				}
			};
		},
		
		startVisualDebug: function() {
			var body = dom.findBySelector('body');
			self.debug_container = dom.createElement('div', {'id': 'custom_debugger'});

			dom.insertHTML(body, self.debug_container);
		},
		
		stopVisualDebug: function() {
			dom.remove(self.debug_container);
			self.debug_container = null;
		},
		
		setTestMode: function() {
			var getURLParam = function(name) {
		    	return unescape(
		        	(RegExp(name + '=' + '(.+?)(&|$)', 'i').exec(location.search)||[,null])[1]
		    	);
			};
			
			if (getURLParam('test') != 'null') {
				test = true;
			}
		}

	});
	
})(jQuery);