/*jslint plusplus: true, white: true */
/*global  */

/**
 * Base controller class.
 * @module    Controllers
 * @class     Controller
 * @type      {Object}
 * @since     0.0.7
 * @author    A.Shcherbakov
 */
function Controller(){
	"use strict";
	if (!(this instanceof Controller)) {
	    return new Controller();
	}

	/**
	 * The whole content of the editor window.
	 * @property {Eleemnt|Null} _content
	 * @since     0.1.0
	 * @private
	 */
	var _content;

	/**
	 * {{#crossLink "Controller/_content:property"}}_content{{/crossLink}} setter.
	 *
	 * If the argument is not a [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance,
	 * the setter resets {{#crossLink "Controller/_content:property"}}_content{{/crossLink}}.
	 * @method         setContent
	 * @param          {Node}          c      [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance
	 * @return         {void}
	 * @since          0.1.0
	 */
	this.setContent = function(c){
		_content = (c instanceof Node) ? c : void 0;
	};

	/**
	 * {{#crossLink "Controller/_content:property"}}_content{{/crossLink}} getter.
	 *
	 * @method         getContent
	 * @return         {Node|Null}
	 * @since          0.1.0
	 */
	this.getContent = function(){
		return _content;
	};


	/**
	 * A worker that performes operations on the editor content.
	 * @property       {Object}        _worker
	 * @private
	 * @since          0.1.0
	 */
	var _worker;

	/**
	 * {{#crossLink "Controller/_worker:property"}}_worker{{/crossLink}} setter.
	 *
	 * Note that no check concerning the validity of `w` is performed.
	 * @method         setWorker
	 * @param          {Object}        w       an object able to perform different operations on the editor content
	 * @since          0.1.0
	 * @return         {void}
	 */
	this.setWorker = function(w){
		_worker = w;
	};


	/**
	 * {{#crossLink "Controller/_worker:property"}}_worker{{/crossLink}} setter.
	 * @method         getWorker
	 * @return         {Object}
	 * @since          0.1.0
	 */
	this.getWorker = function(){
		return _worker;
	};


	/**
	 * Array of elemnts belonging to the selection.
	 * @property      {Array}          _selection
	 * @private
	 * @since          0.0.7
	 */
	var _selection;

	/**
	 * {{#crossLink "Controller/_selection:property"}}_selection{{/crossLink}} getter.
	 * @method         getSelection
	 * @return         {Object}
	 * @since          0.0.7
	 */
	this.getSelection = function(){
		return _selection;
	};

	/**
	 * {{#crossLink "Controller/_selection:property"}}_selection{{/crossLink}} setter.
	 * @method         setSelection
	 * @param          {Array}        sel
	 * @return         {void}
	 * @since          0.0.7
	 */
	this.setSelection = function(sel){
		_selection = sel;
	};


	/**
	 * Editor-specific adapter that transforms objects from editor representation into native javascript one.
	 * @property       {EditorAdapter}      _editorAdapter
	 * @since          0.0.8
	 * @private
	 */
	var _editorAdapter;

	/**
	 * {{#crossLink "Controller/_editorAdapter:property"}}_editorAdapter{{/crossLink}} getter.
	 * @method    getEditorAdapter
	 * @since     0.0.8
	 * @return    {EditorAdapter}
	 */
	this.getEditorAdapter = function(){
		return _editorAdapter;
	};

	/**
	 * {{#crossLink "Controller/_editorAdapter:property"}}_editorAdapter{{/crossLink}} setter.
	 * @method   setEditorAdapter
	 * @param    {EditorAdapter}    adapter       {{#crossLink "EditorAdapter"}}EditorAdapter{{/crossLink}} instance.
	 *                                            If setting to something different, might generate errors.
	 * @since    0.0.8
	 */
	this.setEditorAdapter = function(adapter){
		_editorAdapter = adapter;
	};




	/**
	 * Disables single element with id `elemId` on page with id `pageId` in `dialog`.
	 * @method         _disableField
	 * @param          {CKEDITOR.dialog}    dialog
	 * @param          {String}             pageId
	 * @param          {String}             elemId     id of the element to disable
	 * @return         {void}
	 * @since          0.0.7
	 * @private
	 */
	var _disableField = function(dialog, pageId, elemId){
		try {
			dialog.getContentElement(pageId, elemId).disable();
		} catch (e){
			console.log('Error (' + e.name + ') when disabling element (' + pageId + ', ' + elemId +')' + e.message);
		}
	};



	/**
	 * Disables element(s) with id `elemId` on page with id `pageId` in `dialog`.
	 *
	 * If `elemId` is an array, then
	 * {{#crossLink "Controller/_disableField:method"}}_disableField{{/crossLink}} uses
	 * each array element to disable single elements.
	 * @method         _disableFields
	 * @param          {CKEDITOR.dialog}    dialog
	 * @param          {String}             pageId
	 * @param          {String|Array}       elemIds     element id or array of element ids
	 * @return         {void}
	 * @since          0.0.7
	 * @private
	 */
	var _disableManyFields = function(dialog, pageId, elemIds){
		if (Array.isArray(elemIds)){
			elemIds.forEach(function(elemId){
				_disableField(dialog, pageId, elemId);
			});
		} else {
			_disableField(dialog, pageId, elemIds);
		}
	};


	/**
	 * Disables input fields described by `data` in `dialog`.
	 *
	 * `data` is a json key-value object which keys are page ids and values are array of element ids that
	 * should be disabled. There two possible formats of `data`:
	 *
	 * <pre> {pageId: [fieldId1, fieldId2, ...], ...} </pre>
	 * <pre> {pageId: fieldId, ...} </pre>
	 *
	 * @method         disableFields
	 * @param          {CKEDITOR.dialog}    dialog
	 * @param          {Object}             data
	 * @return         {void}
	 * @since          0.0.7
	 */
	this.disableFields = function(dialog, data){
		if (typeof data !== 'object'){
			return;
		}
		var pageId;
		for (pageId in data){
			if (data.hasOwnProperty(pageId)){
				_disableManyFields(dialog, pageId, data[pageId]);
			}
		}
	};



	/**
	 * Shows error message. Uses javascript method `alert` to display the message.
	 * If `msg` is not a string, default message is displayed.
	 * @method    showMessage
	 * @param     {String}       msg            text of the message
	 * @return    {void}
	 * @since     0.0.7
	 */
	this.showMessage = function(msg){
		alert(typeof msg === 'string' ? msg : 'Error occurred!');
	};

	/**
	 * Fills in `dialog` window based on text selected inside `editor`.
	 *
	 * Information about selection is retrieved from variable `editor`.
	 *
	 * The method is an bastract one and must be overridden by an inheriting class.
	 *
	 * @method         onShow
	 * @param          {Object}            dialog
	 * @param          {Object}            editor
	 * @return         {void}
	 * @abstract
	 */
	this.onShow = function(dialog, editor){
		/// !!! abstract method. Must be overridden by inheriting class.
		throw new Error('Method "onShow" of class Controller must be overridden by inheriting class!');
	};

}