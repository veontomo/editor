/*jslint plusplus: true, white: true */
/*global Mapper*/

/**
 * Methods of this class convert one format in another.
 * @module 	    HtmlElements
 * @class  		Converter
 * @since       0.0.5
 * @author      A.Shcherbakov
 */

function Converter(map){
	"use strict";
	if (!(this instanceof Converter)) {
		return new Converter(map);
	}

	/**
	 * Dispatcher that decides what converter should be used.
	 * @property       {FormatMapper}       _mapper
	 * @private
	 */
	var _mapper = (map instanceof Mapper) ? map : new Mapper();


	/**
	 * {{#crossLink "Converter/_mapper:property"}}_mapper{{/crossLink}} getter.
	 * @method         getMapper
	 * @return         {Mapper}
	 */
	this.getMapper = function(){
		return _mapper;
	};


	/**
	 * {{#crossLink "Converter/_mapper:property"}}_mapper{{/crossLink}} setter.
	 * @method         getMapper
	 * @param          {Mapper}
	 */
	this.setMapper = function(m){
		if (m instanceof Mapper){
			_mapper = m;
		}
	};



	/**
	 * Among all methods present in this class, finds one which name is equal to value of `name` (case insensitive).
	 *
	 * It gets names of all methods in the class, transforms them in lower case, then looks up for
	 * lowered-case of `name` among them. Corrresponding method name of the first occurrence is returned.
	 * @method         _findMostSimilarMethodName
	 * @private
	 * @param          {String}             name
	 * @return         {String|void}
	 */
	// var _findMostSimilarMethodName = function(name){
	// 	var allMethods = Object.getOwnPropertyNames(this),
	// 		nameLower = name.toLowerCase(),
	// 		len = allMethods.length, i;
	// 	for (i = 0; i < len; i++){
	// 		if (allMethods[i].toLowerCase() === nameLower){
	// 			return allMethods[i];
	// 		}
	// 	}
	// }.bind(this);


	/**
	 * Converts `content` into format `format`.
	 *
	 * It makes use of functionality of {{#crossLink "Converter/_mapper:property"}}_mapper{{/crossLink}}
	 * which is an instance of {{#crossLink "Mapper"}}Mapper{{/crossLink}} class.
	 * @method         convertTo
	 * @param          {DOM.Node}           content
	 * @param          {String}             format
	 * @return         {DOM.Node}
	 */
	this.convertTo = function(content, format){
		var m = this.getMapper(),
			TargetConverterClass = m.findTargetFor(format);
			console.log('Converter mapper found the target: ', TargetConverterClass);
		if (TargetConverterClass){
			var c = new TargetConverterClass();
			return c.convert(content);
		}
	};






}

