Core.loadTest('plugin', 'html_generator', function(plugin, Y) {

	return { 'html generator test': {
							    name: 'TestCase methods',

							    //---------------------------------------------
							    // Setup and tear down
							    //---------------------------------------------

							    setUp: function() {
									var markup = [{'tag': 'div', 'as': 'outer', 'children': 
										[{'tag': 'p', 'text': 'paragraph 1', 'as': 'p1'},
										 {'tag': 'p', 'text': 'paragraph 2', 'as': 'p2', 'children': 
												{'tag': 'span', 'text': 'howdy', 'as': 'inner'}
										}]
									}];
									
									var generated = plugin.create(markup);
									
									this.html = generated.html[0];
									this.references = generated.references;
							    },

							    tearDown: function() {
									this.generated = null;
							    },

							    //---------------------------------------------
							    // Tests
							    //---------------------------------------------

								 testOuterHTMLObject: function() {
									Y.Assert.areEqual('div', this.html.tagName.toLowerCase(), 'it should generate an outer div element');
								 },
								
								 testChildrenOfOuterElement: function() {
									var paragraphs = this.html.children;

									Y.Assert.areEqual('p', paragraphs[0].tagName.toLowerCase(), 'it should be the first paragraph child');
									Y.Assert.areEqual('p', paragraphs[1].tagName.toLowerCase(), 'it should be the last paragraph child');
								},
								
								testChildrenOfInnerElement: function() {
									var span = this.html.lastChild.children[0];
									
									Y.Assert.areEqual('span', span.tagName.toLowerCase(), 'it should be the only child of the paragraph child');
								},
								
								testReferences: function() {
									Y.Assert.areEqual(this.references.outer, this.html, 'it should be the outer div element');
									Y.Assert.areEqual(this.references.p1, this.html.children[0], 'it should be the first paragraph child');
									Y.Assert.areEqual(this.references.p2, this.html.children[1], 'it should be the last paragraph child');									
									Y.Assert.areEqual(this.references.inner, this.html.lastChild.children[0], 'it should be the span child of the last paragraph child');
								}
						}
						
			};	
});