/*jslint plusplus: true, white: true */
/*global CKEDITOR, List, ListItem, NEWSLETTER*/

/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function(config){
	// language
	config.language = 'en';
	config.defaultLanguage = config.language;
	// size
	config.width = '850px';
	config.height = '650px';

	// when pressing "ENTER", <br> is inserted, not <p>
	config.enterMode = CKEDITOR.ENTER_BR;

	config.disableObjectResizing = true;

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
			'selection', 'bold2', 'italic2', 'underline2', 'strike2', 'info2', 'setScale2'],
		pluginDir =  NEWSLETTER.customPluginDir;

	customPluginNames.forEach(function(pluginName){
		CKEDITOR.plugins.addExternal(pluginName, pluginDir + pluginName + '/', 'plugin.js');
	});


	config.allowedContent = true;

	config.extraPlugins = customPluginNames.join(','); // comma-separated string of custom plugin names
	config.magicline_color = '#ababab';
	config.removePlugins = 'tabletools,table,link,save,newpage,templates,bold,image';

	//
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