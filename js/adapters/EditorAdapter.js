/*jslint plusplus: true, white: true */
/*global */

/**
 * Interface for a class that transforms editor objects into native javascript one.
 * @class     EditorAdapter
 * @module    Adapters
 * @type      {Object}
 * @since     0.0.8
 * @author    A.Shcherbakov
 */

function EditorAdapter(){

	/**
	 * Name of the current class.
	 *
	 * This attribute is introduced for inter-browser compatibility: e.g., IE can not deduce the name of the class.
	 * @property       {String}        _className
	 * @private
	 * @default        "EditorAdapter"
	 */
	var _className = 'EditorAdapter';

	/**
	 * {{#crossLink "EditorAdapter/_className:property"}}_className{{/crossLink}} getter.
	 * @method         getName
	 * @return         {String}
	 */
	this.getName = function(){
		return _className;
	};

	/**
	 * {{#crossLink "EditorAdapter/_className:property"}}_className{{/crossLink}} setter.
	 *
	 * It is meant to be used by inheriting classes in order to set
	 * {{#crossLink "EditorAdapter/_className:property"}}_className{{/crossLink}}.
	 * @method         setName
	 * @param          {String}        name
	 * @return         {void}
	 */
	this.setName = function(name){
		_className = name;
	};

	/**
	 * Outputs messages in predefiend format.
	 *
	 * Current implementation redirects string output into `console.log` stream.
	 * @method        _log
	 * @private
	 * @param         {String}         origin        name of the method that issued the message
	 * @return        {void}
	 */
	var _log = function(origin){
		console.log('Methods of class ' + this.getName() +
			' are not meant to be used directly. Method ' +
			origin +
			' was called directly.');
	}.bind(this);

	/**
	 * Transforms editor Range instance `r` into native javascript
	 * [Range](https://developer.mozilla.org/en-US/docs/Web/API/Range) one.
	 *
	 * @method         toNativeRange
	 * @param          {Object}        r
	 * @return         {Range}
	 */
	this.toNativeRange = function(r){
		_log('toNativeRange');
	};

}