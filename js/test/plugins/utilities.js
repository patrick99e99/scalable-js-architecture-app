Core.loadTest('plugin', 'utilities', function(plugin, Y) {

	return { 'utilities test': {
							    name: "TestCase methods",

							    //---------------------------------------------
							    // Setup and tear down
							    //---------------------------------------------

							    setUp : function () {

							    },

							    tearDown : function () {

							    },

							    //---------------------------------------------
							    // Tests
							    //---------------------------------------------

							    testBlank: function () {
							        Y.Assert.isTrue(plugin.isBlank(''), "it should be blank");
							        Y.Assert.isTrue(plugin.isBlank([]), "it should be blank");
							    },
							
							    testNotBlank: function () {
							        Y.Assert.isFalse(plugin.isBlank('foo'), "it should not be blank");
							        Y.Assert.isFalse(plugin.isBlank([1]),  "it should not be blank");
							    },
							
								 testStrip: function() {
									  Y.Assert.areEqual('foo', plugin.strip('    foo     '), "it should strip out whitespace");
								 },

								 testIsUndefined: function() {
									  var foo;
									  Y.Assert.isTrue(plugin.isUndefined(foo), "it should be true when an undefined variable is passed in");
									  
									  foo = true;
									  Y.Assert.isFalse(plugin.isUndefined(foo), "it should be true when a defined variable is passed in");
								 },

								 testIsFunction: function() {
									  Y.Assert.isTrue(plugin.isFunction(function() {}), "it should return true when a function is passed in");
									  Y.Assert.isFalse(plugin.isFunction({}), "it should return false when an object is passed in");
									  Y.Assert.isFalse(plugin.isFunction(''), "it should return false when a string is passed in");
									  Y.Assert.isFalse(plugin.isFunction(1), "it should return false when a number is passed in");
									  Y.Assert.isFalse(plugin.isFunction([]), "it should return false when an array is passed in");
								 },
								
								 testIsArray: function() {
									  Y.Assert.isTrue(plugin.isArray([]), "it should return true when an array is passed in");
									  Y.Assert.isFalse(plugin.isArray(''), "it should return false when a string is passed in");
									  Y.Assert.isFalse(plugin.isArray(function() {}), "it should return false when a function is passed in");
									  Y.Assert.isFalse(plugin.isArray({}), "it should return false when an object is passed in");
									  Y.Assert.isFalse(plugin.isArray(1), "it should return false when a number is passed in");
				 				 },	
					
								 testIsString: function() {
									  Y.Assert.isTrue(plugin.isString(''), "it should return true when a string is passed in");
									  Y.Assert.isFalse(plugin.isString(function() {}), "it should return false when a function is passed in");
									  Y.Assert.isFalse(plugin.isString({}), "it should return false when an object is passed in");
									  Y.Assert.isFalse(plugin.isString(1), "it should return false when a number is passed in");
									  Y.Assert.isFalse(plugin.isString([]), "it should return false when an array is passed in");
								 },	

								 testIsNumber: function() {
									  Y.Assert.isTrue(plugin.isNumber(1), "it should return true when a number is passed in");
									  Y.Assert.isFalse(plugin.isNumber(''), "it should return false when a string is passed in");
									  Y.Assert.isFalse(plugin.isNumber(function() {}), "it should return false when a function is passed in");
									  Y.Assert.isFalse(plugin.isNumber({}), "it should return false when an object is passed in");
							  		  Y.Assert.isFalse(plugin.isNumber([]), "it should return false when an array is passed in");
								 },

								 testIsObject: function() {
									  Y.Assert.isTrue(plugin.isObject({}), "it should return true when an object is passed in");
									  Y.Assert.isFalse(plugin.isObject(1), "it should return false when a number is passed in");
									  Y.Assert.isFalse(plugin.isObject(''), "it should return false when a string is passed in");
									  Y.Assert.isFalse(plugin.isObject(function() {}), "it should return false when a function is passed in");
							  		  Y.Assert.isFalse(plugin.isObject([]), "it should return false when an array is passed in");
								 },

								 testMapOverObject: function() {
									  var obj = {'fruit': 'apple', 'grain': 'quinoa'};
									  var arr = plugin.map(obj, function(k, v) {
											return k + '=' + v;
									  });
									
									  Y.Assert.areEqual('fruit=apple',  arr[0], "it should iterate over an object supplying the key and value as arguments, and return an array of values");
									  Y.Assert.areEqual('grain=quinoa', arr[1], "it should iterate over an object supplying the key and value as arguments, and return an array of values");
								 },
								
								 testExtend: function() {
									 var foo = {'bar': 'baz', 'porky': 'pig'};
									 var new_foo = plugin.extend(foo, {});
									 
									 new_foo.porky = 'police officer';
									
									 Y.Assert.areEqual('baz', new_foo.bar, "It should create a new object with a copy of the parameters");
									 Y.Assert.areEqual('pig', foo.porky, "It should maintain its original value when the extended object is modified");
								 },

								 testCloneWithArray: function() {
									 var foo = ['hi'];
									 var new_foo = plugin.clone(foo);
									 
									 new_foo[0] = "bye";

									 Y.Assert.areEqual('hi', foo[0], "it should create a new object and key it's original value when the new object is modified");
								 },

								 testUrlWriter: function() {
									  var url = plugin.urlWriter('http://foo.com', {'foo': 'bar', 'baz': 123});
									
									  Y.Assert.areEqual('http://foo.com?foo=bar&baz=123', url, "it should create a url with params");
								 },
								
								 testHasClassFn: function() {
									  var foo = document.createElement('p');
									  foo.className = "bar baz";
									
									  var fn = plugin.hasClassFn(foo);
									 
									  Y.Assert.isTrue(fn('bar'), "it should return a function scoped for an element that returns true when the element has the specified class name");
									  Y.Assert.isTrue(fn('baz'), "it should return a function scoped for an element that returns true when the element has the specified class name");
									  Y.Assert.isFalse(fn('twerp'), "it should return a function scoped for an element that returns false when the element doesn't have the specified class name");
								 },

								 testCaptialize: function() {
									  Y.Assert.areEqual('Foo', plugin.capitalize('fOO'), "it should downcase a string and upcase the first character");
								 },
								
								 testSingularlize: function() {
									  Y.Assert.areEqual('foo', plugin.singularize('foos'), "it should chop the last letter off of a string if it is an 's'");
									  Y.Assert.areEqual('foo', plugin.singularize('foo'), "it should not chop the last letter off of a string if it is not an 's'");
								 },
								
								 testFloatTrim: function() {
									  Y.Assert.areEqual(123.11, plugin.floatTrim("123.111111"), "it should return a 2 deciminal place float when a string with no options are specified");
									  Y.Assert.areEqual(123.1,  plugin.floatTrim("123.111111", {'precision': 1}), "it should return a 1 deciminal place float when a precision of 1 is passed in as an option");
								 },

								 testDasherize: function() {
									var dasherized = plugin.dasherize('Hello_There My Good friend');
									
									Y.Assert.areEqual('hello-there-my-good-friend', dasherized, 'it should downcase and convert spaces and underscores to hyphens');
								}
							
							}
						
			};
	
});