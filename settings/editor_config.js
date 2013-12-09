/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
	// language
	config.language = 'it';
	config.defaultLanguage = config.language;
	// size
	config.width = '850px';
	config.height = '500px';
	// when pressing "ENTER", <br> is inserted, not <p>
	config.enterMode = CKEDITOR.ENTER_BR;

	config.disableObjectResizing = true;

	config.toolbarGroups = [
		{ name: 'clipboard',   groups: [ 'clipboard', 'undo' ] },
		{ name: 'editing',     groups: [ 'find', 'selection', 'spellchecker' ] },
		{ name: 'document',	   groups: [ 'mode', 'document', 'doctools' ] },
		{ name: 'others' },
		'/',
		{ name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
		{ name: 'paragraph',   groups: [ 'list', 'indent', 'blocks', 'align' ] },
		{ name: 'styles' },
		{ name: 'colors' },
	];

	/*config.toolbar = [
	    [ 'Source', '-', 'Preview', '-', 'Templates' ],
	    [ 'Cut', 'Copy', 'Paste', 'PasteText', '-', 'Undo', 'Redo' ],
	    [ 'list', 'indent', 'blocks', 'align'],
	    [ 'Bold', 'Italic' ]
	];*/
	
	config.allowedContent = true;

	config.extraPlugins = 'download,image2,table2,link2,list2,upload';
	/*config.extraPlugins = 'abbr';*/
	config.magicline_color = '#ababab';

	config.removePlugins = 'tabletools,table,link';


};

