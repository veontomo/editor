/*jslint plusplus: true, white: true */
/*global CKEDITOR, List, ListItem, NEWSLETTER*/

/**
 * Configuration of CKEDITOR.
 * @module  Config
 * @class  CKEDITOR
 *
 * @since  0.0.1
 */
CKEDITOR.editorConfig = function(config){
	/**
	 * Language in which toolbar phrases are displayed.
	 *
	 * @property       {String}        language
	 * @type           {String}
	 * @default        it
	 */
	config.language = 'it';

	/**
	 * Default language (in case {{#crossLink "CKEDITOR/language:property"}}language{{/crossLink}}
	 * is not found).
	 *
	 * @property       {String}        defaultLanguage
	 * @type           {String}
	 * @default        en
	 */
	config.defaultLanguage = 'en';

	/**
	 * Editor window width.
	 *
	 * @property       {String}        width
	 * @type           {String}
	 * @default        "850px"
	 */
	config.width = '850px';

	/**
	 * Editor window height.
	 *
	 * @property       {String}        height
	 * @type           {String}
	 * @default        "650px"
	 */
	config.height = '650px';

	/**
	 * Enter mode: when pressing "ENTER", &lt;br&gt; is inserted, not &lt;p&gt;.
	 *
	 * @property       {Number}        enterMode
	 * @type           {Number}
	 * @default        CKEDITOR.ENTER_BR
	 */
	config.enterMode = CKEDITOR.ENTER_BR;

	/**
	 * Whether objects in the editor window can be resized or not.
	 *
	 * @property       {Boolean}        disableObjectResizing
	 * @type           {Boolean}
	 * @default        true
	 */
	config.disableObjectResizing = true;


	/**
	 * Activate browser spellchecker.
	 * @property       disableNativeSpellChecker
	 * @type           {Boolean}
	 * @since          0.0.7
	 * @default        false
	 */
	config.disableNativeSpellChecker = false;

	/**
	 * Allows appearance of the browser context menu (triggers upon ctrl + right mouse button click).
	 * @property       browserContextMenuOnCtrl
	 * @type           {Boolean}
	 * @since          0.0.7
	 * @default        false
	 */
	config.browserContextMenuOnCtrl = true;

	config.toolbarGroups = [
		{ name: 'document',	   groups: [ 'mode', 'document', 'doctools' ] }, // mode -> it is responsible for "source"
		// { name: 'document',	   groups: [ 'document', 'doctools' ] },
		{ name: 'clipboard',   groups: [ 'clipboard', 'undo' ] },
		// { name: 'editing',     groups: [ 'find', 'selection', 'spellchecker' ] },
		{ name: 'editing',     groups: [ 'find', 'selection' ] },


		{ name: 'others' },
		'/',
		// { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
		{ name: 'basicstyles2', groups: ['bold2', 'italic2', 'underline2', 'strike2']},
		{ name: 'paragraph',   groups: [ 'list', 'indent', 'blocks', 'align'] },
		{ name: 'styles' },
		{ name: 'colors' }
	];

	// registering custom plugins
	var customPluginNames = ['download', 'image2', 'table2', 'link2', 'upload', 'olist2', 'ulist2',
			'selection', 'bold2', 'italic2', 'underline2', 'strike2', 'info2', 'setScale2', 'mail2', 'linkMail', 'save2', 'list2', 'pRow'],
		pluginDir =  NEWSLETTER.customPluginDir;

	customPluginNames.forEach(function(pluginName){
		CKEDITOR.plugins.addExternal(pluginName, pluginDir + pluginName + '/', 'plugin.js');
	});


	config.allowedContent = false;

	// Setting allowed elements and their attributes, styles and classes.
	// format: elements [attributes]{styles}(classes)
	// the line below allows all attributes and styles for tags p, table etc.
	config.allowedContent = 'p table tbody tr td span div h1 h2 h3 h4 h5 h6 img a ol ul li[*]{*}';
	// the line below prohibits tags b, strong, em, i
	config.disallowedContent = 'b strong em i';

	config.extraPlugins = customPluginNames.join(','); // comma-separated string of custom plugin names
	config.magicline_color = '#ababab';
	config.removePlugins = 'tabletools,table,link,newpage,templates,bold,image';

	// Styles are activated below by means of CKEDITOR.addCss(...).
	//
	// One could do as in the line below as well:
	// config.contentsCss = 'css/editorContent.css';
	// but the problem is that in this case it is difficult to pick up the
	// styles in DRY manner in order to apply them when saving newsletter.
};

/// observe the order of loading: first cssBase and then cssEditor.
/// Both of them are to be applied to the editor content, while
/// cssBase is to be applied to saved newsletters as well.
/// So if cssEditor and cssBase have css attributes in common, those in
/// cssEditor  takes precedence over those in cssBase.
CKEDITOR.addCss(NEWSLETTER.cssBase);
CKEDITOR.addCss(NEWSLETTER.cssEditor);

/**
 * Loads fonts given in
 * {{#crossLink "NEWSLETTER/additionalFonts:property"}}NEWSLETTER.additionalFonts{{/crossLink}}
 * into the configuration.
 *
 * Converts a key-value object into a string of the format
 * <code>"first string to display/first string to use; second string to display/second string to use; ..."</code>
 * as required by [API](http://docs.ckeditor.com/#!/api/CKEDITOR.config-cfg-font_names):
 * <blockquote>The list of fonts names to be displayed in the Font combo in the toolbar.
 * Entries are separated by semi-colons (';'), while it's possible to have more than
 * one font for each entry, in the HTML way (separated by comma).
 * A display name may be optionally defined by prefixing the entries with the name
 * and the slash character. For example, 'Arial/Arial, Helvetica, sans-serif' will
 * be displayed as 'Arial' in the list, but will be outputted as 'Arial, Helvetica, sans-serif'.
 * </blockquote>
 * @method  constructor
  */
var fonts = NEWSLETTER.additionalFonts;
if (fonts){
	var font,
		separ1 = '/',
		separ2 = ';',
		fontArr = [];  // accumulator for properly formatted strings
	for (font in fonts){
		if (fonts.hasOwnProperty(font)){
			fontArr.push(font + separ1 + fonts[font]);
		}
	}
	// gluing the accumulating array and assigning resulting string
	if (CKEDITOR.config.font_names) {
		CKEDITOR.config.font_names += separ2 + fontArr.join(separ2);
	} else {
		CKEDITOR.config.font_names = fontArr.join(separ2);
	}
}
