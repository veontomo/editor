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
	 * @default    [] (empty array)
	 * @private
	 */
	var _availableClasses = [];

	/**
	 * A default class.
	 *
	 * A class that the Factory might use if none of the {{#crossLink "Factory/_availableClasses:property"}}available
	 * classes{{/crossLink}} does not suit a purpose.
	 * @property   {Function}         _defaultClass
	 * @type       {Function}
	 * @since      0.2.1
	 * @private
	 */
	var _defaultClass;


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
	 * {{#crossLink "Factory/_defaultClass:property"}}_defaultClass{{/crossLink}} setter.
	 * @method         setDefaultClass
	 * @param          {Function}         fun
	 * @since          0.2.1
	 */
	this.setDefaultClass = function(fun){
		_defaultClass = fun;
	};


	/**
	 * {{#crossLink "Factory/_availableClasses:property"}}_availableClasses{{/crossLink}} getter.
	 * @method         getDefaultClass
	 * @return         {Function}
	 * @since          0.2.1
	 */
	this.getDefaultClass = function(){
		return _defaultClass;
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
	 * Returns a class that for which function given by the argument returns `true`.
	 *
	 * The method applies function `crit` to each element of array of the available classes until
	 * it evaluates to `true`. Once it happens, then that class is returned.
	 *
	 * @method         findClass
	 * @param          {Function}        crit
	 * @return         {Object|null}
	 * @since          0.2.1
	 */
	this.findClass = function(crit){
		var classes = this.getAvailableClasses(),
			len, i, output;
		len = classes.length;
		for (i = 0; i < len; i++){
			try {
				output = crit(classes[i]);
			} catch (e){
				console.log(e.name + ' occurred when applying the criteria to the class: ' + e.message);
				output = false;
			}
			if (output){
				return classes[i];
			}
		}
	};


	/**
	 * Finds a class whose name is equal to the argument.
	 *
	 * The method uses method {{#crossLink "Factory/findClass:method"}}findClass{{/crossLink}} with
	 * properly concocted criteria.
	 * @method         findByName
	 * @param          {String}        name
	 * @return         {Function|null}
	 * @since          0.2.1
	 */
	this.findByName = function(name){
		if (typeof name !== 'string'){
			return;
		}
		var crit = function(c){
			var obj = new c();
			return typeof obj.getName === 'function' && obj.getName().toLowerCase() === name;
		};
		return this.findClass(crit);
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
		if (typeof template.name !== 'string'){
			return undefined;
		}
		var TargetClass = this.findByName(template.name),
			element;
		if (TargetClass){
			element = new TargetClass();
		} else {
			element = new (this.getDefaultClass())();
			element.setTag(template.name);
		}
		console.log('element: ', element);
		if (!element){
			return undefined;
		}
		if (typeof element.loadRootFromTemplate === 'function'){
			element.loadRootFromTemplate(template);
		}
		var childTemplates = template.children,
			len, child, i;
		if (!Array.isArray(childTemplates)){
			return element;
		}
		len = childTemplates.length;
		for (i = 0; i < len; i++){
			child = this.createFromTemplate(childTemplates[i]);
			if (child && (typeof element.appendElem === 'function')){
				element.appendElem(child);
			}
		}
		return element;
	};

}