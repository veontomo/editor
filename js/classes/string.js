/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global DOMParser, Node, Helper, Attributes, Style, Cell, TableRowStyle, Row, ListItem, Table, Content, Tag, List */


/**
 * Transforms a cell-html string into Cell object. It is supposed that the string to process is of the
 * following form: <td ... > ... </td>. Inside the tag, there might be other nodes. If they are recognized
 * as a "supported" ones, the corresponding functions will be called to transform them into objects.
 * For the moment, the only supported element is "Table".
 * @module  String
 * @class  StringHelper
 * @method  createCellFromHtml
 * @return  {Object} Cell
 */
String.prototype.createCellFromHtml = function(){
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
    cell.style = new Style(nodeStyle);

    // imposing its attributes
    attrs = Helper.flatten(node.attributes);
    if (attrs.hasOwnProperty('style')){
        delete attrs.style;
    }
    cell.attr = new Attributes(attrs);

    cellContent = node.innerHTML.inflate();
    cell.content = cellContent;
    return cell;
};

/**
 * Transforms a row-html string into a Row object. It is supposed that the string to process is of the
 * following form: <tr ... > ... </tr>. Inside the tag, there might be elements "td" that will be
 * processed one by one by function String::createCellFromHtml().
 * @module  String
 * @class  StringHelper
 * @method  createRowFromHtml
 * @return  {Object} Row
 */
String.prototype.createRowFromHtml = function(){
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
	row.style = new Style(nodeStyle);

	// imposing its attributes
	attrs = Helper.flatten(node.attributes);
	if (attrs.hasOwnProperty('style')){
		delete attrs.style;
	}
	row.attr = new Attributes(attrs);

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

/**
 * Creates an object representation from a string that is an html repersentation of a table.
 * Only one table is supposed to be processed at a time, so the string to be processed is to
 * be of the following form &lt;table ...&gt; ... &lt;/table&gt;. Inside the tag, there should be tags "tr"
 * that will be processed one by one by function String::createRowFromHtml().
 * @module  String
 * @class  StringHelper
 * @method  createTableFromHtml
 * @return  {Table}
 */
String.prototype.createTableFromHtml = function(){
    var htmlStr = this,
        // isFramed = htmlStr.isFramedTable(),
        parser = new DOMParser(),
        doc = parser.parseFromString(htmlStr, 'text/html'),
        node = doc.getElementsByTagName('table'),

        table, attrs, i, nodeStyle, rows, rowsNum, currentRow, row,
        bogusRowAttr, bogusRowStyle, bogusCellAttr, bogusCellStyle, bogusTableAttr, bogusTableStyle;
    if (node.length === 0){
        return null;
    }
    node = node[0];

    // creating table
    table = new Table();

    // imposing table styles
    nodeStyle = node.getAttribute('style');
    table.style = new Style(nodeStyle);
    // imposing table attributes
    attrs = Helper.flatten(node.attributes);
    if (attrs.hasOwnProperty('style')){
        delete attrs.style;
    }
    table.attr = new Attributes(attrs);

    // the only child of the table is always tbody
    if (node.children.length !== 1){
        return table;
    }
    rows = node.children[0].children;
    rowsNum = rows.length;

    // if (isFramed){
    //     bogusRowStyle = node.querySelector('tr').getAttribute('style');
    //     bogusCellStyle = node.querySelector('tr td').getAttribute('style');
    //     bogusTableStyle = node.querySelector('tr td table').getAttribute('style');

    //     bogusRowAttr = Helper.flatten(node.querySelector('tr').attributes);
    //     if (bogusRowAttr.hasOwnProperty('style')){
    //         delete bogusRowAttr.style;
    //     }

    //     bogusCellAttr = Helper.flatten(node.querySelector('tr td').attributes);
    //     if (bogusCellAttr.hasOwnProperty('style')){
    //         delete bogusCellAttr.style;
    //     }

    //     bogusTableAttr = Helper.flatten(node.querySelector('tr td table').attributes);
    //     if (bogusTableAttr.hasOwnProperty('style')){
    //         delete bogusTableAttr.style;
    //     }
    //     table.bogusRowStyle   = new Style(bogusRowStyle);
    //     table.bogusRowAttr    = new Attributes(bogusRowAttr);
    //     table.bogusCellStyle  = new Style(bogusCellStyle);
    //     table.bogusCellAttr   = new Attributes(bogusCellAttr);
    //     table.bogusTableStyle = new Style(bogusTableStyle);
    //     table.bogusTableAttr  = new Attributes(bogusTableAttr);
    // }
    for (i = 0; i < rowsNum; i++){
        // if (isFramed){
        //     currentRow = rows[i].querySelector('td table tr');
        // } else {
            currentRow = rows[i];
        // }

        if(currentRow.tagName === "TR"){
            // console.log(child);
            row = currentRow.outerHTML.createRowFromHtml();
            table.appendRow(row);
        }
    }
    table.disentangle();
    return table;
};

/**
 * Transforms a list string into a List object. The argument listType is used to initialize the
 * property "name" of the returned instance. If it is not provided, that the node tag-name property is used.
 * It is supposed that the string to process is of the following form:
 * <ol ... > ... </ol> or <ul ... > ... </ul>.
 * Inside the tag, there might be other nodes. If they are recognized as a "supported" ones, the
 * corresponding functions will be called to transform them into objects.
 * @module  String
 * @param   {String}           listType
 * @class  StringHelper
 * @method  createUlFromHtml
 * @return  {Object}           List
 */
String.prototype.createListFromHtml = function(listType){
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
        output.style = new Style(style);
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

/**
 * Calls String::createListFromHtml('ul') on the target string.
 * @module  String
 * @class  StringHelper
 * @method  createUlFromHtml
 * @return  {Object} List
 */
String.prototype.createUlFromHtml = function(){
    return this.toString().createListFromHtml('ul');
};

/**
 * Calls String::createListFromHtml('ol') on the target string.
 * @module  String
 * @class  StringHelper
 * @method  createUlFromHtml
 * @return  {Object} List
 */
String.prototype.createOlFromHtml = function(){
    return this.toString().createListFromHtml('ol');
};

/**
 * Transforms a list item string into a ListItem object. It is supposed that the string to process is of the
 * following form: <li ... > ... </li>. Inside the tag, there might be other nodes. If they are recognized
 * as a "supported" ones, the corresponding functions will be called to transform them into objects.
 * @module  String
 * @class  StringHelper
 * @method  createListItemFromHtml
 * @return  {Object} ListItem
 */
String.prototype.createListItemFromHtml = function(){
    var htmlStr = this,
        parser = new DOMParser(),
        newParser = new DOMParser(),
        fullList = '<ul>' + htmlStr + '</ul>', // embedding the table inside 'ul' element.
        doc = parser.parseFromString(fullList, 'text/html'),
        node = doc.getElementsByTagName('li'),
        newDoc, listItem, attrs, i, nodeStyle, elem, elems, elemsNum, currentElem, id, nodeContent, nodeText, methodToCall, nodeName;
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
    listItem.style = new Style(nodeStyle);

    // imposing its attributes
    attrs = Helper.flatten(node.attributes);
    if (attrs.hasOwnProperty('style')){
        delete attrs.style;
    }
    listItem.attr = new Attributes(attrs);

    // create a fictious div containing the listItem and assign a unique id to it
    id = 'fakeDivId' + Math.floor((Math.random()*99)+1);
    while (doc.getElementById(id)){
        id += Math.floor((Math.random()*99)+1);
    }
    nodeText = '<div id="'+ id +'">' + node.innerHTML + '</div>';

    newDoc = newParser.parseFromString(nodeText, 'text/html');
    nodeContent = newDoc.getElementById(id);

    elems = nodeContent.childNodes;

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
                elem = String.prototype.hasOwnProperty(methodToCall) ? currentElem.outerHTML[methodToCall]() : currentElem.outerHTML;
                break;
            default:
                elem = currentElem.nodeValue;
        }
        listItem.appendElem(elem);
    }
    return listItem;
};

/**
 * Returns true, if tableHtml is an html code corresponding to a table each row of which
 * contains just one cell, and this cell in its turn contains only one table.
 * Returns false otherwise.
 * @module  String
 * @class  StringHelper
 * @method  isFramedTable
 * @return  {Boolean}
 */
// String.prototype.isFramedTable = function (){
//     var tableHtml = this,
//         parser = new DOMParser(),
//         doc = parser.parseFromString(tableHtml, 'text/html'),
//         node = doc.getElementsByTagName('table'),
//         isFramed = true,
//         tableChildren, tableChildrenLen, currentElem, elemChildren, nestedElem, nestedElemChildren, i;

//         // it would be very nice to use this approach, but doc.evaluate always returns "undefined"
//         // try{
//         //  var tmp = doc.evaluate('//*', doc, null, XPathResult.ANY_TYPE, tmp);
//         //  console.log('evaluate: ', tmp);
//         // } catch (ex){
//         //  console.log("Error! ", ex);
//         // }

//         if (node.length === 0){
//             return false;
//         }
//         node = node[0];

//         // parsing the table structure to decide whether this is a framed table or a regular one.
//         tableChildren = node.children[0].children;   // all rows of  the table
//         tableChildrenLen = tableChildren.length;
//         for (i = 0; i < tableChildrenLen; i++) {
//             currentElem = tableChildren[i];          // current row
//             elemChildren = currentElem.children;     // all cells inside the row
//             if (elemChildren.length !== 1 ){
//                 isFramed = false;
//                 break;
//             }
//             nestedElem = elemChildren[0];     // first cell inside the row
//             if (nestedElem.tagName !== 'TD'){
//                 isFramed = false;
//                 break;
//             }
//             nestedElemChildren = nestedElem.children;
//             if (nestedElemChildren.length !== 1 || nestedElemChildren[0].tagName !== 'TABLE'){
//                 isFramed = false;
//                 break;
//             }
//         }
//         return isFramed;
// };

/**
 * Creates an instance of Tag class and fills in its property "elements" with
 * the elements recognized inside the string. It is supposed that the string is of the
 * form <tag [tag-attributes] [style="..."]>....</tag>.
 * @module    String
 * @class  StringHelper
 * @method    createTagFromHtml
 * @return    {Content}
 */
String.prototype.createTagFromHtml = function(){
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
            output.style = new Style(style);
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

/*
 * Creates an instance of Content class and fills in its property "elements" with
 * the elements recognized inside the string.
 * @module    String
 * @class  StringHelper
 * @method    inflate
 * @return    {Content}
 */
String.prototype.inflate = function(){
    var str = this.toString(),
        parser = new DOMParser(),
        id = Helper.generateId(str, 'fakeId'),
        doc = parser.parseFromString('<div id="' + id + '">' + str + '</div>', 'text/html'),
        output = new Content(),
        node, children, childrenNum, i, child, childHtml, elem, methodName, methodExists;
    // generate a unique id for the overall document
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
    return output;
};