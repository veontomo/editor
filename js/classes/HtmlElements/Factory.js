/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global Node, Mapper */

/**
 * This class is to be used to create different objects. What type of object is to be created
 * is decided based on functionality of {{#crossLink "Mapper"}}Mapper{{/crossLink}} class,
 * an instance of which might be passed as an argument.
 * instance.
 * @module 	           HtmlElements
 * @class  		       Factory
 * @constructor
 * @param              {Mapper}            map          an instance of Mapper class
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
	 * An instance of {{#crossLink "Mapper"}}Mapper{{/crossLink}} class.
	 * @property       _mapping
	 * @private
	 * @type           {Mapper}
	 */
	var _mapping = (map instanceof Mapper) ? map : new Mapper();

	/**
	 * {{#crossLink "Factory/_mapping:property"}}Mapper{{/crossLink}} getter.
	 * @method         getMapping
	 * @return         {Mapper}
	 */
	this.getMapping = function(){
		return _mapping;
	};

	/**
	 * {{#crossLink "Factory/_mapping:property"}}Mapper{{/crossLink}} setter. Returns `true`
	 * if the argument is an instance of {{#crossLink "Mapper"}}Mapper{{/crossLink}} class and
	 * `false` otherwise.
	 * @method         setMapping
	 * @return         {Boolean}
	 */
	this.setMapping = function(map){
		var isMap = map instanceof Mapper;
		if (isMap){
			_mapping = map;
		}
		return isMap;
	};

	/**
	 * Creates a class instance corresponding to the argument. The decision is taken
	 * based on method {{#crossLink "Mapper/findTargetFor:method"}}findTargetFor(){{/crossLink}}
	 * of {{#crossLink "Factory/_mapping:property"}}_mapping{{/crossLink}} property.
	 * @method         stub
	 * @param          {Any}                obj
	 * @return         {Object|Null}
	 */
	this.stub = function(obj){
		var m = this.getMapping();
		if (m){
			var TargetClass = m.findTargetFor(obj);
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
	};

}