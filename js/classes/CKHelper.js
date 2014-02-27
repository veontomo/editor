/*global CKEDITOR, NEWSLETTER, Helper, Cell, Table, Attributes, Style, List, ListItem */
/*jslint plusplus: true, white: true */

/**
 * Collection of functions used by various plugins of the CKEditor.
 * @module    Helper
 * @class     CKHelper
 * @type      {Object}
 * @version   0.0.1
 * @author    A.Shcherbakov
 */
var CKHelper = {
	/**
	 * Finds the nearest ascendant of the "elem" for which "filter" returns true
	 * @method     findAscendant
	 * @param      {CKEDITOR.dom.element}        elem
	 * @param      {function}                    filter
	 * @return     {CKEDITOR.dom.element|null}
	 */
	findAscendant: function (elem, filter) {
		if (typeof filter !== 'function') {
			return null;
		}
		while (elem && elem.type === CKEDITOR.NODE_ELEMENT) {
			if (filter(elem)) {
				return elem;
			}
			elem = elem.getParent();
		}
		return null;
	},

	/**
	 * Drops the table row. If after removing the table becomes empty, then removes it as well.
	 * @method     dropRow
	 * @param      {CKEditor.editor}        ed             Represents an editor instance.
	 * @return     {null}
	 */
	dropRow: function (ed) {
		var row = CKHelper.findAscendant(ed.getSelection().getStartElement(), function (el) {
			return ((el.getName() === "tr") && (el.getAttribute(NEWSLETTER['marker-name']) === "Row"));
		}),
			parentTable, tableLength;
		if (row) {
			parentTable = CKHelper.findAscendant(row, function (el) {
				return el.getName() === 'table';
			});
			row.remove();
			// calculating the number of remaining rows
			tableLength = parentTable.getElementsByTag('tr').count();
			if (tableLength === 0) {
				parentTable.remove();
			}
		}
	},
	/**
	 * Inserts a row at a specified position with respect to the selected element.
	 * The command to insert the row is obtained by capitalizing the second argument
	 * and appending it to the string 'insert'. Example: if pos is 'after', the command
	 * to be executed is 'insertAfter'.
	 * @method     insertRow
	 * @param      {CKEDITOR.editor}	 ed        Represents an editor instance.
	 * @param      {String}	             pos 	   where to insert the element with respect to the current one.
	 */
	insertRow: function (ed, pos) {
		var tag = 'tr',
			dataMarkerAttr = NEWSLETTER['marker-name'],
			dataMarkerVal = 'Row',
			currentElem = ed.getSelection().getStartElement(),
			newElement, operation, currentChildren, childNum, i, child, newChild, row = currentElem.getAscendant(tag, true);
		// looking for the table row marked as data-marker="row"
		while (!((row.getName() === tag) && (row.getAttribute(dataMarkerAttr) === dataMarkerVal))) {
			row = row.getParent();
			// whether the newly defined element exists and is of CKEDITOR type
			if (!(row && row.type === CKEDITOR.NODE_ELEMENT)) {
				return null; // exit in case no element is found in the DOM
			}
		}
		newElement = new CKEDITOR.dom.element(tag);
		operation = 'insert' + Helper.firstLetterUpperCase(pos);
		currentChildren = row.getChildren();
		childNum = currentChildren.count();

		if (newElement[operation] !== undefined) {
			newElement[operation](row);
		} else {
			return null;
		}

		row.copyAttributes(newElement);
		for (i = 0; i < childNum; i++) {
			child = currentChildren.getItem(i);
			newChild = new CKEDITOR.dom.element(child.getName());
			newChild.setHtml(row.getChild(i).getHtml());
			newElement.append(newChild);
			child.copyAttributes(newChild);
		}
	},

	/**
	 * Inserts a column in the table. The localtion of the column to insert is given by the second
	 * argument that admits two values "before" and "after" and is inserted before or after the column
	 * of the selected cell, respectively.
	 * @method     insertColumn
	 * @param      {CKEDITOR.editor} ed                 Represents an editor instance.
	 * @param      {String}          pos                "before" or "after": location of the column to insert w.r.t. the current cell
	 * @return     {void}
	 */
	insertColumn: function(ed, pos){
		if (pos !== 'before' && pos !== 'after'){
			return null;
		}
		var cell, cellObj, cellObjStyle, cellObjAttr, cellIndex, parentTable, newTableProfile,
			cellToInsert, cellToInsertAttr, cellToInsertStyle, tableProfile, newTable, tableObj,
			// offset to be added for the insertion of the column
			offset;

		// find the current cell, and not a bogus cell
		cell = CKHelper.findAscendant(ed.getSelection().getStartElement(), function (el) {
			var marker = (new Cell()).getType();
			return (el.getName() === 'td' && el.getAttribute(NEWSLETTER['marker-name']) === marker);
		});
		// find parent table to be sure that we treat a cell and not a bogus cell.
		parentTable = CKHelper.findAscendant(ed.getSelection().getStartElement(), function (el) {
			var marker = (new Table()).getType();
			return (el.getName() === 'table' && el.getAttribute(NEWSLETTER['marker-name']) === marker);
		});

		cellIndex = cell.getIndex();
		// create objects in order to retrieve their properties
		cellObj = cell.getOuterHtml().createCellFromHtml();
		tableObj = parentTable.getOuterHtml().createTableFromHtml();
		cellObjStyle = cellObj.style;
		cellObjAttr = cellObj.attr;
		tableProfile = tableObj.getProfile();

		newTableProfile = Helper.crack(tableProfile, cellIndex);

		cellToInsert = new Cell('cella');
		cellToInsertAttr = new Attributes(cellObjAttr);
		cellToInsertStyle = new Style(cellObjStyle);


		if (pos === 'before'){
			offset = 0;
			cellToInsertStyle['padding-right'] = 0;
			tableObj.appendStyleToCol(cellIndex, 'padding-left: 0px');
		}

		if (pos === 'after'){
			offset = 1;
			cellToInsertStyle['padding-left'] = 0;
			tableObj.appendStyleToCol(cellIndex, 'padding-right: 0px');
		}


		// binding the styles and attributes to the newly created cell
		cellToInsert.attr  = cellToInsertAttr;
		cellToInsert.style = cellToInsertStyle;

		// offset variable is responsible for insertion 'before' or 'after'
		tableObj.insertColumnAt(cellIndex + offset, cellToInsert);
		tableObj.setProfile(newTableProfile);

		newTable = CKEDITOR.dom.element.createFromHtml(tableObj.toHtml());
		parentTable.remove();
		// call a custom method to insert the table and assign hovering effects on it
		ed.insertTableWithHoverEff(newTable);
	},



	/**
	 * Inserts list. List items are populated from the selection. If the selection is empty,
	 * a list item with empty content is generated.
	 * @param   {CKEDITOR.editor} editor                 Represents an editor instance.
	 * @param   {String}          listType               Type of the list to insert (ol, ul)
	 * @return  {void}
	 */
	insertList: function(editor, listType){
		var node = editor.getSelection(),
		    range = node.getRanges()[0],
		    list = new List(listType),
		    fakeDiv = editor.document.createElement('div'),
		    listObj, listHtml, selection, i, len, li;
		fakeDiv.append(range.cloneContents());
		selection = fakeDiv.getHtml().inflate();
		list.style['margin-left'] = 40;
		len = selection.length();
		if (len > 0){
			for (i = 0; i < len; i++){
				li = new ListItem();
				li.appendElem(selection.getElem(i));
				list.appendItem(li);
			}
		} else {
			li = new ListItem();
			list.appendItem(li);
		}
	    listHtml = list.toHtml();
	    listObj = CKEDITOR.dom.element.createFromHtml(listHtml);
	    editor.insertElement(listObj);

	}



};
