/*jslint plusplus: true, white: true */
/*global Properties */
/**
* This class is supposed to define attributes of html tags
* @module 	Properties
* @param    {String|Object}    obj       Attributes class variable will be instantiated using this input
* @class    Attributes
* @extends  Properties
*/
function Attributes(obj) {
	"use strict";
	if (!(this instanceof Attributes)) {
		return new Attributes(obj);
	}
	Properties.call(this, obj);

	/**
	 * Generates string representation of this object (as html attributes).
	 * It takes into consideration only key-valued pairs of
     * {{#crossLink "Properties/core:property"}}core{{/crossLink}} defined in
     * {{#crossLink "Properties"}}Property{{/crossLink}} class.
	 * {{#crossLink "Attributes/className:property"}}className{{/crosslink}}.
	 * @method     toString
	 * @return     {String}    a union of substrings; each substring is of this format: 'attribute="value"',
	 *                         between the substrings there is a separator ' ' (space).
	 * @example    class="example" id="tag"
	 */
	this.toString = function () {
        var output = [],
            core = this.getCore(),
            keys = Object.keys(core);
        keys.forEach(function(key){
            output.push(key.toString() + '="'  + core[key].toString() + '"');
        });
        return output.join(' ');
    };

    /**
     * The  name of the class.
     * @since    0.0.2
     * @property {String} className
     * @type     {String}
     */
    this.className = 'Attributes';


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
    	// console.log("load: attr = ", attr);
    	for (pos in attr){
    		if (attr.hasOwnProperty(pos)){
    			seed = {};
    			attrName = attr[pos].name;
    			if (attrName && attrName !== 'style'){
    				if (typeof this[attrName] !== 'function') {
    					attrValue = attr[pos].value;
    					if(attrValue){
    						seed[attrName] = attrValue;
    					}
                        // console.log('load: seed = ', seed);
    					this.appendProperty(seed);
    				} else {
    					return false;
    				}
    			}
    		}
    	}
    	return true;
    };

    /**
     * Applies the attributes on the argument. The argument is supposed to be an instance of
     * [DOM.Element](https://developer.mozilla.org/en-US/docs/Web/API/element). In fact,
     * it is used only [setAttribute()](https://developer.mozilla.org/en-US/docs/Web/API/Element.setAttribute)
     * method of that instance.
     * @method  decorateElement
     * @param  {Object}    elem
     * @return {void}
     */
    this.decorateElement = function(elem){
    	if (typeof elem.setAttribute === 'function'){
			var summary = this.summary(),
				keys = Object.keys(summary);
			keys.forEach(function(key){
				elem.setAttribute(key, summary[key]);
			});
    	}
    };
}
Attributes.prototype = Object.create(Properties.prototype);
