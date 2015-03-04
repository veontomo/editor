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
	 * Array of available classes.
	 *
	 * Each array element is an object constructor which is supposed to be used with operator "new".
	 * @property   {Array}         _availableClasses
	 * @type       {Array}
	 * @since      0.2.1
	 * @private
	 */
	var _availableClasses;


	/**
	 * {{#crossLink "Factory/_availableClasses:property"}}_availableClasses{{/crossLink}} setter.
	 * @method         setAvailableClasses
	 * @param          {array}         arr     array of classes
	 * @since          0.2.1
	 */
	this.setAvailableClasses = function(arr){
		_availableClasses = arr;
	};


	/**
	 * {{#crossLink "Factory/_availableClasses:property"}}_availableClasses{{/crossLink}} getter.
	 * @method         getAvailableClasses
	 * @return         {Array}
	 * @since          0.2.1
	 */
	this.getAvailableClasses = function(){
		return _availableClasses;
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
	 * result responds to method "loadFromElement", calls it.
	 * @method         mimic
	 * @param          {Any}                obj
	 * @return         {Object}
	 */
	this.mimic = function(obj){
		// var rnd = parseInt(Math.random()*1000);
		// console.info(rnd, 'Factory::mimic argument = ', obj);
		var stub = this.stub(obj);
		if (stub && typeof stub.loadFromElement === 'function'){
			stub.loadFromElement(obj);
		}
		// console.info(rnd, 'Factory::mimic argument = ', obj);
		return stub;
	};

	/**
	 * Creates an instance of {{#crossLink "Tag"}}Tag{{/crossLink}} class (or of its sublass) whose tag name is
	 * equal to `tagName` variable.
	 * @method         createByTagName
	 * @param          {String}     tagName
	 * @return         {Tag}                 instance of {{#crossLink "Tag"}}Tag{{/crossLink}} class or of its sublass
	 * @since          0.1.0
	 */
	this.createByTagName = function(tagName){
		console.log(this.getAvailableClasses());
		var mapper = this.getMapping(),
			Builder,
			element;
		if (!mapper){
			return;
		}
		try {
			Builder = mapper.findTargetFor(tagName);
			console.log(tagName, Builder);
			element = new Builder();
		} catch(e){
			console.log(e.name + ' occurred when creating element by tag name: ' + e.message);
			return;
		}
		return element;
	};

	/**
	 * Returns a class that corresponds to string `name`.
	 *
	 * The method calls a method given by string `methodName` of each element of the available classes, passes
	 * argument `name` to it and returns the first class for which that method returns `true`.
	 *
	 * @method         findByName
	 * @param          {String}        name
	 * @param          {String}        methodName
	 * @return         {Object|null}
	 * @since          0.2.1
	 */
	this.findByName = function(name, methodName){
		var classes = this.getAvailableClasses(),
			len, i, callback;
		if (!Array.isArray(classes)){
			return;
		}
		len = classes.length;
		for (i = 0; i < len; i++){
			callback = classes[i][methodName];
			if (typeof callback === 'function' && callback(name)){
				return classes[i];
			}
		}
	};


	/**
	 * Creates an object whose properties are populated with data stored in `template`.
	 *
	 * Inner structure of `template` is used to create child elements of resulting object.
	 * @method         createFromTemplate
	 * @property       {Object}        template
	 * @return         {Object}
	 * @since          0.2.1
	 */
	this.createFromTemplate = function(template){
		/// !!! stub
		console.log(template.name)
		return this.createByName(template.name, );
	};

}