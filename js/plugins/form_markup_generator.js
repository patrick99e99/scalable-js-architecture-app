Core.loadPlugin('form_markup_generator', function($) {

	var self,
		 utilities,
		
		 isSelect = function(field) {
			return field.type == 'select';
		},
		
		isInput = function(field) {
			return (/^input:/).test(field.type);
		};

	return {
			init: function() {
				self      = this;
				utilities = Core.getPlugin('utilities');
			},
			
			create: function(obj) {
				self.options = utilities.extend({'submit': false}, obj);

				return self.markup();
			},

			markup: function() {
				var markup = [{'tag': 'ul', 'class': 'form_errors'},
								  {'tag': 'form', 'id': self.options.id, 'behaviors': self.behaviors(), 'action': self.options.location, 'method':  self.options.method, 'as': 'form', 'children': [
										{'tag': 'ol', 'children': self.fields()} ]}	
								 ];
								
				if (self.options.header) {
					utilities.arrayInsert(markup, {'tag': 'h1', 'text': self.options.header}, 0);
				}
				
				return markup;
			},

			fields: function() {
				return utilities.map(self.options.fields, function(field) {
						var children,
							container_class;
							
						if (field.container_class) {
							container_class = field.container_class;
							delete field.container_class;
						}

						if (isSelect(field)) {
							children = self.generateSelect(field);
						}
						else if (isInput(field)){
							children = self.generateInput(field);
						}
						else {
							children = self.generateTag(field);
						}

						return {'tag': 'li', 'class': container_class, 'children': children};
				});
			},
			
			generateSelect: function(select) {
				var select_class = select['class'], // can't use select.class in Safari
				
					 markup = [{'tag': 'label', 'for': select.id, 'class': 'select_label', 'text': select.label},
			 					  {'tag': 'select', 'class': select_class, 'id': select.id, 'name': select.name, 'as': select.as, 'children': select.options}];

				if (select.button) {
					// insert it after the label
					utilities.arrayInsert(markup, self.buttonMarkup(select.button), 1);
				}
				
				return markup;
			},
	
			generateInput: function(field) {
				// input:text, input:checkbox, etc...
				var input_type = field.type.split(':'),
				    tag        = utilities.first(input_type),
				    type       = utilities.last(input_type),
				    field_id   = field.id || 'form_field_' + field.name,
                                
				    attributes = self.filterAttributes(field),
				    input      = utilities.extend({'tag': tag, 'type': type, 'id': field_id, 'as': field.as}, attributes),
				    label      = {'tag': 'label', 'for': field_id, 'text': field.label},
				               
				    input_data = [input];

				if (field.label) {
					utilities.arrayInsert(input_data, label, 0);
				}

				return input_data;
			},
			
			generateTag: function(field) {
				// <textarea> etc...
				var tag			= field.type,
					 field_id	= field.id || 'form_field_' + field.name,

					 attributes = self.filterAttributes(field),
					 input_data = utilities.extend({'tag': tag, 'id': field_id, 'as': field.as}, attributes);

				return [{'tag': 'label', 'for': field.id, 'text': field.label},
					 	  input_data];
			},
			
			filterAttributes: function(field) {
				return utilities.without(field, ['options', 'type', 'label']);
			},
			
			buttonMarkup: function(button) {
				return {'tag': 'input', 
						 'type': 'button', 
						'value': button.text, 
						'class': 'attribute_modifier', 
				  'behaviors': {'event': 'click', 
				  					'method': button.click, 
								  'options': {'skip_event_manager': true}}};
			},
			
			insertHeader: function() {
				if (self.options.header) {
					form_markup = utilities.arrayInsert(form_markup, {'tag': 'h1', 'text': self.options.header}, 0);
				}
			},
			
			behaviors: function() {
				if (self.options.submit) {
					return false;
				}
				
				// prevent forms from being submitted
				return {'event': 'submit', 
						 'method': function() { return false; }, 
					  	'options': {'skip_event_manager': true}};
			}
	};
	
});