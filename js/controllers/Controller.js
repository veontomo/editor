/*jslint plusplus: true, white: true */
/*global  Node */

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
	 * Name of the class that the controller represents.
	 *
	 * It is supposed to be a {{#crossLink "Tag"}}Tag{{/crossLink}} or one of its subclasses.
	 * @property {Tag} _model
	 * @private
	 * @type
	 * @since  0.2.0
	 */
	var _model;

	/**
	 * A worker that performs operations on the editor content.
	 * @property       {Object}        _worker
	 * @private
	 * @since          0.1.0
	 */
	var _worker = new Document();
	_worker.setFactory(NEWSLETTER.factory);

	/**
	 * Editor-specific adapter that transforms objects from editor representation into native javascript one.
	 * @property       {EditorAdapter}      _editorAdapter
	 * @since          0.0.8
	 * @private
	 */
	var _editorAdapter = NEWSLETTER.editorAdapter;

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

	this.getEditorSelection = function(editor){
		var adapter;
		try {
			adapter = this.getEditorAdapter();
			return adapter.getNativeRanges(editor);
		} catch (e){
			console.log(e.name + ' occurred when retrieving editor selection: ' + e.message);
		}
	};



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
	 * Disables `field` of `dialog`.
	 * @method        disableFieldIfNotEditable
	 * @param         {Object}      dialog      editor-specific representation of the dialog
	 * @param         {Object}      field       object that uniquely defines the field to be disabled
	 * @return        {void}
	 * @since         0.2.2
	 */
	this.disableField = function(dialog, field){
		var adapter;
		try {
			adapter = this.getEditorAdapter();
			adapter.disableField(dialog, field);
		} catch (e){
			console.log(e.name + ': failed to disable the dialog field. Message: ' + e.message);
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
	 * Inheriting classes might override this method in order to have a non-trivial behavior.
	 *
	 * @method         onLoad
	 * @param          {Object}            dialog      editor-specific representation of dialog
	 * @param          {Object}            editor
	 * @param          {Node|null}         node        [Optional] [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node)
	 *                                                 instance that has triggered the appearance of the dialog
	 * @return         {void}
	 * @since          0.2.0
	 */
	this.onLoad = function(dialog, editor, node){
		console.log(dialog, editor, node);
		/// Override if non-trivial behavior is required
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
	 * Inheriting classes might override this method in order to have a non-trivial behavior.
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
		console.log(dialog, editor, node);
		/// Override if non-trivial behavior is required
		return;
	};

	/**
	 * Action to execute when `dialog`'s confirm button is pressed.
	 *
	 * All information (like what is selected, what element has triggered the dialog etc) can be
	 * retrieved from variable `editor`. Nevertheless, an optional json object `params` is passed in order
	 * to avoid repetitive parsing of the editor content in search of element that has triggered
	 * the dialog (first parsing might occur when a deciding whether a context menu item
	 * should appear or not, second - when filling in the dialog input fields etc).
	 *
	 * Inheriting classes might override this method in order to have a non-trivial behavior.
	 *
	 * @method         onOk
	 * @param          {Object}            dialog      editor-specific representation of dialog
	 * @param          {Object}            editor
	 * @param          {Object}            params      [Optional] useful parameters
	 * @return         {void}
	 * @since          0.2.0
	 */
	this.onOk = function(dialog, editor, params){
		/// Override if non-trivial behavior is required
		console.log(dialog, editor, params);
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
	 * Inheriting classes might override this method in order to have a non-trivial behavior.
	 *
	 * @method         onCancel
	 * @param          {Object}            dialog      editor-specific representation of dialog
	 * @param          {Object}            editor
	 * @param          {Node|null}         node        [Optional] [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node)
	 *                                                 instance that has triggered the appearance of the dialog
	 * @return         {void}
	 * @since          0.2.0
	 */
	this.onCancel = function(dialog, editor, element){
		/// Override if non-trivial behavior is required
		console.log(dialog, editor, element);
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
	 *
	 * Returns nothing if the corresponding element is not found.
	 * @method         findRepresentativeAncestor
	 * @param          {Object}        el      editor-specific representation of DOM node.
	 * @return         {Node}                  [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance
	 * @since          0.2.0
	 */
	this.findRepresentativeAncestor = function(el){
		var adapter = this.getEditorAdapter(),
			nativeEl = adapter.toNativeElement(el);
		if (!nativeEl){
			return;
		}
		return this.findRepresentativeAncestorOfNode(nativeEl);
	};


	/**
	 * Finds the nearest ancestor of the type the controller represents. Look up starts
	 * from the current cursor position.
	 *
	 * Returns nothing if the corresponding element is not found.
	 * @method         findRepresentativeAncestorFromCursorPosition
	 * @param          {Object}        editor       editor-specific representation of DOM node.
	 * @return         {Node}
	 * @since          0.2.1
	 */
	this.findRepresentativeAncestorFromCursorPosition = function(editor){
		var adapter = this.getEditorAdapter(),
			cursorPos = adapter.getCursorPosition(editor);
		if (!cursorPos){
			return;
		}
		var startElem = cursorPos.startContainer;
		return this.findRepresentativeAncestorOfNode(startElem);
	};

	/**
	 * Finds the nearest ancestor of `node` of the type the controller represents.
	 *
	 * Returns nothing if the corresponding element is not found.
	 * @method         findRepresentativeAncestorOfNode
	 * @param          {Node}          node      [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance
	 * @return         {Node}
	 * @since          0.2.1
	 */
	this.findRepresentativeAncestorOfNode = function(node){
		var doc = this.getWorker(),
			model = this.getModel(),
			criteria, proto, n;
			if (model){
				proto = model.prototype;
				if (proto){
					criteria = proto.characteristicFunction;
				}
			}
		if (typeof criteria === 'function'){
			n  = doc.findAncestor(node, criteria);
		}
		return n;
	};

	/**
	 * Fills in editor `dialog` with data stored in `element`.
	 *
	 * Data is retrieved from `element` by means of template() method which is applied
	 * to the object that {{#crossLink "Controller/_worker:property"}}_worker{{/crossLink}}
	 * returns.
	 * @method         fillInDialogWithElement
	 * @param          {Object}        dialog    editor-specific representation of the dialog
	 * @param          {Node}          element   [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance
	 *                                           which various properties are to be used to fill in the dialog
	 * @param          {String}        marker    an identifier that serves to determine how template should be
	 *                                           mapped into dialog object
	 * @return         {void}
	 * @since          0.2.0
	 */
	this.fillInDialogWithElement = function(dialog, element){
	    var adapter, worker, elemObj, dialogData, template;
	    try {
	        adapter = this.getEditorAdapter();
	        worker = this.getWorker();
	        elemObj = worker.getFactory().mimic(element);
	        if (!elemObj){
	        	return;
	        }
	        template = elemObj.template();
	        dialogData = adapter.templateToDialog(template);
	        console.log("data to fill in the dialog: ", dialogData);
	        adapter.fillInDialog(dialog, dialogData);
	    } catch(e){
	        console.log(e.name + ' occurred when filling in dialog with data: ' + e.message);
	    }
	};

	/**
	 * Fills in `dialog` window based on `editor` and `pivot`.
	 *
 	 * `editor` represents the editor itself and serves to obtain what is selected at the moment
	 * the dialog is activated.
	 *
	 * @method         fillInDialogWithSelection
	 * @param          {Object}        dialog        editor-specific representation of a dialog window
	 * @param          {Object}        editor
	 * @return         {void}
	 * @since          0.2.1
	 */
	this.fillInDialogWithSelection = function(dialog, editor){
		console.log(dialog, editor);
		console.warn('Controller.fillInDialogWithSelection() is called, but its implementation is trivial (it does nothing).');
	};

	/**
	 * Saves `data` inside editor-specific object `host`.
	 *
	 * The initial intent is to be able to pass elements that trigger appearance
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
	 * Retrieves previously saved data from editor-specific object `host`.
	 *
	 * The initial intent is to be able to pass elements that trigger appearance
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
			console.log(e.name + ' occurred when getting extra information: ' + e.message);
		}
	};

	/**
	 * Sets a dialog field.
	 *
	 * Dialog field and the value to set is encoded into object `info`.
	 *
	 * This method is similar to {{#crossLink "Controller/setDialogInputField:method"}}setDialogInputField{{/crossLink}},
	 * difference between them is that this method inserts information in text-input fields.
	 * @method         setDialogInputField
	 * @param          {Object}        dialog    editor-specific representation of dialog window
	 * @param          {Object}        info
	 * @return         {void}
	 * @since          0.2.0
	 */
	this.setDialogInputField = function(dialog, info){
		var adapter = this.getEditorAdapter();
		adapter.setDialogInputField(dialog, info);
	};


	/**
	 * Displays a warning on the dialog window.
	 *
	 * Location of the warning and its content is encoded into object `info` format of which is editor-specific.
	 *
	 * This method is similar to {{#crossLink "Controller/setDialogInputField:method"}}setDialogInputField{{/crossLink}},
	 * difference between them is that this method changes html-like fields.
	 * @method         setDialogHtmlField
	 * @param          {Object}        dialog    editor-specific representation of dialog window
	 * @param          {Object}        info
	 * @return         {void}
	 * @since          0.2.0
	 */
	this.setDialogHtmlField = function(dialog, info){
		var adapter = this.getEditorAdapter();
		adapter.setDialogHtmlField(dialog, info);
	};

	/**
	 * Creates an instance of a class the controller corresponds to.
	 *
	 * For example, for {{#crossLink "CTable"}}CTable{{/crossLink}} subclass, the method is supposed to return
	 * a {{#crossLink "Table"}}Table{{/crossLink}} instance.
	 *
	 * The method makes use of {{#crossLink "Controller/getModel:method"}}getModel(){{/crossLink}} method
	 * in order to determine what class it corresponds to.
	 * @method         createModel
	 * @return         {Object}
	 * @since          0.2.1
	 */
	this.createModel = function(){
		var Model;
		try {
			Model = this.getModel();
			if (typeof Model === 'function'){
				return new Model();
			}
		} catch(e){
			console.log(e.name + ' occurred when controller was creating an element: ' + e.message);
		}
	};

	/**
	 * Returns `true` if node `n` is editable. Returns `false` otherwise.
	 * @method         isNodeEditable
	 * @param          {Node}          n
	 * @return         {Boolean}
	 * @since          0.2.3
	 */
	this.isNodeEditable = function(n){
		var worker, result;
		try {
			worker = this.getWorker();
			result = worker.isNodeEditable(n);
		} catch (e){
			console.log(e.name + ': the node is assigned as non-editable because ' + e.message);
			result = false;
		}
		return result;
	};

	/**
	 * Returns `true` if `selection` is editable. Returns `false` otherwise.
	 * @method         isSelectionEditable
	 * @param          {Array}          selection   array of [Range](https://developer.mozilla.org/en-US/docs/Web/API/Range) instances
	 * @return         {Boolean}
	 * @since          0.2.3
	 */
	this.isSelectionEditable = function(selection){
	 	var worker, result;
	 	try {
	 		worker = this.getWorker();
	 		result = worker.isSelectionEditable(selection);
	 	} catch (e){
	 		console.log(e.name + ': the node is assigned as non-editable because ' + e.message);
	 		result = false;
	 	}
	 	return result;
	};

	/**
	 * Removes `node` from DOM corresponding to the editor content.
	 * @method         removeElement
	 * @param          {Object}        editor
	 * @param          {Node}          node        [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) instance
	 * @return         {void}
	 * @since          0.2.4
	 */
	this.removeNode = function(editor, node){
		var adapter, worker, content;
		try {
			adapter = this.getEditorAdapter();
			content = adapter.getEditorContent(editor);
			worker = this.getWorker();
			worker.removeNode(node);
			adapter.setEditorContent(content);
		} catch (e){
			console.log(e.name + ' occurred when removing a node: ' + e.message);
		}
	};
}