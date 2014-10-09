/*jslint plusplus: true, white: true */
/*global Unit, CKEDITOR, NEWSLETTER, Properties, LinkProperties, Helper, Selection, FACTORY, Content, Link */

/**
 * Base controller class.
 * @module    Controllers
 * @class     Controller
 * @type      {Object}
 * @since     0.0.7
 * @author    A.Shcherbakov
 */
function Controller(){

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
	 * @param          {CKEDITOR.dialog}  dialog 		See [dialog definition](http://docs.ckeditor.com/#!/api/CKEDITOR.dialog).
	 * @param          {Array}            types         array of strings standing for dialog field types.
	 * @return         {Object}
	 */
	this.getDialogData = function(dialog, types){
		var data = {},
			pages = dialog._.contents,
			pageId,
			elems, elemId, pageContent,
			considerAll = types === undefined  || !Array.isArray(types); // whether all dialog fields should be considered
		for (pageId in pages){
			if (pages.hasOwnProperty(pageId)){
				elems = pages[pageId];
				pageContent = {};
				for (elemId in elems){
					if (elems.hasOwnProperty(elemId)){
						if (considerAll || types.indexOf(elems[elemId].type) !== -1){
							pageContent[elemId] = dialog.getValueOf(pageId, elemId);
						}
					}
				}
				data[pageId] = pageContent;
			}
		}
		return data;
	};


	/**
	 * Populates the field of the dialog menu.
	 * @method        fillInDialog
	 * @param         {Object}              data              data to be inserted
	 * @return        {void}
	 */
	this.fillInDialog = function(dialog, data){
		var pageId, page, elemId;
		for (pageId in data){
			if (data.hasOwnProperty(pageId)){
				page = data[pageId];
				for (elemId in page){
					if (page.hasOwnProperty(elemId)){
						dialog.setValueOf(pageId, elemId, page[elemId]);
					}
				}
			}
		}
	};


	/**
	 * Adapter.
	 *
	 * Converts from what dialog menu outputs to what is required to configure a {{#crossLink "Tag"}}Tag{{/crossLink}}
	 * instance properly.
	 *
	 * Current implementation is merely trivial tranformation: `obj` -> `obj`. It is supposed that in case of necessity,
	 * this method is to be overriden by inherited classes.
	 *
	 * @method         adapter
	 * @param          {Object}        obj
	 * @return         {Object}
	 * @since          0.0.7
	 */
	this.adapter = function(obj){
		return obj;
	};

	/**
	 * Inverse adapter.
	 *
 	 * Converts from what is required to configure a {{#crossLink "Tag"}}Tag{{/crossLink}}
	 * instance properly to what dialog menu requires.
	 *
	 * It is supposed that in case of necessity,  this method is to be overriden by inherited classes.
	 *
	 * @method  adapterInverse
	 * @param          {Object}        obj
	 * @return         {Object}
	 * @since          0.0.7
	 */
	this.adapterInverse = function(obj){
		return obj;
	};
}