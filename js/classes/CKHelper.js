/*global CKEDITOR, NEWSLETTER, Helper, Cell, Table, Attributes, Style, List, ListItem, Tag, Row */
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
   * Drops inline attribute named attrName from DOM element
   * @param  {Object} element   an inline attribute of  this element will be dropped. The element should respond to jQuery "attr" method.
   * @param  {string} attrName  this attribute name will be dropped.
   * @return {void}
   */
  dropInlineStyleAttr: function(element, attrName){
    // unhovering table
    var attr = element.attr('style'),
      style = new Style(attr);
    if (style.hasOwnProperty(attrName)){
      delete style[attrName];
    }
    element.attr('style', style.toString());
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
   * Whether the argument is a CKEDITOR.editor instance.
   * @method  isEditor
   * @param   {any}   obj
   */
  isEditor: function(obj){
    return (obj instanceof CKEDITOR.editor);
  },

   /**
   * Whether the argument is a CKEDITOR.dom.selection instance.
   * @method  isSelection
   * @param   {any}   obj
   */
  isSelection: function(obj){
    return (obj instanceof CKEDITOR.dom.selection);
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
	 * Gets the node string representation: if it is of CKEDITOR.NODE_ELEMENT type, then getOuterHtml() is returned,
	 * if it is of CKEDITOR.NODE_TEXT type, then getText() is returned. If none of the above types, '' (empty string is returned)
	 * @method nodeString
	 * @param    {CKEDITOR.dom.element} node
	 * @return   {String}
	 */
	nodeString: function(node){
		if (node.type === CKEDITOR.NODE_ELEMENT){
			return node.getOuterHtml();
		}
		if (node.type === CKEDITOR.NODE_TEXT){
			return node.getText();
		}
		return '...';
	},

	/**
	 * Gets the string representation of the node subelement: if the argument is of CKEDITOR.NODE_ELEMENT type, then
	 * the string representation of its child "offset" is returned. If the argument is of CKEDITOR.NODE_TEXT type,
	 * then: 1. if dir is "start" or null, then its substring starting from position 0 to "offset" (excluded) is returned;
	 * 2. if dir="end"; then its substring starting from position "offset" is returned.
	 * @method   nodeOffsetString
	 * @param    {Number}               offset
	 * @param    {CKEDITOR.dom.element} node
	 * @param    {String}               dir       "start" - for the beginning of the string, "end" for the end. Default - "start"
	 * @return   {String}
	 */
	nodeOffsetString: function(node, offset, dir){
		if (node.type === CKEDITOR.NODE_ELEMENT){
			return CKHelper.nodeString(node.getChild(offset));
		}
		if (node.type === CKEDITOR.NODE_TEXT){
			if (dir === 'start' || dir === undefined){
				return node.getText().substring(0, offset);
			}
			if (dir === 'end'){
				return node.getText().substring(offset);
			}
		}
		return 'wrong';
	},

	/**
	 * If `elem` is of CKEDITOR.NODE_ELEMENT type, pushes it into array `container` . Otherwise, it is ignored.
	 * @method  insertNode
	 * @param   {Array} container 	array in which an element is to be inserted.
	 * @param   {Any}   elem         if of CKEDITOR.NODE_ELEMENT type, it is to be inserted into container.
	 * @return  {void}
	 */
	insertNode: function(container, elem){
		if (elem.type === CKEDITOR.NODE_ELEMENT){
		    container.push(elem);
		}
	},

	/**
	 * Transforms each element of the array into a string and concatenates them. String representation
	 * of the element is supposed to be a text version (without tags).
	 * @method  arrayToText
	 * @param  {Array}   arr        array of elements (of mixed types)
	 * @param  {String}  sep        a string which will separate the text representation of each element. Default "" (empty string).
	 * @return {String}
	 */
	arrayToText: function(arr, sep){
		sep = sep || '';
		return arr.map(function(elem){
			var str;
            switch (elem.type){
                case CKEDITOR.NODE_ELEMENT:
                    str = elem.getHtml().inflate().toText();
                    break;
                case CKEDITOR.NODE_TEXT:
                    str = elem.getText();
                    break;
                default:
                    str = '...';
            }
            return str;
        }).join(sep);
	},

	/**
	 * Check whether two different CKEDITOR.dom.node's "overlaps". Returns true, if:
	 * <ol><li>both `elem1` and `elem2` are of `CKEDITOR.dom.element` type and either `elem1` contains `elem2` or viceverse,</li>
	 * <li>only one of `elem1`, `elem2` is of `CKEDITOR.dom.element` and it contains other,</li>
	 * <li>both `elem1` and `elem2` are of `CKEDITOR.dom.text` and they are equal.</li></ol>
	 * Otherwise, false is returned.
	 * @param {CKEDITOR.dom.element|CKEDITOR.dom.text}   elem1
	 * @param {CKEDITOR.dom.element|CKEDITOR.dom.text}   elem2
	 * @method  doesOverlap
	 * @return {Boolean}
	 */
	doesOverlap: function(elem1, elem2){
		var outcome = false;
		if (elem1.type === elem2.type && elem1.type === CKEDITOR.NODE_ELEMENT){
			outcome = elem1.equals(elem2) || elem1.contains(elem2) || elem2.contains(elem1) ;
		} else if (elem1.type === CKEDITOR.NODE_ELEMENT) {
			outcome = elem1.contains(elem2);
		} else if (elem1.type === CKEDITOR.NODE_ELEMENT){
			outcome = elem2.contains(elem1);
		} else {
			outcome = elem1.equals(elem2);
		}
		console.info('CKHelper', 'returning ' + outcome);
		return outcome;

	},


	/**
	 * Alternative version of Inserts list. List items are populated from the selection. If the selection is empty,
	 * a list item with empty content is generated.
	 * @method  insertList
	 * @param   {CKEDITOR.editor} editor                 Represents an editor instance.
	 * @param   {String}          listType               Type of the list to insert (ol, ul)
	 * @return  {void}
	 */
	insertList: function(editor, listType){
		// console.log('inside CKHelper::insertList()');
		var range, ranges, selection, selectionLen, i, j, list,
		    startContainer, endContainer, startType, endType,
		    listObj, listHtml, li, child, childStr, childObj, children, len, startNode,
		    next, nextStr, endNode, parentList,
		    nodesToDeleteLen,  elem,
		    nodesToDelete = [];
		    // currentNode, stop = 0, skip,iterator, liObj, parentList, listItems, listLen,listItemObj, liObjLen,
		selection = editor.getSelection();
		ranges = selection.getRanges();
		selectionLen = ranges.length;
		if (selectionLen === 0){
			return null;
		}
		for (i = 0; i < selectionLen; i++){
			console.log('selection loop: #', i + 1, ' of total ', selectionLen);
			list = new List(listType);
			list.style['margin-left'] = list.style['margin-left'] || 40;
			range = ranges[i];
			startContainer = range.startContainer;
			endContainer = range.endContainer;
			startType = startContainer.type;
			endType = endContainer.type;
			console.log(startType, endType);
			console.log(startContainer.equals(endContainer) ? 'selection is in the same node' : 'selection is in different nodes');
			endNode = endType === CKEDITOR.NODE_ELEMENT ? range.endContainer.getChildren().getItem(range.endOffset) : null;
			if (range.collapsed){
				list.appendItem(new ListItem());
				listHtml = list.toHtml();
				listObj = CKEDITOR.dom.element.createFromHtml(listHtml);
				editor.insertElement(listObj);
				break;
			}
			// if the start container is of node type, it means that a whole node was selected.
			// Let's take all its child nodes and insert them as list items into the list.
			if (startType === CKEDITOR.NODE_ELEMENT){
				console.log('start container is a node');
				startNode = startContainer.getChild(range.startOffset);
				console.log('startContainer: ', startContainer, ', start offset: ', range.startOffset,  ', startNode: ', startNode );
				if (startNode.type === CKEDITOR.NODE_ELEMENT){
					children = startNode.getChildren();
					len = children.count();
					for (j = 0; j < len; j++){
						li = new ListItem();
						child = children.getItem(j);
						childStr = this.nodeString(child);
						childObj = childStr.inflate();
						childObj.trim();
						// insert list item if it is not empty
						if (!childObj.isEmpty()){
							li.appendElem(childObj);
							list.appendItem(li);
						}
					}
				} else {
					li = new ListItem();
					li.appendElem(startNode.getText());
					list.appendItem(li);
				}
				listHtml = list.toHtml();
	    		startNode.setHtml(listHtml);
			}
			// start container is of text type. Nodes present in the range will be inserted into the list.
			// If a list item is among selected nodes, then all list items will be inserted into the list.
			if (startType === CKEDITOR.NODE_TEXT){
				console.log('start container is a text');
				// consider the start container separately
				li = new ListItem();
				if (startContainer.getParent().getName() === 'li'){
					parentList = startContainer.getParent().getParent().getOuterHtml().inflate();
					parentList.trim();
					list.appendList(parentList.getFirst());
				} else {
					li.appendElem(startContainer.getText());
					list.appendItem(li);
				}
				next = startContainer.getNext();
				while(next){
					nodesToDelete.push(next);
					nextStr = this.nodeString(next);
					elem = nextStr.inflate();
					if (!elem.isEmpty()){
						li = new ListItem();
						li.appendElem(elem);
						list.appendItem(li);
					}
					// if the current node is equal the endContainer (if it is a node),
					// then stop looping
					if (next.equals(endNode)){
						break;
					}
					next = next.getNext();
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
				startContainer.setText(startContainer.getText().substring(0, range.startOffset));
				editor.insertElement(listObj);
			}
		}
	},


	/**
	 * Converts list to a given type.
	 * @method  convertListTo
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
	},

  /**
   * Inserts table and applies hover effect on it.
   * It is based on CKEDITOR.editor.insertElement() method.
   * This approach might be wrong but I wanted to avoid repetitions.
   * @method insertTableWithHoverEff
   * @param  {CKEDITOR.dom.element} tbl
   * @return {void}
   */
  insertTableWithHoverEff: function(ed, tbl){
    ed.insertElement(tbl);
    $(tbl.$).hover(
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
              CKHelper.dropInlineStyleAttr($(allCells[i]), 'box-shadow');
            }

          }
        );
        // hovering the whole table
        $(this).css('box-shadow', '0.05em 0.05em 0.2em 0.05em #AAAFFF');
        // hovering table row
        $(this).find('tr').hover(
          function () {
            $(this).css('box-shadow', '0.05em 0.0em 0.5em 0.05em #AAAAAA');
          },
          function () {
            // unhovering the table row
            CKHelper.dropInlineStyleAttr($(this), 'box-shadow');
          }
        );
      }, function(){
        // unhovering table
        CKHelper.dropInlineStyleAttr($(this), 'box-shadow');
      }
    );
  },

  	/**
  	 * Returns an array of elements that are next siblings of the given one. The first next sibling becomes the first element
  	 * of the array, the second next sibling becomes the second one and so on.
  	 * @method  next-siblings
  	 * @param  {CKEDITOR.dom.element|CKEDITOR.dom.node}      elem
  	 * @return {Array}                                       array of CKEDITOR.dom.node
  	 */
  	'next-siblings': function(elem){
  		var container = [],
  			currentElem = elem;
  		while(currentElem.hasNext()){
  			currentElem = currentElem.getNext();
  			container.push(currentElem);
  		}
  		return container;
	},

  	/**
  	 * Returns an array of elements that are siblings of the given one and that come before it. The first prevoius
  	 * sibling becomes the first element of the array, the second previous sibling becomes the second one and so on.
  	 * @method  prev-siblings
  	 * @param  {CKEDITOR.dom.element|CKEDITOR.dom.node}      elem
  	 * @return {Array}                                       array of CKEDITOR.dom.node
  	 */
  	'prev-siblings': function(elem){
  		var container = [],
  			currentElem = elem;
  		while(currentElem.hasPrevious()){
  			currentElem = currentElem.getPrevious();
  			container.push(currentElem);
  		}
  		return container;
	},

	/**
	 * Returns array of elements that comes before or after in DOM with repsect to the argument when coming from
	 * it to the root element.
	 * @param  {CKEDITOR.dom.element|CKEDITOR.dom.node}   node         a node that must be inside of root node
	 * @param  {CKEDITOR.dom.element|CKEDITOR.dom.node}   root         the returned array elements will be inside this node.
	 * @param  {String}                                   dir          'prev' or 'next'. Defaults to 'next.'
	 * @return {[type]}      [description]
	 */
	'bunch-siblings': function(node, root, dir){
		dir = dir || 'next';
		return null;
	}



};


