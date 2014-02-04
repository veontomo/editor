/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global DOMParser, Node, ListStyle, Attributes, Content, ListItemStyle, flatten, Style, onlyFirstLetterUpperCase */

/**
 * This class is used to represent a list item.
 * @module 	    HtmlElements
 * @class  		ListItem
 */
function ListItem() {
	"use strict";
	if (!(this instanceof ListItem)) {
		return new ListItem();
	}

	/**
	 * List item attributes
	 * @property {Attributes}          attr
	 * @type     {Attributes}
	 * @default  Attributes()
	 */
	this.attr = new Attributes();

	/**
	 * List item styles
	 * @property {ListItemStyle}       style
	 * @type     {ListItemStyle}
	 * @default ListItemStyle()
	 */
	this.style = new ListItemStyle();

	/**
	 * Content of the list item.
	 * @property {Content}             content
	 * @type     {Content}
	 * @default  Content()
	 */
	this.content = new Content();

	/**
	 * Appends the element to the content of the list item.
	 * @method appendElem
	 * @param  {any}     elem
	 * @return {void}
	 */
	this.appendElem = function(elem){
		this.content.appendElem(elem);
	};

	/**
	 * Returns the number of elements inside its content. Delegates to Content::length().
	 * @method   length
	 * @return   {Number}
	 */
	this.length = function(){
		return this.content.length();
	};

	/**
	 * Gives html representation of the instance.
	 * @method toHtml
	 * @return {String}                html representation of an instance of this class.
	 */
	this.toHtml = function(){
		var tag = 'li',
			style = this.style.toString().sandwichWith('style="', '"'),
			attr = this.attr.toString(),
			html = '<' + [tag, attr, style].concatDropSpaces() + '>' + this.content.toHtml() + '</' + tag + '>';
		return html;
	};
}

/**
 * Transforms a list item string into a ListItem object. It is supposed that the string to process is of the
 * following form: <li ... > ... </li>. Inside the tag, there might be other nodes. If they are recognized
 * as a "supported" ones, the corresponding functions will be called to transform them into objects.
 * @module  HtmlElements
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
			newDoc,	listItem, attrs, i, nodeStyle, elem, elems, elemsNum, currentElem, id, nodeContent, nodeText, methodToCall, nodeName;
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
		attrs = flatten(node.attributes);
		if (attrs.hasOwnProperty('style')){
			delete attrs.style;
		}
		listItem.attr = new Attributes(attrs);

		// create a fictious div containing the listItem and assign a unique id to it
		id = "fakeDivId" + Math.floor((Math.random()*99)+1);
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
					methodToCall = 'create' + onlyFirstLetterUpperCase(nodeName) + 'FromHtml';
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
 * This class is used to represent ordered and unordered lists.
 * @module 	    HtmlElements
 * @class  		List
 */
function List() {
	"use strict";
	if (!(this instanceof List)) {
		return new List();
	}
	/**
	 * Type of the list: 'ul' for unordered  and 'ol' for ordered one.
	 * @property    {String}   type
	 * @default     'ul'
	 */
	this.type = 'ul';

	/**
	 * Retrieves type of the list.
	 * @method    getType
	 * @return    {String}
	 */
	this.getType = function(){
		return this.type;
	};

	/**
	 * Attributes corresponding to the list as a whole object.
	 * @property    {Attribute} 	attr
	 */
	this.attr = new Attributes();


	/**
	 * Styles corresponding to the list as a whole object.
	 * @property    {ListStyle} 	style
	 */
	this.style = new ListStyle();

	/**
	 * Items of the list.
	 * @property    {Array} items
	 * @default     []
	 */
	this.items = [];

	/**
	 * Gets the number of the list items
	 * @method      itemNum
	 * @return      {Number}   an integer number
	 */
	this.itemNum = function(){
		return this.items.length;
	};

	/**
	 * Appends an object to the list items. The object must be a ListItem instance.
	 * If not, an error is thrown.
	 * @method  appendItem
	 * @param   {ListItem}    item    an instance of ListItem
	 * @return  {void}
	 */
	this.appendItem = function(item){
		if (item instanceof ListItem){
			this.items.push(item);
		} else {
			throw new Error('The argument is not a ListItem instance!');
		}
	};
	/**
	 * Inserts the item at the given position. If the list contains N items, then allowed index for the
	 * item to be inserted at is the range [0, N]. Zero index corresponds to insertion at the beginning of the list,
	 * N - to the end of the list, that is to appending (delegates to List::appendItem). If the index is out
	 * of this range, an error is thrown. If the item to be inserted is not an instance of ListItem,
	 * an error is thrown.
	 * @method    isertItemAt
	 * @param     {Number}      pos     index of the position of there to insert the item
	 * @param     {ListItem}    item    item to insert
	 * @return    {void}
	 */
	this.insertItemAt = function(pos, item){
		var posInt = parseInt(pos, 10),
			itemNum = this.itemNum();
		if (posInt !== pos || pos < 0 || pos > itemNum){
			throw new Error('Wrong index to insert the item at!');
		}
		if (pos === itemNum){
			this.appendItem(item);
		} else {
			if (item instanceof ListItem){
				this.items.splice(pos, 0, item);
			} else {
				throw new Error('The item to insert is not a ListItem instance!');
			}
		}
	};

	/**
	 * Gives an html representation of the list. If the list has no items, empty string is returned.
	 * @method toHtml
	 * @return {String}
	 */
	this.toHtml = function(){
		var tag, style, attr, i,
			len = this.itemNum(),
			html = '';
		if (len > 0){
			tag = this.getType();
			style = this.style.toString().sandwichWith('style="', '"');
			attr = this.attr.toString();
			html = '<' + [tag, attr, style].concatDropSpaces() + '>';
			for (i = 0; i < len; i++){
				html += this.items[i].toHtml();
			}
			html += '</' + tag + '>';
		}
		return html;
	};
}



