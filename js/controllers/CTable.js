/*jslint plusplus: true, white: true */
/*global Unit, CKEDITOR, NEWSLETTER, Table, Controller */

/**
 * Table Controller.
 * @module    Controllers
 * @class     CTable
 * @type      {Object}
 * @since     0.0.5
 * @author    A.Shcherbakov
 */
function CTable(){
	"use strict";
	if (!(this instanceof CTable)) {
		return new CTable();
	}
	Controller.call(this);

	this.setModel(Table);

	/**
	 * Returns the width of the parent element available for its children.
	 * <pre>
	 * available width = (element width) - (element left border width) -
	 * 		(element right border width) - (element left margin) - (element right margin)
	 * </pre>
	 * The element width is supposed to be greater than zero and hence to have a unit of
	 * measurement (e.g. 'px'). If not set, widths of other attributes are equal to zero
	 * without unit of measurement.  In this case one has to set the unit of measurement
	 * equal to the element width.
	 * @method     parentWidth
	 * @return     {Unit}             available width for the children as Unit object
	 *                                (with properties "value" and "measure")
	 */
	this.parentWidth = function (editor) {
		var startElem = editor.getSelection().getStartElement(),
			rawWidth = new Unit(startElem.getComputedStyle('width') || NEWSLETTER.width()),
			borderWidthL = new Unit(startElem.getComputedStyle('border-width-left') || 0),
			borderWidthR = new Unit(startElem.getComputedStyle('border-width-right') || 0),
			paddingL = new Unit(startElem.getComputedStyle('padding-left') || 0),
			paddingR = new Unit(startElem.getComputedStyle('padding-right') || 0),
			output;
		output = rawWidth.sub(borderWidthL).sub(borderWidthR).sub(paddingL).sub(paddingR);
		output.value = Math.round(output.value);
		return output;
	};


	/**
	 * Returns html string for the table with properties specified by the user
	 * in the dialog menu.
	 * @method         create
	 * @param          {Object}             context           context by means the variables are passed from view to the controller
	 * @param          {Object}             editor            editor instance
	 * @return         {DOM.Element}
	 */
	this.create = function(dialog, editor){
		var tableInfo = this.getDialogData(dialog, ['text', 'checkbox']),
			rowMarker = function(i, j){return (i + 1).toString() + ' : ' + (j + 1).toString();};
		// adding width of the parent element into tableInfo
		tableInfo.width = this.parentWidth(editor);
		var table = new Table();
		try {
			table.loadFromTemplate(this.dialogToTemplate(tableInfo), rowMarker);
		} catch(e){
			console.log(e);
		}
		return table.toNode();
	};


	/**
	 * Returns instance of {{#crossLink "Table"}}Table{{/crossLink}} corresponding to a DOM.Element
	 * inside which the cursor is situated. If no table is found, nothing is returned.
	 * @method        getTable
	 * @param         {Object}              editor            editor instance
	 * @return        {Table}
	 */
	this.getTable = function(editor){
		var tableElem = this.findParentTable(editor);
		if (tableElem){
			var factory = NEWSLETTER.factory,
				table = factory.mimic(tableElem);
			if (table){
				table.disentangle();
				return table;
			}
		}
	};

	/**
	 * Appends `n` input fields to `elem` element in order to insert column width weigths.
	 * @method         addColWeightFields
	 * @param          {DOM.Element}   elem       element to which append input fields
	 * @param          {Integer}       num        number of input fields to append
	 */
	this.addColWeightFields = function(elem, n){
		if (!elem || !elem.nodeType || !Number.isInteger(n) || n < 0){
			// exit if either elem is not valid node or n is not positive integer
			return;
		}
		var inputField, i;
		for (i = 0; i < n; i++){
			inputField = document.createElement('input');
			inputField.setAttribute('style', 'min-width: 3em; width: 5em; text-align: center; margin: 0.2em');
			inputField.setAttribute('class', 'cke_dialog_ui_input_text'); // imitate the editor style for input fields
			elem.appendChild(inputField);
		}
	};

	/**
	 * Fills in input text element parametrized by `tabId` and `elemId` by `colorValue` and
	 * imposes "background-color" style attribute to `colorValue`.
	 * @method         setColorField
	 * @param          {Object}        context           context of the dialog menu
	 * @param          {String}        tabId
	 * @param          {String}        fieldId
	 * @param          {String}        colorValue
	 * @return         {void}
	 * @since          0.0.6
	 */
	this.setColorField = function(context, tabId, elemId, colorValue){
		if (!colorValue){
			return;
		}
		var elem = context.getContentElement(tabId, elemId);
		if (elem){
			elem.setValue(colorValue);
			elem.getInputElement().setStyle('background-color', colorValue);
		}
	};


	/**
	 * Returns the nearest (for current cursor position) parent table. If no table is found among ancestors, `null`
	 * is returned.
	 *
	 * Sought element has tag `table` and attribute NEWSLETTER['marker-name'] equal to {{#crossLink "Table"}}Table{{/crossLink}}
	 * {{#crossLink "Tag/getName:method"}}getName(){{/crossLink}} method.
	 *
	 * @method         findParentTable
	 * @param          {CKEDITOR}      editor
	 * @return         {Dom.Element}
	 */
	this.findParentTable = function(editor){
		var elem = editor.getSelection().getStartElement(),
			criteria = function(el){
				return el.tagName.toLowerCase() === 'table' && el.getAttribute(NEWSLETTER['marker-name']) === (new Table()).getName();
			};
		if (elem){
			return this.findAscendant(elem.$, criteria);
		}
	};

	/**
	 * Updates parameters of `tableNode` with new ones provided by `editor` dialog.
	 * @method         update
	 * @param          {Object}             context           context by means the variables are passed from view to the controller
	 * @param          {Object}             editor            editor instance
	 * @param          {DOM.Element}        tableNode         node corresponding to a table which parameters are to be updated
	 * @return         {DOM.Element}
	 */
	this.update = function(dialog, editor, tableNode){
		var table = new Table(),
			tableInfo = this.getDialogData(dialog),
			factory = NEWSLETTER.factory,
			currentTable = factory.mimic(tableNode),
			width = currentTable.getWidth() || NEWSLETTER.width();
		currentTable.disentangle();

		// adding table width into tableInfo
		tableInfo.width = new Unit(width);
		table = currentTable.update(this.dialogToTemplate(tableInfo));
		return table.toNode();
	};

	/**
	 * Inserts a column into table `tbl`.
	 *
	 * Where the column is to be inserted is decided based on the value of `pos`.
	 * @method         insertColumn
	 * @param          {Object}        editor    editor instance
	 * @param          {Element}       tbl       [Element](https://developer.mozilla.org/en-US/docs/Web/API/Element)
	 *                                           instance representing table
	 * @param          {Any}           pos       position of the column to be inserted
	 * @return         {void}
	 * @since          0.2.0
	 */
	this.insertColumn = function(editor, tbl, pos){
		var adapter = this.getEditorAdapter();
		var content = adapter.getEditorContent(editor);
		var worker = this.getWorker();
		worker.insertColumn(tbl, pos);
		adapter.setEditorContent(editor, content);
	};

	/**
	 * Inserts a row into the table nearest to the current cursor position.
	 *
	 * Where the row is to be inserted is decided based on the value of `pos`.
	 * @method         insertRow
	 * @param          {Object}        editor    editor instance
	 * @param          {Any}           pos       position of the row to be inserted
	 * @return         {void}
	 * @since          0.2.0
	 */
	this.insertRow = function(editor, pos){
		/// !!! stub
		console.log('insertRow: ', editor, pos);
	};

	/**
	 * Drops a row from the table nearest to the current cursor position.
	 *
	 * @method         dropRow
	 * @param          {Object}        editor    editor instance
	 * @return         {void}
	 * @since          0.2.0
	 */
	this.dropRow = function(editor){
		/// !!! stub
		console.log('dropRow: ', editor);
	};

	/**
	 * Returns  array of length `n` each elements of which is a result of execution of `fun(arg)`.
	 * @method         _xerox
	 * @param          {Number}        n     non-negative integer
	 * @param          {Function}      fun
	 * @param          {Any}           args
	 * @return         {Array}
	 * @since          0.2.6
	 */
	this.xerox = function(n, fun, args){
		var output = [],
			i, copy;
		for (i = 0; i < n; i++){
			try {
				copy = fun(args);
				output.push(copy);
			} catch (e){
				console.log(e);
				return;
			}
		}
		return output;
	};


	/**
	 * Removes the nearest table to the cursor position.
	 * @method         removeTable
	 * @param          {Object}        editor
	 * @return         {void}
	 * @since          0.2.0
	 */
	this.removeTable = function(editor){
		var adapter, content, doc, ranges;
		try {
			adapter = this.getEditorAdapter();
			content = adapter.getEditorContent(editor);
			ranges = adapter.getNativeRanges(editor);
			doc = this.getWorker();
			doc.clearRangesFromTables(ranges);
			adapter.setEditorContent(editor, content);
		} catch(e){
			console.log(e.name + ' occurred when removing tables: ' + e.message);
		}
	};

	/**
	 * Action to execute when table `dialog`'s confirm button is pressed.
	 *
	 * Overrides parent class method {{#crossLink "Controller/onOk:method"}}Controller::onOk(){{/crossLink}}.
	 * @method        onOk
	 * @param         {Object}         dialog    editor-specific representation of dialog window
	 * @param         {Object}         editor
	 * @param         {Object}         params         [Optional] json-like object of the form {target: ..., selection: ...}
	 * @return        {void}
	 * @since         0.2.0
	 */
	this.onOk = function(dialog, editor, params){
		var adapter, content, dialogData, template,
			model, doc, builder, cursorPos, hostElement;
		try {
			adapter = this.getEditorAdapter();
			content = adapter.getEditorContent(editor);
			dialogData = adapter.getDialogData(dialog, ['text', 'checkbox']);
			template = adapter.dialogToTemplate(dialogData, 'table');
			doc = this.getWorker();
			if (params && params.target){
				doc.updateNode(params.target, template);
			} else {
				cursorPos = adapter.getCursorPosition(editor);
				hostElement = cursorPos.startContainer;
				template.root.width = doc.getAvailableWidth(hostElement) || NEWSLETTER.defaultWidth;
				builder = doc.getFactory();
				model = builder.createFromTemplate(template);
				console.log('1: table html:', model.toHtml());
				console.log('template.row', template.row, builder.createFromTemplate(template.row).toHtml());

				var rowNum = parseInt(template.rows, 10);
				var colNum = parseInt(template.columns, 10);
				var i,
					rows = [],
					cells = [];
				for (i = 0; i < rowNum; i++){
					rows.push(builder.createFromTemplate(template.row));
				}
				for (i = 0; i < colNum; i++){
					cells.push(builder.createFromTemplate(template.cell));
				}
				model.inflate(rows, cells);
				console.log('2. table html:', model.toHtml());
				doc.insertAt(hostElement, model.toNode(), cursorPos.startOffset);
			}
			adapter.setEditorContent(editor, content);
		} catch(e){
			console.log(e.name + ' occurred when elaborating table plugin confirm action: ' + e.message, e);
		}
	};


}

CTable.prototype = Object.create(Controller.prototype);