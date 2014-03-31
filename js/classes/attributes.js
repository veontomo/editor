/*jslint plusplus: true, white: true */
/*global Property */
/**
* This class is supposed to define attributes of html tags
* @module 	Property
* @param    {String|Object}    obj       Attributes class variable will be instantiated using this input
* @class    Attributes
* @extends  Property
*/
function Attributes(obj) {
	"use strict";
	if (!(this instanceof Attributes)) {
		return new Attributes(obj);
	}
	Property.call(this, obj);

	/**
	 * Generates string representation of this object (as html attributes).
	 * It takse into consideration only strings and numbers. The rest is ignored.
	 * @method     toString
	 * @return     {String}    a union of substrings; each substring is of this format: 'attribute="value"',
	 *                         between the substrings there is a separator ' ' (space).
	 * @example    class="example" id="tag"
	 */
	this.toString = function () {
        var val, valType, attr, output = [];
        for (attr in this) {
            if (this.hasOwnProperty(attr)) {
                val = this[attr];
                valType = typeof val;
                // avoid adding method to the output
                if (valType === 'string' || valType === 'number'){
                    output.push(attr + '="' + String(val) + '"');
                }
            }
        }
        return output.join(' ');
    };

    /**
     * Loads attributes from the argument that is supposed to be of a type
     * [NamedNodeMap](http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core.html#ID-1780488922).
     * Nevertheless, it is sufficient that `attr` be a collection of objects with `name` and `value` properties.
     * If among the attributes there is node with name "style", it gets ignored. If it is attempted to override
     * a method and not a property,  then `false` is returned.
     * @method    load
     * @param     {NamedNodeMap}       attr           instance of NamedNodeMap
     * @return    {Boolean}                           true, if the properties are loaded, false otherwise
     */
    this.load = function(attr){
    	var pos, attrName, attrValue, seed;
    	// console.log(attr);
    	for (pos in attr){
    		if (attr.hasOwnProperty(pos)){
    			seed = {};
    			attrName = attr[pos].name.trim();
    			attrValue = attr[pos].value.trim();
    			if (attrName !== 'style'){
    				if (typeof this[attrName] !== 'function') {
    					seed[attrName] = attrValue;
    					this.appendProperty(seed);
    				} else {
    					return false;
    				}
    			}
    		}
    	}
    	return true;
    };
}
Attributes.prototype = Object.create(Property.prototype);

/**
* Table-specific attributes.
* @module 	Property
* @extends Attributes
* @class  TableAttributes
*/
function TableAttributes(attr){
	"use strict";
	if (!(this instanceof TableAttributes)) {
		return new TableAttributes(attr);
	}
	Attributes.call(this, attr);
	/**
	 * Cellpadding attribute of the table. It is supposed that measurement unit is "px".
	 * @property 	{Number} 	cellpadding
	 * @default  	0
	 */
	this.cellpadding = 0;
	/**
	 * Cellspacing attribute of the table. It is supposed that measurement unit is "px".
	 * @property {Number} cellspacing
	 * @default  0
	 */
	this.cellspacing = 0;
}
TableAttributes.prototype = Object.create(Attributes.prototype);


/**
* Table-specific attributes.
* @module 	Property
* @extends Attributes
* @class  LinkAttributes
*/
function LinkAttributes(attr){
	"use strict";
	if (!(this instanceof LinkAttributes)) {
		return new LinkAttributes(attr);
	}
	Attributes.call(this, attr);
	/**
	 * The URL of the link.
	 * @property 	{String} 	href
	 * @default  	(empty string)
	 */
	this.href = '';


	/**
	 * Href getter.
	 * @method  getHref
	 * @return  {String}
	 */
	this.getHref =  function(){
		return this.href;
	};

	/**
	 * Href setter. Native javascript function `encodeURI()` will be applied to the argument.
	 * @method  setHref
	 * @param   {String}         url               `encodeURI()` is to be applied when assigning to this.url
	 * @return  {String}
	 */
	this.setHref =  function(url){
		this.href = encodeURI(url);
	};


}
LinkAttributes.prototype = Object.create(Attributes.prototype);
