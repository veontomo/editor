/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global  DOMParser, Node, Helper, Attributes, Styles, Cell, TableRowStyle, Row, ListItem, Table,
          Content, Tag, List, Link, LinkStyles, LinkAttributes */


/**
 * These are methods to convert strings into different objects.
 * @module  Helper
 * @class  StringHelper
 * @since  0.0.1
 * @author A.Shcherbakov
 */
String.prototype.createCellFromHtml = function(){
    /**
     * Transforms a cell-html string into Cell object. It is supposed that the string to process is of the
     * following form: `<td ... > ... </td>`. Inside the tag, there might be other nodes. If they are recognized
     * as a "supported" ones, the corresponding functions will be called to transform them into objects.
     * @method  createCellFromHtml
     * @return  {Cell|null}
     */
    var htmlStr = this,
        parser = new DOMParser(),
        fullTable = '<table><tbody><tr>' + htmlStr + '</tr></tbody></table>',
        doc = parser.parseFromString(fullTable, 'text/html'),
        node = doc.getElementsByTagName('td'),
        cell, attrs, nodeStyle, cellContent;
    if (node.length === 0){
        return null;
    }
    // process the first cell in the list of cells. The remaining cells are to be processed
    // at their turn (when the cell becomes first)
    node = node[0];

    // creating object
    cell = new Cell();

    // imposing its styles
    nodeStyle = node.getAttribute('style');
    cell.setStyles(new Styles(nodeStyle));

    // imposing its attributes
    attrs = Helper.flatten(node.attributes);
    if (attrs.hasOwnProperty('style')){
        delete attrs.style;
    }
    cell.setAttributes(new Attributes(attrs));

    cellContent = node.innerHTML.inflate();
    cell.setContent(cellContent);
    return cell;
};

String.prototype.createRowFromHtml = function(){
    /**
     * Transforms a row-html string into a Row object. It is supposed that the string to process is of the
     * following form: <tr ... > ... </tr>. Inside the tag, there might be elements "td" that will be
     * processed one by one by function String::createCellFromHtml().
     * @method  createRowFromHtml
     * @return  {Object} Row
     */
	var htmlStr = this,
		parser = new DOMParser(),
		fullTable  = '<table><tbody>' + htmlStr + '</tbody></table>',
		doc = parser.parseFromString(fullTable, 'text/html'),
		node = doc.getElementsByTagName('tr'),
        row = new Row(),
		attrs, i, nodeStyle, cellsNum, currentCell,
        // row = new Row(),
        cell, cells;
	if (node.length === 0){
		return null;
	}
	// the first table row is to be processed. The remaining ones will be processed at thier turn.
	node = node[0];

	// imposing styles
	nodeStyle = node.getAttribute('style');
	row.setStyles(new Styles(nodeStyle));

	// imposing its attributes
	attrs = Helper.flatten(node.attributes);
	if (attrs.hasOwnProperty('style')){
		delete attrs.style;
	}
	row.setAttributes(new Attributes(attrs));

	cells = node.children;
	cellsNum = cells.length;
	for (i = 0; i < cellsNum; i++){
		currentCell = cells[i];
		if(currentCell.tagName === "TD"){
			cell = currentCell.outerHTML.createCellFromHtml();
			row.appendCell(cell);
		}
	}
	return row;
};

String.prototype.createTableFromHtml = function(){
    /**
     * Creates an object representation from a string that is an html repersentation of a table.
     * Only one table is supposed to be processed at a time, so the string to be processed is to
     * be of the following form `<table ...> ... </table>`. Inside the tag, there should be tags "tr"
     * that will be processed one by one by function String::createRowFromHtml().
     * @method  createTableFromHtml
     * @return  {Table|null}
     */
    var htmlStr = this,
        parser = new DOMParser(),
        doc = parser.parseFromString(htmlStr, 'text/html'),
        node = doc.getElementsByTagName('table'),
        table, attrs, i, nodeStyle, rows, rowsNum, currentRow, row;
    if (node.length === 0){
        return null;
    }
    node = node[0];

    // creating table
    table = new Table();

    // imposing table styles
    nodeStyle = node.getAttribute('style');
    table.setStyles(new Styles(nodeStyle));
    // imposing table attributes
    attrs = Helper.flatten(node.attributes);
    if (attrs.hasOwnProperty('style')){
        delete attrs.style;
    }
    table.setAttributes(new Attributes(attrs));

    // the only child of the table is always tbody
    if (node.children.length !== 1){
        return table;
    }
    rows = node.children[0].children;
    rowsNum = rows.length;

    for (i = 0; i < rowsNum; i++){
        currentRow = rows[i];
        if(currentRow.tagName === "TR"){
            row = currentRow.outerHTML.createRowFromHtml();
            table.appendRow(row);
        }
    }
    // if the table turns out to be framed, "disentanlement" will pull out properties of
    // bogus cells, rows and tables
    table.disentangle();
    return table;
};

String.prototype.createListFromHtml = function(listType){
    /**
     * Transforms a list string into a List object. The argument listType is used to initialize the
     * property "name" of the returned instance. If it is not provided, that the node tag-name property is used.
     * It is supposed that the string to process is of the following form:
     * `<ol ... > ... </ol>` or `<ul ... > ... </ul>`.
     * Inside the tag, there might be other nodes. If they are recognized as a "supported" ones, the
     * corresponding functions will be called to transform them into objects.
     * @method   createListFromHtml
     * @param    {String}           listType: ul or li
     * @return   {List|null}
     */
    var str = this.toString(),
        parser = new DOMParser(),
        id = Helper.generateId(str, 'fakeId'),
        doc = parser.parseFromString('<div id="' + id + '">' + str + '</div>', 'text/html'),
        output = new List(),
        uniqueNode, uniqueNodeChildren, node, nodeInternal, elem, i , children, childrenLen, attrs, style,
        nodeHtml, methodName, methodExists;
    uniqueNode = doc.getElementById(id);
    uniqueNodeChildren = uniqueNode.childNodes;
    if (uniqueNodeChildren.length === 1){
        node = uniqueNodeChildren[0]; // in fact this is the node corresponding to the target string
        output.name = listType || node.nodeName.toLowerCase();

        style = node.getAttribute('style');
        output.style = new Styles(style);
        attrs = Helper.flatten(node.attributes);
        if (attrs.hasOwnProperty('style')){
            delete attrs.style;
        }
        output.attr = new Attributes(attrs);
        // split the target string on blocks
        children = node.childNodes;
        childrenLen = children.length;
        for(i = 0; i < childrenLen; i++){
            nodeInternal = children[i];
            // parsing only list item nodes
            if (nodeInternal.nodeType === Node.ELEMENT_NODE && nodeInternal.nodeName === 'LI'){
               nodeHtml = nodeInternal.outerHTML;
               methodName = 'createListItemFromHtml';
               methodExists = (typeof nodeHtml[methodName]) === 'function';
               elem = methodExists ? nodeHtml[methodName]() : nodeHtml.createTagFromHtml();
               output.appendElem(elem);
            }
        }
    }
    return output;
};

String.prototype.createUlFromHtml = function(){
    /**
     * Calls String::createListFromHtml('ul') on the target string.
     * @method  createUlFromHtml
     * @return  {List|null}
     */

    return this.toString().createListFromHtml('ul');
};

String.prototype.createOlFromHtml = function(){
    /**
     * Calls String::createListFromHtml('ol') on the target string.
     * @method  createOlFromHtml
     * @return  {List|null}
     */
    return this.toString().createListFromHtml('ol');
};

String.prototype.createListItemFromHtml = function(){
    /**
     * Transforms a list item string into a ListItem object. It is supposed that the string to process is of the
     * following form: `<li ... > ... </li>`. Inside the tag, there might be other nodes. If they are recognized
     * as a "supported" ones, the corresponding functions will be called to transform them into objects.
     * @method  createListItemFromHtml
     * @return  {ListItem|null}
     */
    var htmlStr = this,
        parser = new DOMParser(),
        doc = parser.parseFromString('<ul>' + htmlStr + '</ul>', 'text/html'),
        node = doc.getElementsByTagName('li'),
        listItem, attrs, i, nodeStyle, elem, elems, elemsNum, currentElem, methodToCall, methodExists, nodeName;
    if (node.length === 0){
        return null;
    }
    // process the first element among the found ones. The remaining elements
    // are to be processed at their turn (when each of the becomes first)
    node = node[0];

    // creating object
    listItem = new ListItem();

    // imposing its styles
    nodeStyle = node.getAttribute('style');
    listItem.style = new Styles(nodeStyle);

    // imposing its attributes
    attrs = Helper.flatten(node.attributes);
    if (attrs.hasOwnProperty('style')){
        delete attrs.style;
    }
    listItem.attr = new Attributes(attrs);
    elems = node.childNodes;
    elemsNum = elems.length;
    for (i = 0; i < elemsNum; i++){
        currentElem = elems[i];
        switch (currentElem.nodeType){
            case Node.TEXT_NODE:
                elem = currentElem.textContent;
                break;
            case Node.ELEMENT_NODE:
                nodeName = currentElem.nodeName;
                methodToCall = 'create' + Helper.onlyFirstLetterUpperCase(nodeName) + 'FromHtml';
                methodExists = String.prototype.hasOwnProperty(methodToCall);
                elem = methodExists ? currentElem.outerHTML[methodToCall]() : currentElem.outerHTML.createTagFromHtml();
                // console.log('inside ListItem: methodToCall: ', methodToCall, ' methodExists: ', methodExists);
                break;
            default:
                elem = currentElem.nodeValue;
        }
        listItem.appendElem(elem);
    }
    return listItem;
};

String.prototype.createTagFromHtml = function(){
    /**
     * Creates an instance of Tag class and fills in its property "elements" with
     * the elements recognized inside the string. It is supposed that the string is of the
     * form `<tag [tag-attributes] [style="..."]>....</tag>`.
     * @method    createTagFromHtml
     * @return    {Content|null}
     */

    var str = this.toString(),
        parser = new DOMParser(),
        id = Helper.generateId(str, 'fakeId'),
        doc = parser.parseFromString('<div id="' + id + '">' + str + '</div>', 'text/html'),
        output = new Tag(),
        uniqueNode, uniqueNodeChildren, node, nodeInternal, elem, i , children, childrenLen, attrs, style,
        tagName, nodeHtml, methodName, methodExists;
    uniqueNode = doc.getElementById(id);
    uniqueNodeChildren = uniqueNode.childNodes;
    if (uniqueNodeChildren.length === 1){
        node = uniqueNodeChildren[0]; // in fact this is the node corresponding to the target string
        if (node.nodeType === Node.ELEMENT_NODE){
            tagName = node.nodeName;
            output.name = tagName.toLowerCase();

            style = node.getAttribute('style');
            output.style = new Styles(style);
            attrs = Helper.flatten(node.attributes);
            if (attrs.hasOwnProperty('style')){
                delete attrs.style;
            }
            output.attr = new Attributes(attrs);
            // split the target string on blocks
            children = node.childNodes;
            childrenLen = children.length;
            for(i = 0; i < childrenLen; i++){
                nodeInternal = children[i];
                if (nodeInternal.nodeType === Node.TEXT_NODE){
                    elem = nodeInternal.textContent;
                }
                if (nodeInternal.nodeType === Node.ELEMENT_NODE){
                    nodeHtml = nodeInternal.outerHTML;
                    // console.log(nodeInternal.nodeName);
                    methodName = 'create' + Helper.onlyFirstLetterUpperCase(nodeInternal.nodeName) + 'FromHtml';
                    methodExists = (typeof nodeHtml[methodName]) === 'function';
                    elem = methodExists ? nodeHtml[methodName]() : nodeHtml.createTagFromHtml();
                }
                output.appendElem(elem);
            }
        }
    }
    return output;
};
String.prototype.createAFromHtml = function(){
    return this.toString().createLinkFromHtml();
};

String.prototype.createLinkFromHtml = function(){
    /**
     * Creates an instance of Link class and fills in its property "elements" with
     * the elements recognized inside the string. It is supposed that the string is of the
     * form `<tag [tag-attributes] [style="..."]>....</tag>`.
     * @method    createLinkFromHtml
     * @return    {Link|null}
     */

    var str = this.toString(),
        parser = new DOMParser(),
        id = Helper.generateId(str, 'fakeId'),
        doc = parser.parseFromString('<div id="' + id + '">' + str + '</div>', 'text/html'),
        output = new Link(),
        uniqueNode, uniqueNodeChildren, node, nodeInternal, elem, i , children, childrenLen, attrs, style,
        tagName, nodeHtml, methodName, methodExists, href;
    uniqueNode = doc.getElementById(id);
    uniqueNodeChildren = uniqueNode.childNodes;
    if (uniqueNodeChildren.length === 1){
        node = uniqueNodeChildren[0]; // in fact this is the node corresponding to the target string
        if (node.nodeType === Node.ELEMENT_NODE){
            tagName = node.nodeName;
            output.name = tagName.toLowerCase();

            style = node.getAttribute('style');
            href = node.getAttribute('href');
            output.style = new LinkStyles(style);
            attrs = Helper.flatten(node.attributes);
            if (attrs.hasOwnProperty('style')){
                delete attrs.style;
            }
            output.attr = new LinkAttributes(attrs);
            output.attr.setHref(href);
            // split the target string on blocks
            children = node.childNodes;
            childrenLen = children.length;
            for(i = 0; i < childrenLen; i++){
                nodeInternal = children[i];
                if (nodeInternal.nodeType === Node.TEXT_NODE){
                    elem = nodeInternal.textContent;
                }
                if (nodeInternal.nodeType === Node.ELEMENT_NODE){
                    nodeHtml = nodeInternal.outerHTML;
                    methodName = 'create' + Helper.onlyFirstLetterUpperCase(nodeInternal.nodeName) + 'FromHtml';
                    methodExists = (typeof nodeHtml[methodName]) === 'function';
                    elem = methodExists ? nodeHtml[methodName]() : nodeHtml.createTagFromHtml();
                }
                output.appendElem(elem);
            }
        }
    }
    return output;
};


String.prototype.inflate = function(){
    /**
     * Creates an instance of Content class and fills in its property "elements" with
     * the elements recognized inside the string.
     * @method    inflate
     * @return    {Content}
     */
    var str, parser, id, doc, output, node, children, childrenNum, i, child, childHtml, elem, methodName, methodExists;
    str = this.toString();
    parser = new DOMParser();
    output = new Content();

    id = Helper.generateId(str, 'fakeId');
    if (Helper.isSemanticallyValid(str)){
        doc = parser.parseFromString('<div id="' + id + '">' + str + '</div>', 'text/html');
        node = doc.getElementById(id);
        children = node.childNodes;
        childrenNum = children.length;
        if (childrenNum > 0){
            for (i = 0; i < childrenNum; i++){
                child = children[i];
                switch (child.nodeType){
                    case Node.TEXT_NODE:
                        elem = child.textContent.trim();
                        break;
                    case Node.ELEMENT_NODE:
                        childHtml = child.outerHTML;
                        methodName = 'create' + Helper.onlyFirstLetterUpperCase(child.nodeName) + 'FromHtml';
                        methodExists = (typeof childHtml[methodName] === 'function');
                        // if the method exists, apply it to the string representation of
                        // the current node. Otherwise, apply recursively the method "inflate"
                        // to the inner part of the current node.
                        if (methodExists){
                            elem = childHtml[methodName]();
                        } else {
                            elem = childHtml.createTagFromHtml();
                        }
                        break;
                    default:
                        elem = child.nodeValue;
                }
                if(elem){
                    output.appendElem(elem);
                }
            }
        }
    }
    return output;
};