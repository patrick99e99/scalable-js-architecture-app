/**
 * Enables/Disables text selection, saves selected text
 *   
 * @example jQuery('p').enableTextSelect(); / jQuery('#selectable-area').disableTextSelect();
 * @cat plugin
 * @type jQuery 
 *
 */
jQuery.fn.disableTextSelect = function() {
  return this.each(function() {
    $(this).css({
      'MozUserSelect' : 'none'
    }).bind('selectstart', function() {
      return false;
    }).mousedown(function() {
      return false;
    });
  });
};

jQuery.fn.enableTextSelect = function() {
  return this.each(function() {
    $(this).css({
      'MozUserSelect':''
    }).unbind('selectstart').mousedown(function() {
      return true;
    });
  });
};
