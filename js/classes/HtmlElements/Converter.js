/*jslint plusplus: true, white: true */
/*global Node, Dom, Properties, Tag, Helper, CKEDITOR, FACTORY, Unit, NEWSLETTER */

/**
 * Methods of this class convert one format in another.
 * @module 	    HtmlElements
 * @class  		Converter
 * @since       0.0.5
 * @author      A.Shcherbakov
 */

function Converter(){
	"use strict";
	if (!(this instanceof Converter)) {
		return new Converter();
	}



	/**
	 * Finds a method among all methods present in this class that is most simlar to `name`.
	 *
	 * It gets names of all methods in the class, transforms them in lower case, then looks up for
	 * lowered-case of `fname` among them. Corrresponding method name of the first occurrence is returned.
	 * @method         _findMostSimilarMethodName
	 * @param          {String}             name
	 * @return         {String|void}
	 */
	var _findMostSimilarMethodName = function(name){
		var allMethods = Object.getOwnPropertyNames(this),
			nameLower = name.toLowerCase(),
			len = allMethods.length, i;
		for (i = 0; i < len; i++){
			if (allMethods[i].toLowerCase() === nameLower){
				return allMethods[i];
			}
		}
	}.bind(this);


	/**
	 * Converts `content` in format `format`.
	 *
	 * In order to find appropriate method, argument `format` is prepended with string "convertTo"
	 * and then it attemps to find a method inside this class that is equal to string "convertTo..."
	 * (case insensitive). If such a method is found, then it gets executed and the result of its
	 * action is returned.
	 * @method         convertTo
	 * @param          {DOM.Node}           content
	 * @param          {String}             format
	 * @return         {DOM.Node}
	 */
	this.convertTo = function(content, format){
		if (typeof format ==='string'){
			var methodName = 'convertTo' + format,
				foundName = _findMostSimilarMethodName(methodName);
			if (foundName && foundName !== 'convertTo'){ // compare to this method name in order
														 // to avoid any self-call
				return this[foundName](content);
			}
		}
	};


	/**
	 * Converts `content` into fixed format. It means that all units of measure must be expressed in pixels.
	 *
	 * For the moment the action of this method is trivial.
	 * @method         convertToFixed
	 * @param          {DOM.Node}           content
	 * @return         {DOM.Node}
	 */
	this.convertToFixed = function(content){
		return content;
	};

	/**
	 * Converts `content` into fluid format. It means that all units of measure must be expressed in relative units (in %).
	 * @method         convertToFluid
	 * @param          {DOM.Node}           content
	 * @return         {DOM.Node}
	 */
	this.convertToFluid = function(content){

	}



}

