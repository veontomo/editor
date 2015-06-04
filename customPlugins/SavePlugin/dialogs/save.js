/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global CKEDITOR, CDownload*/

// CKEDITOR.dialog.add( 'saveDialog', function(editor) {

// 	/**
// 	 * Instance of {{#crossLink "Controller"}}Controller{{/crossLink}}
// 	 * @property       _controller
// 	 * @type           CDownload
// 	 * @private
// 	 */
// 	var _controller = new CDownload();

// 	/**
// 	 * Name of the plugin to which this dialog menu refers.
// 	 * @property    _pluginName
// 	 * @type        {String}
// 	 */
// 	var _pluginName = 'save2';

// 	return {
// 		// Basic properties of the dialog window: title, minimum size.
// 		title: editor.lang[_pluginName].title,
// 		minWidth:  400,
// 		minHeight: 200,

// 		// Dialog window contents definition.
// 		contents: [
// 			{
// 				id: 'basic',
// 				elements: [{
// 					type: 'html',
// 					html: editor.lang[_pluginName].description,
// 					style: 'padding-top: 1em;padding-bottom:1em;'
// 				}, {
// 					type: 'text',
// 					id: 'filename',
// 					label: editor.lang[_pluginName].name,
// 					title: editor.lang[_pluginName].popup,
// 					inputStyle: 'width: 20em',
// 					// "default": _controller.appendTimeStamp()
// 				}]
// 			}
// 		],

// 		onShow: function(){
// 			// this.setValueOf('tab-general', 'filename', _controller.appendTimeStamp('template'));
// 		},

// 		onOk: function() {
// 			_controller.downloadRaw(this, editor);
// 		}
// 	};
// });


/**
* Dialog for saving and reading files.
*
* @module  Dialogs
* @class   SaveDialog
* @since   0.2.8
*/
function SaveDialog(editor) {
	/**
	 * Instance of {{#crossLink "CFile"}}CFile{{/crossLink}}
	 * @property  {CFile}     _controller
	 * @type      {CFile}
	 * @private
	 */
	var _controller = new CFile();
	_controller.setEditorAdapter(NEWSLETTER.editorAdapter);

	/**
	 * {{#crossLink "LinkMailDialog/_controller:property"}}_controller{{/crossLink}} configurator.
	 * @method  anonymous
	 * @return  {void}
	 * @since   0.1.0
	 * @private
	 */
	(function(){
	    var worker = new Document();
	    worker.setFactory(NEWSLETTER.factory);
	    _controller.setWorker(worker);
	}());


	/**
	 * Style for text input fields for choosing colors.
	 * @property {String} _inputColorStyle
	 * @type     {String}
	 * @private
	 */
	var _inputColorStyle = 'min-width: 6em; width: 6em; max-width: 6em; text-align: center;';


	/**
	 * Style for label fields (text in front of input fields).
	 * @property {String} _labelStyle
	 * @type     {String}
	 * @private
	 */
	var _textInputStyle = 'padding-left: 0px; margin: 0; float: left; width: 100%;';

	/**
	 * Style for warning fields.
	 * @property {String} _warningStyle
	 * @type     {String}
	 * @private
	 */
	 var _warningStyle = 'color: #EE0000; font-size: 1.1em; font-weight: bold;';


	var _pluginName = 'SavePlugin';


	return {
	    title: editor.lang[_pluginName].title,
	    minWidth: 400,
	    minHeight: 300,
	    height: '20em',
	    contents: [{
	        id: 'saveInfoTab',
	        elements: [{
	            type: 'vbox',
	            children: [{
	                type:  'text',
	                id:    'fileName',
	                label:  editor.lang[_pluginName].fileName,
	                title:  editor.lang[_pluginName].fileNameDescr,
	                style:  _textInputStyle,
	                "default": _controller.suggestFileName()
	            }, {
	                type: 'checkbox',
	                id: 'isUnderlined',
	                label: editor.lang[_pluginName].underline,
	                title: editor.lang[_pluginName].underlineDescr,
	                'default': true,
	            }, {
	                type: 'checkbox',
	                id: 'isTargetBlank',
	                label: editor.lang[_pluginName].target,
	                title: editor.lang[_pluginName].targetDescr,
	                "default": true,
	            }],
	        }]
	    }],


	    /**
	     * The function to execute when the dialog is displayed for the first time.
	     *
	     * @method     onLoad
	     * @return     {void}
	     */
	    onLoad: function(){

	    },

	    onCancel: function(){
	    },

	    onOk: function(){
	        var params = {
	        };
	        _controller.onOk(this, editor, params);
	    }
	};

}

CKEDITOR.dialog.add('SavePluginDialog', SaveDialog);