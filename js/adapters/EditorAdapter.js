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
	 * @param          {Object}        e             editor instance
	 * @return         {Node}
	 * @abstract
	 * @since          0.1.0
	 */
	this.getEditorContent = function(e){
		/// !!! abstract method. Must be overridden by inheriting class.
		throw new Error('Method "getEditorContent" of class EditorAdapter must be overridden by inheriting class!');
	};

	/**
	 * Sets the content of the editor body.
	 *
	 * @method         setEditorContent
	 * @param          {Object}        e      editor instance
	 * @param          {Node}          c      [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance
	 * @abstract
	 * @since          0.1.0
	 */
	this.setEditorContent = function(e, c){
		/// !!! abstract method. Must be overridden by inheriting class.
		throw new Error('Method "setEditorContent" of class EditorAdapter must be overridden by inheriting class!');
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
		throw new Error('Method "toNativeRange" of class EditorAdapter must be overridden by inheriting class!');
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
		throw new Error('Method "getEditorRanges" of class EditorAdapter must be overridden by inheriting class!');
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

	/**
	 * Fills in dialog window `dialog` with `data`.
	 * @method         fillInDialog
	 * @param          {Object}        dialog
	 * @param          {Object}        data
	 * @param          {Any}           marker      [optional] additional info
	 * @return         {void}
	 * @since          0.1.0
	 * @abstract
	 *
	 */
	this.fillInDialog = function(dialog, data, marker){
		/// !!! abstract method. Must be overridden by inheriting class.
		throw new Error('Method "fillInDialog" of class EditorAdapter must be overridden by inheriting class!');
	};


	/**
	 * Collects parameters from the dialog menu and returns json like object with that data.
	 * If optional parameter `types` is provided, then only dialog fields of types present
	 * in array `types` are to be taken in consideration.
	 *
	 * Returns json object whose keys are page ids of the dialog menu and values are json objects
	 * whose keys are ids of the elements present on that page and values are those read from  the
	 * dialog menu.
	 *
	 * Example: <pre>{infoTab: {author: 'A.Einstein', title: 'On electrodynamics of moving electron'},
	 * publisher: {code: TDR19, license: 1031}}</pre>
	 *
	 * @method         getDialogData
	 * @param          {Object}           dialog
	 * @param          {Array}            types         array of strings standing for dialog field types.
	 * @return         {Object}
	 * @since 		   0.1.0
	 * @abstract
	 */
	this.getDialogData = function(dialog, types){
		/// !!! abstract method. Must be overridden by inheriting class.
		throw new Error('Method "getDialogData" of class EditorAdapter must be overridden by inheriting class!');
	};


	/**
	 * Returns the position of the cursor inside the content of `editor`.
	 *
	 * The position is decribed by means of [Range](https://developer.mozilla.org/en-US/docs/Web/API/Range) instance
	 * whose `startOffset` attribute is considered for determining the cursor position.
	 * @method         getCursorPosition
	 * @param          {Object}        editor
	 * @return         {Range}
	 * @since          0.1.0
	 * @abstract
	 */
	this.getCursorPosition = function(editor){
		/// !!! abstract method. Must be overridden by inheriting class.
		throw new Error('Method "getCursorPosition" of class EditorAdapter must be overridden by inheriting class!');
	};


	/**
	 * Sets value of a field in `dialog` according to information encoded in `data`.
	 *
	 * Since inheriting classes are extected to implement this method, see concrete implementations for
	 * the format in which `data` is supposed to be presented.
	 * @method         setDialogInputField
	 * @param          {Object}        dialog           editor dialog object
	 * @param          {Object}        data             editor-specific representation
	 * @since          0.2.0
	 * @return         {void}
	 * @abstract
	 */
	this.setDialogInputField = function(dialog, data){
		/// !!! abstract method. Must be overridden by inheriting class.
		throw new Error('Method "setDialogInputField" of class EditorAdapter must be overridden by inheriting class!');
	};

	/**
	 * Sets value of a field in `dialog` according to information encoded in `data`.
	 *
	 * Since inheriting classes are extected to implement this method, see concrete implementations for
	 * the format in which `data` is supposed to be presented.
	 * @method         setDialogHtmlField
	 * @param          {Object}        dialog           editor dialog object
	 * @param          {Object}        data             editor-specific representation
	 * @since          0.2.0
	 * @return         {void}
	 * @abstract
	 */
	this.setDialogHtmlField = function(dialog, data){
		/// !!! abstract method. Must be overridden by inheriting class.
		throw new Error('Method "alert" of class EditorAdapter must be overridden by inheriting class!');
	};

	/**
	 * Returns native javascript representation of `el`.
	 * @method         toNativeElement
	 * @param          {Object}        el    editor-specific representation of a DOM element
	 * @return         {Node}
	 * @since          0.2.0
	 * @abstract
	 */
	this.toNativeElement = function(el){
		/// !!! abstract method. Must be overridden by inheriting class.
		throw new Error('Method "toNativeElement" of class EditorAdapter must be overridden by inheriting class!');
	};


	/**
	 * Transforms template into dialog.
	 *
	 * In order to be able to track what dialog should be constructed, string `marker` is used.
	 *
	 * It is inverse of {{#crossLink "CKEditorAdapter/dialogToTemplate:property"}}dialogToTemplate{{/crossLink}}.
	 *
	 * The format of the returned object is: <code>{`key1`: `mapper1`, ...}</code>, where `key1` is a marker by means of
	 * which required mapper is chosen and `mapper1` is a function to which a template is supposed to be given.
	 * @method         templateToDialog
	 * @param          {Object}        template
	 * @param          {String}        marker
	 * @return         {Object}
	 * @since          0.2.0
	 * @abstract
	 */
	this.templateToDialog = function(template, marker){
		/// !!! abstract method. Must be overridden by inheriting class.
		throw new Error('Method "templateToDialog" of class EditorAdapter must be overridden by inheriting class!');
	};


	/**
	 * Transforms dialog into template.
	 *
	 * In order to be able to track what dialog should be constructed, string `marker` is used.
	 *
	 * It is inverse of {{#crossLink "CKEditorAdapter/templateToDialog:property"}}templateToDialog{{/crossLink}}.
	 *
	 * The format of the returned object is: <code>{`key1`: `mapper1`}</code>, where `key1` is a marker by means of
	 * which required mapper is chosen and `mapper1` is a function to which a dialog output object is supposed to be given.
	 * @method         dialogToTemplate
	 * @param          {Object}        template
	 * @param          {String}        marker
	 * @return         {Object}
	 * @abstract
	 */
	this.dialogToTemplate = function(dialog, marker){
		/// !!! abstract method. Must be overridden by inheriting class.
		throw new Error('Method "dialogToTemplate" of class EditorAdapter must be overridden by inheriting class!');
	};


	/**
	 * Saves `data` inside editor-specific element `host` (i.e, inside dialog, editor itself etc).
	 * @method         saveExtra
	 * @param          {Object}        host
	 * @param          {Any}           data
	 * @return         {void}
	 * @since          0.2.0
	 * @abstract
	 */
	this.saveExtra = function(host, data){
		/// !!! abstract method. Must be overridden by inheriting class.
		throw new Error('Method "saveExtra" of class EditorAdapter must be overridden by inheriting class!');
	};

	/**
	 * Gets previously saved data from editor-specific object `host` (i.e, inside dialog, editor itself etc).
	 * @method         getExtra
	 * @param          {Object}        host
	 * @return         {Any}
	 * @since          0.2.0
	 * @abstract
	 */
	this.getExtra = function(host){
		/// !!! abstract method. Must be overridden by inheriting class.
		throw new Error('Method "getExtra" of class EditorAdapter must be overridden by inheriting class!');
	};

	/**
	 * Disables `dialog` defined by `field`.
	 * @method         disableField
	 * @param          {Object}        dialog      editor-specific dialog menu field
	 * @return         {Object}        field
	 * @since          0.2.2
	 * @abstract
	 */
	this.disableField = function(dialog, field){
		/// !!! abstract method. Must be overridden by inheriting class.
		throw new Error('Method "disableField" of class EditorAdapter must be overridden by inheriting class!');
	};

	/**
	 * Returns `true` if `field` element of `dialog` is enabled  and `false` otherwise.
	 * @method         isFieldEnabled
	 * @param          {Object}        dialog      editor-specific dialog menu field
	 * @param          {Object}        field
	 * @return         {boolean}
	 * @since          0.2.3
	 * @abstract
	 */
	this.isFieldEnabled = function(dialog, field){
		/// !!! abstract method. Must be overridden by inheriting class.
		throw new Error('Method "isFieldEnabled" of class EditorAdapter must be overridden by inheriting class!');
	};

	/**
	 * Returns value of `field` element of `dialog`.
	 * @method         getFieldValue
	 * @param          {Object}        dialog      editor-specific dialog menu field
	 * @param          {Object}        field
	 * @return         {Any}
	 * @since          0.2.3
	 * @abstract
	 */
	this.getFieldValue = function(dialog, field){
		/// !!! abstract method. Must be overridden by inheriting class.
		throw new Error('Method "getFieldValue" of class EditorAdapter must be overridden by inheriting class!');
	};



}