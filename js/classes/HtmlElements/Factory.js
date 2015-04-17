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
function Factory(){
	"use strict";
	if (!(this instanceof Factory)) {
		return new Factory();
	}



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
	 * A map form class name to class constructor.
	 *
	 * This is an object with keys-values pairs where keys are names of available classes and values are
	 * corresponding classes.
	 * @property       {Object}        _availableClassesByClassName
	 * @type           {Object}
	 * @since          0.2.6
	 * @private
	 */
	var _availableClassesByClassName = {};


	/**
	 * A map form tag name to class constructor.
	 *
	 * Each class is supposed to have a string-valued tag that becomes key of this map.
	 * @property       {Object}        _availableClassesByTagName
	 * @type           {Object}
	 * @since          0.2.6
	 * @private
	 */
	var _availableClassesByTagName = {};

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
		arr.forEach(function(c){
			if (typeof c !== 'function'){
				return;
			}
			this.registerClass(c);
		}.bind(this));
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
	 * {{#crossLink "Factory/_defaultClass:property"}}_defaultClass{{/crossLink}} getter.
	 * @method         getDefaultClass
	 * @return         {Function}
	 * @since          0.2.1
	 */
	this.getDefaultClass = function(){
		return _defaultClass;
	};

	/**
	 * Registers class and indexes it.
	 *
	 * The method updates fields
	 * {{#crossLink "Factory/_availableClassesByClassName:property"}}_availableClassesByClassName{{/crossLink}},
	 * {{#crossLink "Factory/_availableClassesByTagName:property"}}_availableClassesByTagName{{/crossLink}} and
	 * {{#crossLink "Factory/_availableClasses:property"}}_availableClasses{{/crossLink}}.
	 * @method         registerClass
	 * @param          {Function}      C       instantiable function
	 * @return         {void}
	 * @since          0.2.6
	 */
	this.registerClass = function(C){
		var probe;
		try {
			probe = new C();
		} catch (e){
			console.log(e.name + ' occurred when instatiating a class: ' + e.message);
		}
		if (!probe){
			return;
		}

		_availableClasses.push(C);

		try {
			var tagName = probe.getTag();
			if (typeof tagName === 'string'){
				_availableClassesByTagName[tagName.toLowerCase()] = C;
			}
		} catch (e){
			console.log(e.name + ' occurred when retrieveing class\'s tag name: ' + e.message);
		}
		try {
			var className = probe.getName();
			if (typeof className === 'string'){
				_availableClassesByClassName[className] = C;
			}
		} catch (e){
			console.log(e.name + ' occurred when retrieveing the name of the class\'s: ' + e.message);
		}

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
		var Target = this.findClassFor(obj);
		if (!Target){
			Target = this.getDefaultClass();
		}
		if (Target){
			return new Target();
		}
	};

	/**
	 * Finds class that can represent `obj`.
	 *
	 * The method parses all available classes and feeds `obj` to characteristic function (obviuosly, it should be defiend) of
	 * each of them. The first class which characteristic function evaluated to true on `obj` is returned.
	 *
	 * If no characteristic function evaluates to true on `obj`, then nothing is returned.
	 * @method findTargetFor
	 * @param  {Any} obj
	 * @return {Function}
	 * @since  0.2.6
	 */
	this.findClassFor = function(obj){
		var i,
			isMine,
			len = _availableClasses.length;
		for (i = 0; i < len; i++){
			isMine = _availableClasses[i].prototype.characteristicFunction(obj);
			if (isMine === true){
				return _availableClasses[i];
			}
		}
	};

	/**
	 * Mimics given object based on available classes.
	 * @method         mimic
	 * @param          {Any}                obj
	 * @return         {Object}
	 * @since          0.2.6
	 */
	this.mimic = function(obj){
		var stub = this.stub(obj);
		if (!stub){
			return;
		}
		if (typeof stub.appendProperties  === 'function'){
			stub.appendProperties(obj.attributes);
		}

		if (typeof stub.appendElem === 'function'){
			/// if here, it means that "stub" is a Tag instance
			/// therefore, one should mimic and append children
			var children = obj.childNodes,
				len, i, childMimic;
			if (children){
				len = children.length;
				for (i = 0; i < len; i++){
					childMimic = this.mimic(children.item(i));
					if (childMimic){
						stub.appendElem(childMimic);
					}
				}
			}
		} else if (typeof stub.setContent === 'function'){
			/// if here, it means that "stub" is a PlainText instance
			/// therefore, set stub's text content
			if (obj.textContent){
				stub.setContent(obj.textContent);
			}
		}
		return stub;
	};

	/**
	 * Creates an instance of {{#crossLink "Tag"}}Tag{{/crossLink}} class (or of its sublass) whose tag name is
	 * equal to `tagName` variable.
	 * @method         createByTagName
	 * @param          {String}     tagName
	 * @return         {Tag}                 instance of {{#crossLink "Tag"}}Tag{{/crossLink}} class or of its sublass
	 * @since          0.1.0
	 * @deprecated     in favour of findClassByName and produceInstanceOf
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
	 * @return         {Function|null}
	 * @since          0.2.1
	 */
	this.findClass = function(crit){
		var classes = this.getAvailableClasses(),
			len, i, output;
		len = classes.length;
		for (i = 0; i < len; i++){
			try {
				output = (crit(classes[i]) === true);
			} catch (e){
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
	 * @method         findClassByName
	 * @param          {String}        name
	 * @return         {Function|null}
	 * @since          0.2.1
	 */
	this.findClassByName = function(name){
		if (typeof name !== 'string'){
			return;
		}
		if (_availableClassesByClassName.hasOwnProperty(name)){
			return _availableClassesByClassName[name];
		}
	};

	/**
	 * Finds a class that is supposed to represent an html element with tag `tagName`.
	 *
	 * The method uses method {{#crossLink "Factory/findClass:method"}}findClass{{/crossLink}} with
	 * properly concocted criteria.
	 * @method         findClassByTag
	 * @param          {String}        tagName
	 * @return         {Function|null}
	 * @since          0.2.6
	 */
	this.findClassByTag = function(tagName){
		if (typeof tagName !== 'string'){
			return;
		}
		var canonicalForm = tagName.toLowerCase();
		if (_availableClassesByTagName.hasOwnProperty(canonicalForm)){
			return _availableClassesByTagName[canonicalForm];
		}
	};


	/**
	 * Returns an instance of requested class.
	 *
	 * If the argument is not a class, then nothing is returned.
	 * @method         produceInstanceOf
	 * @param          {Function}      c
	 * @return         {Object}
	 * @since          0.2.1
	 */
	this.produceInstanceOf = function(c){
		if (typeof c === 'function'){
			try {
				return new c();
			} catch(e){
				console.log(e.name + ' occurred when producing a class instance: ' + e.message);
			}
		}
	};


	/**
	 * Creates an object whose properties are populated with data stored in `template`.
	 *
	 * Inner structure of `template` is used to create child elements of resulting object.
	 * @method         createFromTemplate
	 * @param          {Object}        template
	 * @return         {Object}
	 * @since          0.2.1
	 */
	this.createFromTemplate = function(template){
		if (typeof template.name !== 'string'){
			return undefined;
		}
		var TargetClass = this.findClassByTag(template.name),
			element;
		if (TargetClass){
			element = this.produceInstanceOf(TargetClass);
		} else {
			element = this.produceInstanceOf(this.getDefaultClass());
			element.setTag(template.name);
		}
		if (!element){
			return undefined;
		}
		if (typeof element.loadTemplate === 'function'){
			element.loadTemplate(template);
		}
		var childTemplates = template.children,
			len, child, i;
		if (Array.isArray(childTemplates) && (typeof element.appendElem === 'function')){
			len = childTemplates.length;
			for (i = 0; i < len; i++){
				child = this.createFromTemplate(childTemplates[i]);
				if (child){
					element.appendElem(child);
				}
			}
		}
		return element;
	};

}