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
	 * Inserts node `child` as a child of a node `parent` at position `index`.
	 *
	 * If case of success, the inserted node has number `index` among children of node `parent`.
	 *
	 * Returns the newly inserted node.
	 *
	 * @method       insertAt
	 * @param        {Node}            parent      [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance
	 * @param        {Node}            child       [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance
	 * @param        {Integer}         index
	 * @return       {Node}                        [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance
	 * @since        0.1.0
	 * @abstract
	 */
	this.insertAt = function(parent, child, index){
		/// !!! abstract method. Must be overridden by inheriting class.
		throw new Error('Method "insertAt" of class EditorAdapter must be overridden by inheriting class!');
	};

	/**
	 * Removes node `n` from the DOM along with all its descendants.
	 *
	 * Returns the removed node.
	 * @method         removeNode
	 * @param          {Node}        n     [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance
	 * @return         {Node}
	 * @since          0.1.0
	 * @abstract
	 */
	this.removeNode = function(n){
		/// !!! abstract method. Must be overridden by inheriting class.
		throw new Error('Method "removeNode" of class EditorAdapter must be overridden by inheriting class!');
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
	 */
	this.getCursorPosition = function(editor){
		/// !!! abstract method. Must be overridden by inheriting class.
		throw new Error('Method "getCursorPosition" of class EditorAdapter must be overridden by inheriting class!');
	}



}