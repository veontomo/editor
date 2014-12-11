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
	 * @throws         {Error}         If `name` is not a string
	 */
	this.setName = function(name){
		if (typeof name === 'string'){
			_className = name;
		} else {
			throw new Error('The name must be a string!');
		}
	};

	/**
	 * Retrieves native javascript Node object representing editor content.
	 *
	 * @method         getEditorContent
	 * @param          {Object}        r
	 * @return         {Node}
	 * @abstract
	 * @since          0.1.0
	 */
	this.getEditorContent = function(){
		/// !!! abstract method. Must be overridden by inheriting class.
		throw new Error('Method "getEditorContent" of class must be overridden by inheriting class!');
	};

	/**
	 * Transforms editor-specific range instance `r` into native javascript
	 * [Range](https://developer.mozilla.org/en-US/docs/Web/API/Range) one.
	 *
	 * @method         toNativeRange
	 * @param          {Object}        r
	 * @return         {Range}
	 * @abstract
	 */
	this.toNativeRange = function(r){
		/// !!! abstract method. Must be overridden by inheriting class.
		throw new Error('Method "toNativeRange" of class must be overridden by inheriting class!');
	};

	/**
	 * Retrieves array of editor-specific range instances.
	 *
	 * @method         getEditorRanges
	 * @param          {Object}        e
	 * @return         {Array}
	 * @abstract
	 * @since          0.1.0
	 */
	this.getEditorRanges = function(e){
		/// !!! abstract method. Must be overridden by inheriting class.
		throw new Error('Method "getEditorRanges" of class must be overridden by inheriting class!');
	};

	/**
	 * Returns array of native javascript [Range](https://developer.mozilla.org/en-US/docs/Web/API/Range)
	 * instances of the editor-specific ranges of editor `editor`.
	 *
	 * @method         getNativeRanges
	 * @param          {Object}      editor
	 * @return         {Array|Null}           array of [Range](https://developer.mozilla.org/en-US/docs/Web/API/Range) instances
	 */
	this.getNativeRanges = function(editor){
		var editorRanges;
		try {
			editorRanges = this.getEditorRanges(editor);
		} catch(e){
			console.log('Error (' + e.name + ') detected when retrieving editor ranges: ' + e.message);
		}
		if (!Array.isArray(editorRanges)){
			return null;
		}
		var ranges = [];
		editorRanges.forEach(function(r){
			try{
				var nativeRange = this.toNativeRange(r);
				ranges.push(nativeRange);
			} catch(e){
				console.log('Error (' + e.name + ') detected when converting editor-specific range into native one: ' + e.message);
			}
		}.bind(this));
		return ranges;
	};


}