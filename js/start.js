/*jslint plusplus: true, white: true */
/*global CKEDITOR, Style, Row, Cell, Table, NEWSLETTER */
$(document).ready(function () {
	var editor = CKEDITOR.replace('editor', {
		customConfig: '../settings/editor_config.js'
	});
	// once the editor is loaded, insert a table inside
	editor.on('instanceReady', function () {
		// disabling default plugins by removing them from the context menu
		var menuItemsToRemove = ['table', 'tabledelete', 'link', 'unlink'];
		menuItemsToRemove.forEach(function (item) {
			editor.removeMenuItem(item);
		});

		/**
		 * Drops inline attribute named attrName from DOM element
		 * @param  {Object} element 	an inline attribute of  this element will be dropped. The element should respond to jQuery "attr" method.
		 * @param  {string} attrName 	this attribute name will be dropped.
		 * @return {void}
		 */
		var dropInlineStyleAttr = function(element, attrName){
			// unhovering table
			var attr = element.attr('style'),
				style = new Style(attr);
			if (style.hasOwnProperty(attrName)){
				delete style[attrName];
			}
			element.attr('style', style.toString());
		};

		/**
		 * Inserts table and applies hover effect on it.
		 * It is based on CKEDITOR.editor.insertElement() method.
		 * This approach might be wrong but I wanted to avoid repetitions.
		 * @param  {CKEDITOR.dom.element}	table
		 * @return {[type]}       [description]
		 */
		CKEDITOR.editor.prototype.insertTableWithHoverEff = function(table){
			this.insertElement(table);
			$(table.$).hover(
				function () {
					var markerName  = NEWSLETTER['marker-name'],
						tableMarker = (new Table()).getType(),
						rowMarker   = (new Row()).getType(),
						cellMarker  = (new Cell()).getType();
					$(this).find('td[data-marker="Cell"]').hover(
						function(){
							var cellNumber = $(this).index(),
								tableParent = $(this).parents('table[' + markerName +'="' + tableMarker + '"]'),
								boxShadowValues = '0.05em 0.0em 0.5em 0.05em #AAAAAA',
								cellSelector = 'tr[' + markerName +'="'+ rowMarker +'"] td[' + markerName +'="' +
									cellMarker + '"]:nth-child(' + (cellNumber + 1) + ')';
							tableParent.find(cellSelector).css('box-shadow', boxShadowValues);
						},
						function(){
							var cellsSelector = 'td[' + markerName +'="' + cellMarker + '"]',
								tableSelector = 'table[' + markerName +'="' + tableMarker + '"]',
								allCells = $(this).parents(tableSelector).find(cellsSelector),
								i,
								len = allCells.length;
							for (i = 0; i < len; i++){
								dropInlineStyleAttr($(allCells[i]), 'box-shadow');
							}

						}
					);
					// hovering the whole table
					// $(this).css('box-shadow', '0.05em 0.05em 0.2em 0.05em #AAAAFF');
					// hovering table row
					$(this).find('tr').hover(
						function () {
							$(this).css('box-shadow', '0.05em 0.0em 0.5em 0.05em #AAAAAA');
						},
						function () {
							// unhovering the table row
							var that = this;
							dropInlineStyleAttr($(that), 'box-shadow');
						}
					);
				}, function(){
					// unhovering table
					var that = this;
					dropInlineStyleAttr($(that), 'box-shadow');
				}
			);

		};
	});
});