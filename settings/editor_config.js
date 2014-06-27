/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global CKEDITOR, List, ListItem*/

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

	config.allowedContent = true;

	config.extraPlugins = 'download,image2,table2,link2,upload,olist2,ulist2,selection,bold2,italic2,underline2,strike2';
	/*config.extraPlugins = 'abbr';*/
	config.magicline_color = '#ababab';

	config.removePlugins = 'tabletools,table,link,save,newpage,templates,bold,image';
	config.contentsCss = 'css/editorContent.css';
};

