/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, Properties */
/**
* This class defines inline styles of html tags
* @module   Properties
* @param    {String|Object}      obj      Style class variable will be instantiated using this input
* @class    Styles
* @extends  Properties
*/
function Styles(obj) {
	'use strict';
	if (!(this instanceof Styles)) {
		return new Styles(obj);
	}
	Properties.call(this, obj);

	/**
	 * Generates string representation of this object (as html inline style).
	 * It takse into consideration only string- and number-valued properties. The rest is ignored.
     * If attribite value is a number, the measurement unit will be appended.
     * @method  toString
     * @param   {String|null}   unit     mesurement unit to be added to the numerical attribute values. By default, it is set to 'px'.
	 * @return  {String}        String   union of substrings; each substring is of this format: 'attribute: value;',
     *                                   between the substrings there is a separator ' '.
     * @example "padding: 0px; margin: 10px; color: #ababab"
	 */
    this.toString = function (unit) {
        var val, attr, styles = [], core = this.getCore();
        unit = unit || 'px';
        for (attr in core) {
            if (core.hasOwnProperty(attr)) {
                // avoid adding method to the output
                val = core[attr];
                switch (typeof val) {
                case 'string':
                    if(attr !== 'className'){
                        styles.push(attr + ': ' + val.trim());
                    }
                    break;
                case 'number':
                    styles.push(attr + ': ' + String(val) + unit);
                    break;
                }
            }
        }
        return styles.join('; ');
    };

    /**
     * The  name of the class.
     * @since    0.0.2
     * @Properties {String} className
     * @type     {String}
     */
    this.className = 'Style';

    /**
     * Appends style. Alias for the parent method {{#crossLink "Properties/appendProperty:method"}}Properties::appendProperty(){{/crossLink}}
     * @method  appendStyle
     * @param   {Object|null}   stl       it will be passed to the parent method
     * @return  {void}
     */
    this.appendStyle = function(stl){
        // var rnd = parseInt(Math.random()*10000 , 10);
        // console.info(rnd, 'Style::appendStyle is called with ', stl);
        // console.info(rnd, 'style core is = ', this.getCore());
    	this.appendProperty(stl);
        // console.info(rnd, 'Style::appendStyle is finished. The style core is now = ', this.getCore());
    };


    /**
     * Imposes the width, min-width and max-width.
     * @method  setWidth
     * @param   {any}     w    value of width.
     * @return  {void}
     */
    this.setWidth = function (w) {
        this.setProperty('width', w);
        this.setProperty('min-width', w);
        this.setProperty('max-width', w);
    };

    /**
     * Returns object {width: ..., color: ..., style: ...} describing border. If the Style has no Properties
     * 'border-style', then 'none' will be used. If the Style has no 'border-width', then zero will be used.
     * If the Style has no Properties 'border-color', then it will not be set.
     * @method  getBorderInfo
     * @return {Object}              object of the form {'width': ..., 'color': ..., 'style': ...}
     */
    this.getBorderInfo = function(){
        var output = {};
        output.width = this.getProperty('border-width') || 0;
        output.style = this.getProperty('border-style') || 'none';
        if (this.hasProperty('border-color')){
            output.color = this.getProperty('border-color');
        }
        return output;

    };

    /**
     * Loads style Properties from the argument that is supposed to be either of type
     * [NamedNodeMap](http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core.html#ID-1780488922)
     * (or, at least, respond to a `getNamedItem()` method) or a string. If not of these types, `false` is returned.
     * In case the argument is a [NamedNodeMap](http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core.html#ID-1780488922)
     * instance, its `style` item is picked up and transformed into a string.
     * @method  load
     * @param  {String|NamedNodeMap}       attr           instance of NamedNodeMap or a
     * @return {Boolean}                                  true, if the properties are loaded, false otherwise
     */
    this.load = function(attr){
        // var rnd = parseInt(Math.random()*1000, 10);
        // console.info(rnd, 'Style::load is called with ', attr);
        var seed, seedObj;
        if (attr !== undefined){
            if (typeof attr === 'string'){
                seed = attr;
            } else if (typeof attr.getNamedItem === 'function') {
                seedObj =  attr.getNamedItem('style');
                seed = seedObj ? seedObj.value : '';
            } else {
                // console.info(rnd, 'Style::load is returning false');
                return false;
            }
            // console.info(rnd, 'Style::load is calling Style::appendStyle with ', seed);
            this.appendStyle(seed);
        }
        // console.info(rnd, 'Style::load: value of style before returning true: ', this.toString());
        // console.info(rnd, 'Style::load is returning true');
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
    this.decorateElement = function(el){
        if (typeof el.setAttribute === 'function'){
            var str = this.toString();
            el.setAttribute('style', str);
        }
    };
}
Styles.prototype = Object.create(Properties.prototype);
