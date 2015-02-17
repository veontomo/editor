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
		_content = (c instanceof Node) ? c : undefined;
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
	 * Name of the class that the controller represents.
	 *
	 * It is supposed to be a {{#crossLink "Tag"}}Tag{{/crossLink}} or one of its sublclasses.
	 * @property {Tag} _model
	 * @private
	 * @type
	 * @since  0.2.0
	 */
	var _model;

	/**
	 * {{#crossLink "Controller/_model:property"}}_model{{/crossLink}} setter.
	 * @method    setModel
	 * @param     {Function}       m
	 * @return    {void}
	 * @since     0.2.0
	 */
	this.setModel = function(m){
		_model = m;
	};


	/**
	 * {{#crossLink "Controller/_model:property"}}_model{{/crossLink}} getter.
	 * @method    getModel
	 * @return    {Function}
	 * @since     0.2.0
	 */
	this.getModel = function(){
		return _model;
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
	 * Action to execute when `dialog` is displayed for the first time.
	 *
	 * All information (like what is selected, what element has triggered the dialog etc) can be
	 * retrieved from variable `editor`. Nevertheless, optional argument `node` is passed in order
	 * to avoid repetitive parsing of the editor content in search of element that has triggered
	 * the dialog (first parsing might occur when a deciding whether a context menu item
	 * should appear or not, second - when filling in the dialog input fields etc).
	 *
	 * Inheriting classes might override this method in order to have a non-trivial behaviour.
	 *
	 * @method         onLoad
	 * @param          {Object}            dialog      editor-specific representation of dialog
	 * @param          {Object}            editor
	 * @param          {Node|null}         node        [Optional] [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node)
	 *                                                 instance that has triggered the appearence of the dialog
	 * @return         {void}
	 * @since          0.2.0
	 */
	this.onLoad = function(dialog, editor, node){
		/// Override if non-trivial behaviour is required
		return;
	};

	/**
	 * Action to execute when `dialog` is loaded (executed every time the dialog is opened).
	 *
	 * All information (like what is selected, what element has triggered the dialog etc) can be
	 * retrieved from variable `editor`. Nevertheless, optional argument `node` is passed in order
	 * to avoid repetitive parsing of the editor content in search of element that has triggered
	 * the dialog (first parsing might occur when a deciding whether a context menu item
	 * should appear or not, second - when filling in the dialog input fields etc).
	 *
	 * Inheriting classes might override this method in order to have a non-trivial behaviour.
	 *
	 * @method         onShow
	 * @param          {Object}            dialog      editor-specific representation of dialog
	 * @param          {Object}            editor
	 * @param          {Node|null}         node        [Optional] [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node)
	 *                                                 instance that has triggered the appearence of the dialog
	 * @return         {void}
	 * @since          0.2.0
	 */
	this.onShow = function(dialog, editor, node){
		/// Override if non-trivial behaviour is required
		return;
	};

	/**
	 * Action to execute when `dialog`'s confirm button is pressed.
	 *
	 * All information (like what is selected, what element has triggered the dialog etc) can be
	 * retrieved from variable `editor`. Nevertheless, optional argument `node` is passed in order
	 * to avoid repetitive parsing of the editor content in search of element that has triggered
	 * the dialog (first parsing might occur when a deciding whether a context menu item
	 * should appear or not, second - when filling in the dialog input fields etc).
	 *
	 * Inheriting classes might override this method in order to have a non-trivial behaviour.
	 *
	 * @method         onOk
	 * @param          {Object}            dialog      editor-specific representation of dialog
	 * @param          {Object}            editor
	 * @param          {Node|null}         node        [Optional] [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node)
	 *                                                 instance that has triggered the appearence of the dialog
	 * @return         {void}
	 * @since          0.2.0
	 */
	this.onOk = function(dialog, editor, element){
		/// Override if non-trivial behaviour is required
		return;
	};

	/**
	 * Action to execute when `dialog`'s cancel button is pressed.
	 *
	 * All information (like what is selected, what element has triggered the dialog etc) can be
	 * retrieved from variable `editor`. Nevertheless, optional argument `node` is passed in order
	 * to avoid repetitive parsing of the editor content in search of element that has triggered
	 * the dialog (first parsing might occur when a deciding whether a context menu item
	 * should appear or not, second - when filling in the dialog input fields etc).
	 *
	 * Inheriting classes might override this method in order to have a non-trivial behaviour.
	 *
	 * @method         onCancel
	 * @param          {Object}            dialog      editor-specific representation of dialog
	 * @param          {Object}            editor
	 * @param          {Node|null}         node        [Optional] [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node)
	 *                                                 instance that has triggered the appearence of the dialog
	 * @return         {void}
	 * @since          0.2.0
	 */
	this.onCancel = function(dialog, editor, element){
		/// Override if non-trivial behaviour is required
		return;
	};


	/**
	 * Transforms an object from template into a dialog form.
	 *
	 * Explicit implementation of this method depends on the editor used (like [CKEDITOR](http://docs.ckeditor.com/#))
	 * as well as on template of which subclass of {{#crossLink "Tag"}}Tag{{/crossLink}} object (like
	 * {{#crossLink "Link"}}Link{{/crossLink}}, {{#crossLink "Table"}}Table{{/crossLink}} etc) is passed.
	 *
	 * To manage different editors, the functionality of the method is delegated to
	 * {{#crossLink "EditorAdapter"}}EditorAdapter{{/crossLink}} class. Further, in order to distinguish what subclass
	 * calls this method, `marker` is used.
	 *
	 * This method is inverse of {{#crossLink "CController/dialogToTemplate:method"}}dialogToTemplate{{/crossLink}}.
	 *
	 * @method         templateToDialog
	 * @param          {Object}        template
	 * @param          {String}        marker
	 * @return         {Object}
	 * @since          0.2.0
	 */
	this.templateToDialog = function(template, marker){
		try {
			var adapter = this.getEditorAdapter(),
				dialog = adapter.templateToDialog(template, marker);
			return dialog;
		} catch(e){
			console.log(e.name + ' occurred when converting template to dialog: ' + e.message);
		}
	};


	/**
	 * Transforms an object from dialog into a template form.
	 *
	 * This method is inverse of {{#crossLink "CController/templateToDialog:method"}}templateToDialog{{/crossLink}}.
	 *
	 * @method         dialogToTemplate
	 * @param          {Object}        dialog
	 * @param          {String}        marker
	 * @return         {Object}
	 * @since          0.2.0
	 */
	this.dialogToTemplate = function(dialog, marker){
		try {
			var adapter = this.getEditorAdapter(),
				template = adapter.templateToDialog(dialog, marker);
			return template;
		} catch(e){
			console.log(e.name + ' occurred when converting dialog to template: ' + e.message);
		}

	};

	/**
	 * Finds the nearest ancestor of `el` that current controller represents.
	 * @method         findRepresentativeAncestor
	 * @param          {Object}        el      editor-specific represenation of DOM node.
	 * @return         {Node}                  [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) in native JS representation
	 * @since          0.2.0
	 */
	this.findRepresentativeAncestor = function(el){
		var adapter = this.getEditorAdapter(),
			nativeEl = adapter.toNativeElement(el);
		if (!nativeEl){
			return;
		}
		var doc = this.getWorker(),
			criteria = this.getModel().characteristicFunction,
			n;
		if (typeof criteria === 'function'){
			n  = doc.findAncestor(nativeEl, criteria);
		}
		return n;
	};

	/**
	 * Fills in editor `dialog` with `data`.
	 *
	 * The structure of `data` must follow the structure of `dialog`.
	 * @method         fillInDialogWithElementData
	 * @param          {Object}        dialog    editor-specific representation of the dialog
	 * @param          {Node}          data      [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance
	 *                                           which various properties are to be used to fill in the dialog
	 * @param          {String}        marker    an identifier that serves to determine how template should be
	 *                                           mapped into dialog object
	 * @return         {void}
	 * @since          0.2.0
	 */
	this.fillInDialogWithElementData = function(dialog, element, marker){
	    var adapter, worker, elemObj, dialogData, template;
	    try {
	        adapter = this.getEditorAdapter();
	        worker = this.getWorker();
	        elemObj = worker.getFactory().mimic(element);
	        if (!elemObj){
	        	return;
	        }
	        template = elemObj.template();
	        dialogData = adapter.templateToDialog(template, marker);
	        adapter.fillInDialog(dialog, dialogData, marker);
	    } catch(e){
	        console.log(e.name + ' occurred when filling in dialog with data: ', e.message);
	    }
	};

	/**
	 * Saves `data` inside editor-specific object `host`.
	 *
	 * The initial intent is to be able to pass elements that trigger appearence
	 * of different items in the context menu to the dialog that stands behind the
	 * operation corresponding to the above mentioned items in the context menu.
	 *
	 * Since this operation is editor-specific, this functionality is delegated to the
	 * {{#crossLink "EditorAdapter"}}EditorAdapter{{/crossLink}} class.
	 *
	 * @method         saveExtra
	 * @param          {Object}        host
	 * @param          {Object}        data
	 * @return         {void}
	 * @since          0.2.0
	 */
	this.saveExtra = function(host, data){
		var adapter;
		try {
			adapter = this.getEditorAdapter();
			adapter.saveExtra(host, data);
		} catch (e){
			console.log(e.name + ' occurred when saving extra information: ', e.message);
		}
	};

	/**
	 * Retreives previously saved data from editor-specific object `host`.
	 *
	 * The initial intent is to be able to pass elements that trigger appearence
	 * of different items in the context menu to the dialog that stands behind the
	 * operation corresponding to the above mentioned items in the context menu.
	 *
	 * Since this operation is editor-specific, this functionality is delegated to the
	 * {{#crossLink "EditorAdapter"}}EditorAdapter{{/crossLink}} class.
	 *
	 * @method         getExtra
	 * @param          {Object}        host
	 * @return         {Any}
	 * @since          0.2.0
	 */
	this.getExtra = function(host){
		var adapter;
		try {
			adapter = this.getEditorAdapter();
			return adapter.getExtra(host);
		} catch (e){
			console.log(e.name + ' occurred when getting extra information: ', e.message);
		}
	};

	/**
	 * Sets a dialog field.
	 *
	 * Dialog field and the value to set is encoded into object `field`.
	 * @method         setDialogField
	 * @param          {Object}        dialog    editor-specific representation of dialog window
	 * @param          {Object}        field
	 * @return         {void}
	 * @since          0.2.0
	 */
	this.setDialogField = function(dialog, field){
		var adapter = this.getEditorAdapter();
		adapter.setDialogField(dialog, field);
	};

	/**
	 * Creates an instance of model that the controller represents and inflates
	 * its properties from `template`.
	 *
	 * @method createFromTemplate
	 * @param  {Object} template
	 * @return {Object}
	 * @since  0.2.0
	 */
	this.createFromTemplate = function(template){
		var Model, element;
		try {
			Model = this.getModel();
			element = new Model();
			element.loadFromTemplate(template);
		} catch(e){
			console.log(e.name + ' occurred when controller was creating an element from template: ', e.message);
		}
		return element;
	};


}