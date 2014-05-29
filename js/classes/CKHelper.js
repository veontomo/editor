/*global CKEDITOR, NEWSLETTER, Helper, Cell, Table, Attributes, Styles, List, ListItem, Tag, Row, Selection, FACTORY, Node */
/*jslint plusplus: true, white: true */

/**
 * Collection of functions used by various plugins of the CKEditor.
 * @module    Helper
 * @class     CKHelper
 * @type      {Object}
 * @since     0.0.1
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
	* Drops inline property named `propName` from DOM element
	* @method           dropInlineStyleAttr
	* @param            {Object}    element              an inline attribute of  this element will be dropped.
	*                                                    The element should respond to jQuery "attr" method.
	* @param            {string}    attrName             attribute name to be dropped.
	* @return           {void}
	*/
	dropInlineStyleAttr: function(element, propName){
		// unhovering table
		var attr = element.attr('style'),
	 	style = new Styles(attr),
	 	styleStr;
		style.dropProperty(propName);
		// might have format style="..." or just "...", so one needs to select "..."
		styleStr = style.toBareString();
		element.attr('style', styleStr);
	},


	/**
	 * Removes link-related stuff from `link`  and then replaces it in the editor.
	 * @method     unlink
	 * @param      {CKEditor.editor}        ed             Represents an editor instance.
	 * @param      {CKEDITOR.dom.element}   link
	 * @return     {void}
	 */
	unlink: function(ed, link){
		// the arguments must be of required type
		if (!(ed instanceof CKEDITOR.editor) || !(link instanceof CKEDITOR.dom.element)){
			return null;
		}
		var linkNative = link.$,
			parent = linkNative.parentNode,
			nextSibling = linkNative.nextSibling,
			factory = FACTORY.factory,
			linkObj = factory.mimic(linkNative);
		linkObj.getContent().getElements().forEach(function(el){
			parent.insertBefore(el.toNode(), nextSibling);
		});
		linkNative.remove();

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
		var cell, cellObj, cellObjStyles, cellObjAttr, cellIndex, parentTable, newTableProfile,
			cellToInsert, cellToInsertAttr, cellToInsertStyles, tableProfile, newTable, tableObj,
			// offset to be added for the insertion of the column
			offset;

		// find the current cell, and not a bogus cell
		cell = CKHelper.findAscendant(ed.getSelection().getStartElement(), function (el) {
			var marker = (new Cell()).getName();
			return (el.getName() === 'td' && el.getAttribute(NEWSLETTER['marker-name']) === marker);
		});
		// find parent table to be sure that we treat a cell and not a bogus cell.
		parentTable = CKHelper.findAscendant(ed.getSelection().getStartElement(), function (el) {
			var marker = (new Table()).getName();
			return (el.getName() === 'table' && el.getAttribute(NEWSLETTER['marker-name']) === marker);
		});

		cellIndex = cell.getIndex();
		// create objects in order to retrieve their properties
		cellObj = cell.getOuterHtml().createCellFromHtml();
		tableObj = parentTable.getOuterHtml().createTableFromHtml();
		cellObjStyles = cellObj.getStyles();
		cellObjAttr = cellObj.getAttributes();
		tableProfile = tableObj.getProfile().map(function(el){return parseFloat(el);});

		newTableProfile = Helper.crack(tableProfile, cellIndex);
		cellToInsert = new Cell('cella');
		cellToInsertAttr = new Attributes(cellObjAttr);
		cellToInsertStyles = new Styles(cellObjStyles);


		if (pos === 'before'){
			offset = 0;
			cellToInsertStyles.setProperty('padding-right',  0);
			tableObj.appendStyleToCol(cellIndex, 'padding-left: 0px');
		}

		if (pos === 'after'){
			offset = 1;
			cellToInsertStyles.setProperty('padding-left', 0);
			tableObj.appendStyleToCol(cellIndex, 'padding-right: 0px');
		}


		// binding the styles and attributes to the newly created cell
		cellToInsert.setAttributes(cellToInsertAttr);
		cellToInsert.setStyles(cellToInsertStyles);

		// offset variable is responsible for insertion 'before' or 'after'
		tableObj.insertColAt(cellIndex + offset, cellToInsert);
		tableObj.setProfile(newTableProfile);

		newTable = CKEDITOR.dom.element.createFromHtml(tableObj.toHtml());
		parentTable.remove();
		// call a custom method to insert the table and assign hovering effects on it
		// CKHelper.insertTableWithHoverEff(ed, newTable);
		ed.insertElement(newTable);
	},


	/**
	 * Gets the node string representation: if it is of CKEDITOR.NODE_ELEMENT type, then getOuterHtml() is returned,
	 * if it is of CKEDITOR.NODE_TEXT type, then getText() is returned. If none of the above types, '' (empty string is returned)
	 * @method nodeString
	 * @param    {CKEDITOR.dom.element}     node
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
	 * @method         arrayToText
	 * @param          {Array}              arr        array of elements (of mixed types)
	 * @param          {String}             sep        a string which will separate the text representation of each element.
	 *                                                 Default is "" (empty string).
	 * @return         {String}
	 */
	arrayToText: function(arr, sep){
		sep = sep || '';
		return arr.map(function(elem){
			var str;
            switch (elem.type){
                case CKEDITOR.NODE_ELEMENT:
                    str =  elem.textContent;
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
		//console.info('CKHelper', 'returning ' + outcome);
		return outcome;

	},



	/**
	 * Inserts a list which items are populated from the selection. If the selection is empty,
	 * a list item with empty content is generated.
	 * @method         insertList
	 * @param          {CKEDITOR.editor}    editor                 Represents an editor instance.
	 * @param          {String}             listType               Type of the list to insert (ol, ul)
	 * @return         {void}
	 */
	insertList: function(editor, listType){
		var selection = new Selection(editor),
		    selectedNodes = selection.selectedNodes(),                   // 2-dim array
		    factory = FACTORY.factory;
		console.log('CKHelper::insertListNew ', selectedNodes);
		selectedNodes.forEach(function(block){
			var len = block.length,
				elem, list, content, newNode, firstElem;
			list = new List(listType);
			// if the block is empty (it means that the selection is empty), insert a link and exit
			if (len === 0){
				list.appendElem(new ListItem());
				newNode = CKEDITOR.dom.element.createFromHtml(list.toHtml());
				editor.insertElement(newNode);
				return null;
			}
			// if still here, it means that the block has at least one item
			firstElem = block.shift().$;                                  // NB: block lenght gets reduced here
			if (len === 1 && (firstElem.nodeType === Node.ELEMENT_NODE)){ // the block has only one item
																		  // and this item is an ELEMENT_NODE
				elem = factory.mimic(firstElem);
				content = elem.getContent();
				list = new List(listType);
				list.appendAsItems(content);
				elem.setElements([list]);
				newNode = elem.toNode();
				firstElem.parentNode.replaceChild(newNode, firstElem);
				return null;
			}
			// default case
			var current = [factory.mimic(firstElem)];         // create array with one element
			block.forEach(function(el){
				current.push(factory.mimic(el.$));
				el.$.remove();
			});
			list.appendAsItems(current);
			newNode = list.toNode();
			firstElem.parentNode.replaceChild(newNode, firstElem);
			// newNode.focus()
		});

	},


	/**
	 * Change the type of `list` to be `newListType` and replace the old list with newer one.
	 * @method         changeListType
	 * @param          {CKEDITOR}                editor
	 * @param          {CKEDITOR.dom.element}    list
	 * @param          {String}                  newListType
	 * @return         {void}
	 */
	changeListType: function(editor, list, newListType){
		var listCopy, listObj, listHtml;
		if (list){
			listCopy = new List();
			listCopy.load(list.$);
			listCopy.switchName(newListType);
			listCopy.trim();
			listHtml = listCopy.toHtml();
			listObj = CKEDITOR.dom.element.createFromHtml(listHtml);
			list.remove();
			editor.insertElement(listObj);
		}
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
	 * Returns an array containing `node` and elements that come after it
	 * the in DOM in the context of `root`. Therefore, all array elements
	 * belong to `root`. `root` itself is not included in the output except
	 * the case when it is equal to `node`. If `root` does not contain `node`,
	 * the output must be an empty array.
	 * Uses {{#crossLink "CKHelper/next-siblings:method"}}CKHelper['next-siblings']{{/crossLink}}
	 * to fill in array with the next siblings.
	 * @method                                            bunch-next-siblings
	 * @param  {CKEDITOR.dom.element|CKEDITOR.dom.node}   node         a node that must be inside of root node
	 * @param  {CKEDITOR.dom.element|CKEDITOR.dom.node}   root         the returned array elements will be inside this node.
	 * @return {Array}                                                 nodes between `node` and `root` last child (inclusively)
	 */
	'bunch-next-siblings': function(node, root){
		if (node.equals(root)){
			return [node];
		}
		if (!root.contains(node)){
			return [];
		}
		var output = [node],
			elem = node,
			parent = elem.getParent(),
			fun = CKHelper['next-siblings'];
		while (!root.equals(parent)){
			output = output.concat(fun(elem));
			elem = parent;
			parent = parent.getParent();
		}
		output = output.concat(fun(elem));
		return output;
	},

	/**
	 * Returns an array containing `node` and elements that come before it
	 * the in DOM in the context of `root`. Therefore, all array elements
	 * belong to `root`. `root` itself is not included in the output except
	 * the case when it is equal to `node`. If `root` does not contain `node`,
	 * the output must be an empty array.
 	 * Uses {{#crossLink "CKHelper/prev-siblings:method"}}CKHelper['prev-siblings']{{/crossLink}}
	 * to fill in array with the next siblings.
	 * @method                                            bunch-prev-siblings
	 * @param  {CKEDITOR.dom.element|CKEDITOR.dom.node}   node         a node that must be inside of root node
	 * @param  {CKEDITOR.dom.element|CKEDITOR.dom.node}   root         the returned array elements will be inside this node.
	 * @return {Array}                                                 nodes between `node` and `root` first child (inclusively)
	 */
	'bunch-prev-siblings': function(node, root){
		if (node.equals(root)){
			return [node];
		}
		if (!root.contains(node)){
			return [];
		}
		var output = [node],
			elem = node,
			parent = elem.getParent(),
			fun = CKHelper['prev-siblings'];
		while (!root.equals(parent)){
			output = output.concat(fun(elem));
			elem = parent;
			parent = parent.getParent();
		}
		output = output.concat(fun(elem));
		return output;
	},

	/**
	 * Returns the first child of the `root` containing `node`.
	 * If `root` does not contain `node`, `null` is returned.
	 * Uses {{#crossLink "CKHelper/containsOrEqual:method"}}CKHelper::containsOrEqual(){{/crossLink}}.
	 * @method childWithNode
	 * @param  {CKEDITOR.dom.node}       root        haystack to be searched in
	 * @param  {CKEDITOR.dom.node}       node        needle to be present in the haystack
	 * @return {CKEDITOR.dom.node|null}              the first child of the haystack that contians needle, or `null`
	 *                                               if there is no nedlee in the haystack.
	 */
	'childWithNode': function(root, node){
		var children, len, i, item;
		if (root.contains(node)){
			children = root.getChildren();
			len = children.count();
			for (i = 0; i < len; i++){
				item = children.getItem(i);
				if (CKHelper.containsOrEqual(item, node)){
					return item;
				}
			}
		}
		return null;
	},

	/**
	 * Returns true if `elem1` contains `elem2` or if they are equal. False otherwise.
	 * @method  containsOrEqual
	 * @param  {CKEDITOR.dom.node}     elem1
	 * @param  {CKEDITOR.dom.node}     elem2
	 * @return {Boolean}
	 */
	containsOrEqual: function(elem1, elem2){
		var elem1Type = elem1.type;
		if (elem1Type === CKEDITOR.NODE_ELEMENT){
		    return  (elem1.contains(elem2) || elem1.equals(elem2));
		}
		if (elem1Type === CKEDITOR.NODE_TEXT){
		    return (elem1.equals(elem2));
		}
		return false;
	}
};