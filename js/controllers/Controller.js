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
			console.log(pages);
		for (pageId in pages){
			if (pages.hasOwnProperty(pageId)){
				elems = pages[pageId];
				pageContent = {};
				for (elemId in elems){
					if (elems.hasOwnProperty(elemId)){
						if (considerAll || types.indexOf(elems[elemId].type) !== -1){
							var value = dialog.getValueOf(pageId, elemId);
							if (value !== undefined){
								pageContent[elemId] = dialog.getValueOf(pageId, elemId);
							}

						}
					}
				}
				data[pageId] = pageContent;
			}
		}
		console.log('dailog data: ', data);
		return data;
	};


	/**
	 * Populates the field of the dialog menu. `data` must be of a format described in
	 * {{#crossLink "Controller/getDialogData:method"}}getDialog{{/crossLink}} method.
	 * If a key has undefined value, then it is not takedn into consideration.
	 * @method        fillInDialog
	 * @param         {Object}              data              data to be inserted,
	 *                                                        {{#crossLink "Controller/getDialogData:method"}}getDialog{{/crossLink}}
	 * @return        {void}
	 */
	this.fillInDialog = function(dialog, data){
		var pageId, page, elemId, value;
		for (pageId in data){
			if (data.hasOwnProperty(pageId)){
				page = data[pageId];
				for (elemId in page){
					if (page.hasOwnProperty(elemId)){
						value = page[elemId];
						if (value !== undefined){
							try {
								dialog.setValueOf(pageId, elemId, value);
							} catch (e){
								console.log('Error (' + e.name + ') in filling in the dialog menu: ' + e.message);
							}
						}
					}
				}
			}
		}
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