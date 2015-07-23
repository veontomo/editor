/*jslint plusplus: true, white: true */
/*global CKEDITOR*/

/**
 * Plugin to save the editor window content.
 * @module    Plugins
 * @class     Save
 * @type      {Object}
 * @since     0.0.7
 * @author    A.Shcherbakov
 */
CKEDITOR.plugins.add('SavePlugin', {
    /**
     * Register plugin icons.
     * @property       {String} icons
     * @since          0.0.5
     */
    icons: 'SavePlugin',

    /**
     * Plugin initializer.
     * @method         init
     * @param          {CKEditor}      editor
     * @return         {void}
     * @since          0.0.5
     */
    init: function(editor) {
        /**
         * Instance of {{#crossLink "CTable"}}CTable{{/crossLink}}
         * @property   {CTable}        _controller
         * @type       {CTable}
         * @private
         */
        var _controller = new CFile();
        _controller.setEditorAdapter(NEWSLETTER.editorAdapter);
        /**
         * A class that performs operations with editor window content.
         * @property   {Document}     _worker
         * @type       {Document}
         * @since      0.2.0
         * @private
         */
        var _worker = new Document();
        _worker.setFactory(NEWSLETTER.factory);
        _controller.setWorker(_worker);


        /**
         * Object containing elements on which context menu options have been triggered.
         * @private
         * @property   {Object}        _target
         * @since      0.2.0
         */
        var _target = {};

        /**
         * Plugin name.
         * @type       {String}
         * @property   {String}        _pluginName
         * @since      0.2.0
         * @private
         */
        var _pluginName = this.name;

        /**
         * Name of the group to embrace the plugin functionality.
         * @type       {String}
         * @property   {String}        _pluginNameGroup
         * @since      0.2.0
         * @private
         */
        var _pluginNameGroup = _pluginName + 'Group';

        // Define an editor command that opens our dialog.
        editor.addCommand(_pluginName , {
            exec: function() {
            	 _controller.saveOnServer(editor);
            }
        });


        // Create a toolbar button that executes the above command.
        editor.ui.addButton(_pluginName, {
            // The text part of the button (if available) and tooptip.
            label: editor.lang[_pluginName].label,
            // The command to execute on click.
            command: _pluginName,
            // The button placement in the toolbar (toolbar group name).
            toolbar: 'saveInstantState'
        });
    },


    onLoad: function() {
        var translations = {
            it: {
                label: 'Salvataggio temporaneo',
            },
            en: {
                label: 'Save temporary version',
            }
        };

        var lang;
        for (lang in translations) {
            if (translations.hasOwnProperty(lang)) {
                CKEDITOR.plugins.setLang(this.name, lang, translations[lang]);
            }
        }
    }
});
