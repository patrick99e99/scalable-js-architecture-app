var Sandbox = function(name) {

	var self 	        		  = this,
		 ui                    = Core.getPlugin('ui'),
		 dom                   = Core.getPlugin('dom'),
		 data                  = Core.getPlugin('data'),
		 config                = Core.getPlugin('config'),
		 ajax                  = Core.getPlugin('ajax'),
		 effects               = Core.getPlugin('effects'),
		 external              = Core.getPlugin('external'),
		 event_manager         = Core.getPlugin('event_manager'),
		 html_generator        = Core.getPlugin('html_generator'),
		 form_markup_generator = Core.getPlugin('form_markup_generator'),
		 utilities             = Core.getPlugin('utilities');

	this.name = name;
	
	/*------------ Core methods ------------*/
	
	this.listen = function(type, fn) {
		return Core.addToListeningList(type, fn, name);
	};
	
	this.notify = function(type, data) {
		return Core.fireEvent(type, data);
	};
	
	this.getPlugin = function(plugin_name) {
		return Core.getPlugin(plugin_name);
	};
	
	this.log = function(message) {
		return Core.log(message);
	};

	
	/*------------ dom methods ------------*/
	
	this.addBehavior = function(element, event, fn, options) {
		return dom.bind(element, event, fn, options);
	};
	
	this.removeBehavior = function(element, event, fn) {
		return dom.unbind(element, event, fn);
	};
	
	this.hasBehavior = function(element, event) {
		return dom.hasEvent(element, event);
	};
	
	this.find = function(el_id) {
		return dom.find(el_id);
	};

	this.findBySelector = function(selector) {
		return dom.findBySelector(selector);
	};
	
	this.isOnPage = function(element) {
		return dom.isOnPage(element);
	};

	this.isNotOnPage = function(element) {
		return !dom.isOnPage(element);
	};
	
	this.down = function(element, selector) {
		return dom.down(element, selector);
	};
	
	this.up = function(element, selector) {
		return dom.up(element, selector);
	};
	
	this.next = function(element) {
		return dom.next(element);
	};
	
	this.findElementWithChild = function(element, to_return, child) {
		return dom.findElementWithChild(element, to_return, child);
	};

	this.children = function(element, selector) {
		return dom.children(element, selector);
	};
	
	this.focus = function(element) {
		return dom.focus(element);
	};
	
	this.blur = function(element) {
		return dom.blur(element);
	};
	
	this.hasChild = function(element, child) {
		return dom.hasChild(element, child);
	};
	
	this.getSelectOptionValues = function(select) {
		return dom.getSelectOptionValues(select);
	};

	this.getValue = function(input) {
		return dom.getValue(input);
	};

	this.setValue = function(input, value) {
		return dom.setValue(input, value);
	};
	
	this.hide = function(obj) {
		return dom.hide(obj);
	};
	
	this.show = function(obj) {
		return dom.show(obj);
	};
	
	this.hideAll = function(collection) {
		return dom.hideAll(collection);
	};

	this.visibleHide = function(element, callback) {
		return dom.visibleHide(element, callback);		
	};
	
	this.visibleShow = function(element, callback) {
		return dom.visibleShow(element, callback);		
	};
	
	this.isVisible = function(element) {
		return dom.isVisible(element);
	};
	
	this.trigger = function(element, event) {
		return dom.trigger(element, event);
	};
	
	this.disableTextSelection = function(element) {
		return dom.disableTextSelection(element);
	};
	
	this.enableTextSelection = function(element) {
		return dom.enableTextSelection(element);
	};
	
	this.isInside = function(outer, inner) {
		return dom.isInside(outer, inner);
	};
	
	this.resetSelect = function(element) {
		return dom.resetSelect(element);
	};

	this.cloneElement = function(element) {
		return dom.clone(element);
	};

	this.attr = function(element, attributes) {
		return dom.attr(element, attributes);
	};

	this.insertHTML = function(element, html, position) {
		return dom.insertHTML(element, html, position);
	};

	this.without = function(collection, to_remove) {
		return dom.without(collection, to_remove);
	};

	this.getText = function(element) {
		return dom.getText(element);
	};

	this.setText = function(element, text) {
		return dom.setText(element, text);
	};

	this.setHTML = function(element, html) {
		return dom.setHTML(element, html);
	};

	this.clearHTML = function(element) {
		return dom.clearHTML(element);
	};

	this.hasClass = function(element, class_name) {
		return dom.hasClass(element, class_name);
	};

	this.createElement = function(element, attributes) {
		return dom.createElement(element, attributes);
	};

	this.stopBubbles = function(event) {
		return dom.stopBubbles(event);
	};

	this.addClass = function(element, class_name) {
		return dom.addClass(element, class_name);
	};

	this.removeClass = function(element, class_name) {
		return dom.removeClass(element, class_name);
	};

	this.swapClasses = function(element, class_1, class_2) {
		return dom.swapClasses(element, class_1, class_2);
	};

	this.getWidth = function(element, outer) {
		return dom.getWidth(element, outer);
	};

	this.setWidth = function(element, width) {
		return dom.setWidth(element, width);
	};

	this.getHeight = function(element, outer) {
		return dom.getHeight(element, outer);
	};

	this.setHeight = function(element, height) {
		return dom.setHeight(element, height);
	};

	this.getCSS = function(element, attribute) {
		return dom.getCSS(element, attribute);
	};

	this.getCSSAsInt = function(element, attribute) {
		return dom.getCSSAsInt(element, attribute);
	};

	this.setCSS = function(element, attributes) {
		return dom.setCSS(element, attributes);
	};

	this.remove = function(element) {
		return dom.remove(element);
	};

	this.getPosition = function(element) {
		return dom.getPosition(element);
	};

	this.getOffset = function(element) {
		return dom.getOffset(element);
	};

	this.setOffset = function(element, offset) {
		return dom.setOffset(element, offset);
	};

	this.getScrollTop = function() {
		return dom.getScrollTop();
	};

	this.getId = function(element) {
		return dom.getId(element);
	};
	
	/*------------ ajax methods ------------*/

	this.ajax = function(obj) {
		return ajax.request(obj);
	};
	
	this.stopAjax = function(obj) {
		return ajax.stop(obj);
	};
	
	/*------------ ui methods ------------*/
	
	this.makeSlider = function(element, options) {
		return ui.makeSlider(element, options);
	};

	this.destroySlider = function(element) {
		return ui.destroySlider(element);
	};

	this.setSliderValue = function(element, value) {
		return ui.setSliderValue(element, value);
	};

	this.makeDraggable = function(collection, options) {
		return ui.makeDraggable(collection, options);
	};

	this.makeDroppable = function(collection, options) {
		return ui.makeDroppable(collection, options);
	};

	this.makeResizable = function(element, options) {
		return ui.makeResizable(element, options);
	};
	
	this.isResizable = function(element) {
		return ui.isResizable(element);
	};
	
	this.disableResizable = function(element) {
		return ui.disableResizable(element);
	};
	
	this.enableResizable = function(element) {
		return ui.enableResizable(element);
	};
	
	this.makeSortable = function(element, options) {
		return ui.makeSortable(element, options);
	};
	
	this.makeSelectMenu = function(element, options) {
		return ui.makeSelectMenu(element, options);
	};
	
	this.getKeyCode = function(key) {
		return ui.getKeyCode(key);
	};
	
	/*------------ Generator methods ------------*/	
	
	this.generateHTML = function(collection) {
		return html_generator.create(collection);
	};
	
	this.generateFormMarkup = function(obj) {
		return form_markup_generator.create(obj);
	};
	
	/*------------ effect methods ------------*/
	
	this.animate = function(element, css, options) {
		return effects.animate(element, css, options);
	};
	
	this.scrollTo = function(obj) {
		return effects.scrollTo(obj);
	};
	
	this.opacityFadeIn = function(element, options) {
		return effects.opacityFadeIn(element, options);
	};
	
	this.opacityFadeOut = function(element, options) {
		return effects.opacityFadeOut(element, options);
	};

	this.appear = function(element, callback) {
		return effects.appear(element, callback);
	};
	
	this.fade = function(element, callback) {
		return effects.fade(element, callback);
	};
	
	/*------------ event manager methods ------------*/
	
	this.stopEventManager = function() {
		return event_manager.stop();
	};
	
	this.startEventManager = function() {
		return event_manager.start();
	};
	
	this.limit = function(fn, frequency) {
		return event_manager.limit(fn, frequency);
	};
	
	this.delay = function(fn, delay) {
		return event_manager.delay(fn, delay);
	};
	
	/*------------ external methods ------------*/
	
	this.uploadify = function(element, options) {
		return external.uploadify(element, options);
	};
	
	this.upload = function() {
		return external.upload();
	};
	
	this.cancelUpload = function() {
		return external.cancelUpload();
	};
	
	this.addUploadParams = function(params) {
		return external.addUploadParams(params);
	};
	
	this.updateUploadifyWrapperPosition = function() {
		return external.updateUploadifyWrapperPosition();
	};
	
	this.hideUploadifyWrapper = function() {
		return external.hideUploadifyWrapper();
	};

	this.showUploadifyWrapper = function() {
		return external.showUploadifyWrapper();
	};

	this.destroyUploadifyWrapper = function() {
		return external.destroyUploadifyWrapper();
	};
	
	/*------------ utilities methods ------------*/
	
	this.isBlank = function(obj) {
		return utilities.isBlank(obj);
	};
	
	this.isUndefined = function(obj) {
		return utilities.isUndefined(obj);
	};
	
	this.getType = function(o) {
		return utilities.getType(o);
	};
	
	this.isFunction = function(obj) {
		return utilities.isFunction(obj);
	};
	
	this.isArray = function(obj) {
		return utilities.isArray(obj);
	};
	
	this.isString = function(obj) {
		return utilities.isString(obj);
	};
	
	this.isNumber = function(obj) {
		return utilities.isNumber(obj);
	};
	
	this.isObject = function(obj) {
		return utilities.isObject(obj);
	};
	
	this.toArray = function(obj) {
		return utilities.toArray(obj);
	};
	
	this.each = function(collection, block) {
		return utilities.each(collection, block);
	};
	
	this.map = function(collection, block) {
		return utilities.map(collection, block);
	};
	
	this.extend = function() {
		var args = Array.prototype.slice.call(arguments);
		return utilities.extend.apply(this, args);
	};
	
	this.clone = function(obj) {
		return utilities.clone(obj);
	};
	
	this.serializeArray = function(form) {
		return utilities.serializeArray(form);
	};
	
	this.urlWriter = function(base, params) {
		return utilities.urlWriter(base, params);
	};
	
	this.hasClassFn = function(element) {
		return utilities.hasClassFn(element);
	};
	
	this.capitalize = function(str) {
		return utilities.capitalize(str);
	};
	
	this.singularize = function(str) {
		return utilities.singularize(str);
	};
	
	this.floatTrim = function(number, options) {
		return utilities.floatTrim(number, options);
	};
	
	this.zeroPad = function(number) {
		return utilities.zeroPad(number);
	};
	
	this.randomWithinRange = function(min, max) {
		return utilities.randomWithinRange(min, max);
	};
	
	this.toTimeCode = function(str) {
		return utilities.toTimeCode(str);
	};
	
	this.resizeByAspect = function(image, options) {
		return utilities.resizeByAspect(image, options);
	};
	
	this.center = function(element, container) {
		return utilities.center(element, container);
	};
	
	this.getBounds = function(element) {
		return utilities.getBounds(element);
	};
	
	this.getPadding = function(element) {
		return utilities.getPadding(element);
	};
	
	this.getBorderWidth = function(element) {
		return utilities.getBorderWidth(element);
	};
	
	this.getAbsoluteCSS = function(element) {
		return utilities.getAbsoluteCSS(element);
	};
	
	this.first = function(arr) {
		return utilities.first(arr);
	};
	
	this.last = function(arr) {
		return utilities.last(arr);
	};
	
	this.getKeyFromObjectValue = function(obj, value) {
		return utilities.getKeyFromObjectValue(obj, value);
	};
	
	this.without = function(items, to_remove) {
		return utilities.without(items, to_remove);
	};
	
	this.arrayIncludes = function(arr, item) {
		return utilities.arrayIncludes(arr, item);
	};
	
	this.arrayInsert = function(arr, to_insert, index) {
		return utilities.arrayInsert(arr, to_insert, index);
	};

	this.getKeys = function(obj) {
		return utilities.getKeys(obj);
	};
	
	this.findObjectInArrayByKeyAndValue = function(arr, key, value) {
		return utilities.findObjectInArrayByKeyAndValue(arr, key, value);
	};
	
	this.interpolate = function(str, obj) {
		return utilities.interpolate(str, obj);
	};
	
	this.truncate = function(str, max_chars) {
		return utilities.truncate(str, max_chars);
	};
	
	this.bracketizeData = function(obj) {
		return utilities.bracketizeData(obj);
	};
	
	this.toPostData = function(form, namespace) {
		return utilities.toPostData(form, namespace);
	};
	
	this.toSerializedJSON = function(arr, namespace) {
		return utilities.toSerializedJSON(arr, namespace);
	};
	
	this.namespacedObject = function(namespace, obj) {
		return utilities.namespacedObject(namespace, obj);
	};
	
	this.areObjectsEqual = function(obj1, obj2) {
		return utilities.areObjectsEqual(obj1, obj2);
	};
	
	this.copyObjectValues = function(values, obj1, obj2) {
		return utilities.copyObjectValues(values, obj1, obj2);
	};
	
	this.dasherize = function(str) {
		return utilities.dasherize(str);
	};
	
};