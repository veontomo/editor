/*global CKEDITOR, NEWSLETTER, Helper, Cell, Table, Attributes, Style, List, ListItem, Tag */
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
	insertList__old: function(editor, listType){
		console.log('inside CKHelper::insertList()');
		var node, range, list, fakeDiv,
		    listObj, listHtml, selection, selectionObj, i, len, li, elem,
		    orphans, startTagName, startContainer, goToParent;
		list = new List(listType);
		list.style['margin-left'] = list.style['margin-left'] || 40;
		// list of html tags that must be taken into consideration only with their parents
		// without parents they are considered orphans.
		orphans = ['li', 'td', 'tr', 'tbody'];
		node = editor.getSelection();
		range = node.getRanges()[0];
		startContainer = range.startContainer;
		startTagName = startContainer && startContainer.getParent() && startContainer.getParent().getName();
		console.log('startTagName: ', startTagName);
		console.log('startContainer: ', startContainer);
		// if the tag name of the current element is inside the list of "orphans", then
		// consider the parent element
		goToParent = orphans.indexOf(startTagName) !== -1;
		if (goToParent) {
			console.log('getting parent');
			selection = startContainer.getParent().getParent().getOuterHtml();
		} else {
			console.log('getting current');
			fakeDiv = editor.document.createElement('div');
			fakeDiv.append(range.cloneContents());
			selection = fakeDiv.getHtml();
		}
		console.log('detected selection: ', selection);
		// selectionObj = selection.replace('&nbsp;', '').inflate();
		selectionObj = selection.inflate();

		len = selectionObj.length();
		for (i = 0; i < len; i++){
			li = new ListItem();
			elem = selectionObj.getElem(i);
				if ((typeof elem === 'string') || ((elem instanceof Tag) && (!elem.isEmpty()))) {
				li.appendElem(elem);
				list.appendItem(li);
			}
		}
		list.trim();
		// if nevertheless, the list remains empty, one item is added
		if (list.length() === 0){
			li = new ListItem();
			list.appendItem(li);
		}
		// removes the element, which content was used to create the list
		// goToParent ? node.getCommonAncestor().remove() : node.reset();

	    listHtml = list.toHtml();
	    listObj = CKEDITOR.dom.element.createFromHtml(listHtml);
	    // console.log('string to createHTMl from:', listHtml);
	    // console.log('insertion is blocked');
	    editor.insertElement(listObj);
	},

	/**
	 * Alternative version of Inserts list. List items are populated from the selection. If the selection is empty,
	 * a list item with empty content is generated.
	 * @param   {CKEDITOR.editor} editor                 Represents an editor instance.
	 * @param   {String}          listType               Type of the list to insert (ol, ul)
	 * @return  {void}
	 */
	insertList: function(editor, listType){
		// console.log('inside CKHelper::insertList()');
		var range, ranges, selection, selectionLen, i, j, currentNode, list,
		    stop = 0, iterator, startType,
		    listObj, listHtml, li, child, childStr, childObj, children, len, startNode, skip,
		    liObj, parentList, listItems, listLen, listItemObj, nodesToDeleteLen,
		    nodesToDelete = [];
		selection = editor.getSelection();
		ranges = selection.getRanges();
		selectionLen = ranges.length;
		// console.log('# elements in range: ', ranges.length);
		if (selectionLen === 0){
			return null;
		}
		for (i = 0; i < selectionLen; i++){
			// console.log('loop #: ', i);
			list = new List(listType);
			list.style['margin-left'] = list.style['margin-left'] || 40;

			range = ranges[i];
			startType = range.startContainer.type;
			// endType = range.endContainer.type;
			// startString = startType === CKEDITOR.NODE_ELEMENT ? '(html) ' + range.startContainer.getChild(range.startOffset).getOuterHtml() : '(text) ' + range.startContainer.getText().substring(range.startOffset);

			// if the start container is of node type, it means that a whole node was selected.
			// Let's take all its child nodes and insert them as list items into the list.
			if (startType === CKEDITOR.NODE_ELEMENT){
				// console.log('start container is a node');
				startNode = range.startContainer.getChild(range.startOffset);
				children = startNode.getChildren();
				len = children.count();
				for (j = 0; j < len; j++){
					li = new ListItem();
					child = children.getItem(j);
					switch (child.type){
						case CKEDITOR.NODE_ELEMENT:
							childStr = child.getOuterHtml();
							break;
						case CKEDITOR.NODE_TEXT:
							childStr = child.getText();
							break;
						default:
							console.log('This part was supposed to never be called, but it has been called!');
					}
					childObj = childStr.inflate();
					// insert list item if it is not empty
					if (!childObj.isEmpty()){
						li.appendElem(childObj);
						list.appendItem(li);
					}
				}
				listHtml = list.toHtml();
	    		startNode.setHtml(listHtml);
			}
			// start container is of text type. Nodes present in the range will be inserted into the list.
			// If a list item is among selected nodes, then all list items will be inserted into the list.
			if (startType === CKEDITOR.NODE_TEXT){
				iterator = range.createIterator();
				currentNode = iterator.getNextParagraph();
				stop = 0;
				// In selection, there might be a sequence of list items that are to be inserted into the list
				// along with the other list items of the parent list. So, when a 'li' node is encountered,
				// then the whole bunch of 'li' of that list will be added into resulting list.
				skip = false;  // whether to skip the node (because it has been already added when its parent was added to the list)
				// 'stop' is a cut-off to avoid infinite loops (there should be no such loops, but for debugging purposes)
				while (currentNode && stop < 5){
					stop++;
					if (!skip && currentNode.getName() === 'li'){
						// marker showing that one should consider only first list item node and
						// skip all remaining consequtive list item nodes
						skip = true;
						parentList = currentNode.getParent();
						nodesToDelete.push(parentList);
						// console.log('parentList: ', parentList);
						listItems = parentList.getChildren();
						listLen = listItems.count();
						for (j = 0; j < listLen; j++){
							listItemObj = listItems.getItem(j).getHtml().inflate();
							li = new ListItem();
							li.appendElem(listItemObj);
							list.appendItem(li);
						}
					}
					if (currentNode.getName() !== 'li') {
						// non-list-item-node is encountered, so let's reset the marker to indicate that the
						// sequence of list items has been broken
						skip = false;
						nodesToDelete.push(currentNode);
						li = new ListItem();
						liObj = currentNode.getHtml().inflate();
						liObj.trim();
						if (!liObj.isEmpty()){
							li.appendElem(liObj);
							list.appendItem(li);
						}
					}
					// console.log('current node: ', currentNode, currentNode.type === CKEDITOR.NODE_ELEMENT ? ', html: ' + currentNode.getOuterHtml() : ', text: ' + currentNode.getText());
					currentNode = iterator.getNextParagraph();
				}
				if (list.length() === 0){
					li = new ListItem();
					list.appendItem(li);
				}
				listHtml = list.toHtml();
				listObj = CKEDITOR.dom.element.createFromHtml(listHtml);
				nodesToDeleteLen = nodesToDelete.length;
				for (j = 0; j < nodesToDeleteLen; j++){
					nodesToDelete[j].remove();
				}
				editor.insertElement(listObj);
			}
		}


	},


	/**
	 * Converts list to a given type.
	 * @param   {CKEDITOR.editor} editor                 Represents an editor instance.
	 * @param   {String}          fromType               Type of the list (ol, ul)
	 * @param   {String}          toType                 Type of the list (ol, ul)
	 * @return  {void}
	 */
	convertListTo: function(editor, fromType, toType){
		var startElem = editor.getSelection().getStartElement(),
			list = startElem.getAscendant(fromType, true),
			listObj, listHtml, cont, contObj, i, len, elem;
		if (list){
			cont = list.getOuterHtml();
			contObj = cont.inflate();
			if (contObj.length() === 1 && (contObj.getFirst() instanceof List)){
				listObj = contObj.getFirst(); // the list that must be converted
				listObj.setName(toType);
				// for some reason, CKEditor appends <br> to element on which the dialog event was fired.
				// Lets scan the children of the List and delete the final <br> if any
				len = listObj.length();
				for (i = 0; i < len; i++){
					elem = listObj.getElem(i);
					// delete the last element if it is empty
					if ((elem instanceof Tag) && (elem.getLast() instanceof Tag) && (elem.getLast().isEmpty())){
						elem.dropLast();
					}
				}listObj.trim();
				listHtml = listObj.toHtml();
				listObj = CKEDITOR.dom.element.createFromHtml(listHtml);
				list.remove();
				editor.insertElement(listObj);

			}
		}

	}
};
