/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global Node */

/**
 * This class is to be used to create different objects. What type of object is to be created
 * is decided based on functionality of {{#crossLink "TagMapper"}}TagMapper{{/crossLink}} class,
 * an instance of which might be passed as an argument.
 * instance.
 * @module 	           HtmlElements
 * @class  		       Factory
 * @constructor
 * @param              {TagMapper}            mapping          an instance of TagMapper class
 * @since              0.0.2
 * @author             A.Shcherbakov
 *
 */
function Factory(map){
	"use strict";
	if (!(this instanceof Factory)) {
		return new Factory(map);
	}

	/**
	 * An instance of {{#crossLink "TagMapper"}}TagMapper{{/crossLink}} class.
	 * @property       mapping
	 * @private
	 * @type           {TagMapper}
	 */
	var mapping = (map instanceof TagMapper) ? map : new TagMapper();

	/**
	 * {{#crossLink "Factory/mapping:property"}}TagMapper{{/crossLink}} getter.
	 * @method         getMapping
	 * @return         {TagMapper}
	 */
	this.getMapping = function(){
		return mapping;
	};

	/**
	 * {{#crossLink "Factory/mapping:property"}}TagMapper{{/crossLink}} setter. Returns `true`
	 * if the argument is an instance of {{#crossLink "TagMapper"}}TagMapper{{/crossLink}} class and
	 * `false` otherwise.
	 * @method         setMapping
	 * @return         {Boolean}
	 */
	this.setMapping = function(map){
		var isMap = map instanceof TagMapper;
		if (isMap){
			mapping = map;
		}
		return isMap;
	}

	/**
	 * Creates a class instance corresponding to the argument. The decision is to be taken
	 * based on the {{#crossLink "TagMapper/findTargetFor:method"}}findTargetFor(){{/crossLink}}
	 * of {{#crossLink "Factory/mapping:method"}}mapping{{/crossLink}} property.
	 * @method         stub
	 * @param          {Any}                obj
	 * @return         {Object|Null}
	 */
	this.stub = function(obj){
		var map = this.getMapping();
		if (map){
			var TargetClass = map.findTargetFor(obj);
			if (typeof TargetClass === 'function'){
				return new TargetClass();
			}
		}
		return null;
	};

	/**
	 * Creates a copy of the argument. It first calls {{#crossLink "Factory/stub:method"}}stub{{/crossLink}} and if its
	 * result responds to method "load", calls it.
	 * @method         mimic
	 * @param          {Any}                obj
	 * @return         {Object}
	 */
	this.mimic = function(obj){
		// var rnd = parseInt(Math.random()*1000);
		// console.info(rnd, 'Factory::mimic argument = ', obj);
		var stub = this.stub(obj);
		if (stub && typeof stub.load === 'function'){
			stub.load(obj);
		}
		// console.info(rnd, 'Factory::mimic argument = ', obj);
		return stub;

	}

}