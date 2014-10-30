/*jslint plusplus: true, white: true */
/*global Unit, CKEDITOR, Helper, Controller, Link, Content, NEWSLETTER */

/**
 * Link Controller.
 * @module    Controllers
 * @class     CLink
 * @type      {Object}
 * @since     0.0.5
 * @author    A.Shcherbakov
 */
function CLink() {
 	"use strict";
 	if (!(this instanceof CLink)) {
 		return new CLink();
 	}
 	Controller.call(this);



	/**
	 * Reads the content of the link insertion dialog, generates links and inserts them into the editor.
	 * @method        convertToLinks
	 * @param         {Object}              context           context of the dialog menu
	 * @param         {Object}              editor            editor instance
	 * @param         {String}              scheme            stands for `mail` or `link`
	 * @return        {void}                                  inserts link into the editor
	 */
	this.convertToLinks = function(context, editor, scheme){
		var href, link, obj, linkInfo,
		    factory = NEWSLETTER.factory,
		    selection = new Selection(editor);
		linkInfo = this.getDialogData(context);
		console.log(linkInfo);
		if (scheme === 'link'){
			href = 'http://' + encodeURI(Helper.dropProtocol(linkInfo.href));
		} else {
			href = 'mailto:' + encodeURI(Helper.dropProtocol(linkInfo.href));
		}
		// if insertion of text was enabled (i.e. if selection is empty or it is inside an editable link)
		if (linkInfo.status){
		    link = new Link();
		    link.setHref(href);
		    link.underline(linkInfo.underlined);
		    link.setProperty('target', linkInfo.target ? '_blank' : '_self');
		    link.setTitle(linkInfo.title);
		    link.setStyleProperty('color', linkInfo.color);
		    link.setContent(new Content(linkInfo.text));
		    if (selection.isEmpty()){
		        editor.insertHtml(link.toHtml());
		    } else {
		        obj = selection.nodes[0][0];
		        obj.$.parentNode.replaceChild(link.toNode(), obj.$);
		    }
		} else {
		    // parse all selected nodes
		    selection.nodes.forEach(function(arr){
		        arr.forEach(function(el){
		            var newNode, objLink, elProps, linkProps,
		            	dom = new Dom();
		            elProps = dom.getInheritedProperties(el.$);
		            link = new Link();
		            elProps.suggestProperty(link.getProperties());
		            console.log('inherited styles: ', elProps.toString());
		            link.setProperties(elProps);
		            link.setHref(href);
		            link.underline(linkInfo.underlined);
		            link.setProperty('target', linkInfo.target ? '_blank' : '_self');
		            link.setTitle(linkInfo.title);
		            // link.setStyleProperty('color', linkInfo.color);
		            obj = factory.mimic(el.$);
		            if (obj &&  !obj.isEmpty()){
		                // CKeditor remembers this attr and replaces proper url by this one.
		                // So, if the current object is a Link instance, let us update
		                // value of "data-cke-saved-href"
		                if (obj &&  (obj instanceof Link) && (typeof obj.setProperty === 'function')){
		                    obj.setProperty('data-cke-saved-href', href);
		                }

		                objLink = link.apply(obj);
		                newNode = objLink.toNode();
		                el.$.parentNode.replaceChild(newNode, el.$);
		            }
		        });
		    });
		}
	};

	/**
	 * Populates the field of the link insertion dialog.
	 * @method        fillInDialog
	 * @param         {Object}              context           context of the dialog menu
	 * @param         {Selection}           selection         instance of Selection class
	 * @return        {void}
	 */
	this.fillInDialog = function(context, selection){
		var text = selection.toText(),
		    href = '',
		    isEnabled = selection.isEditable(),
		    link,
		    tabName = 'linkInfoTab';

		if (selection.startsInsideLink()){
		    link = selection.getStartElement().getAscendant('a', true);
		    href = link.getAttribute('href');
		}
		// if the selection is nothing but a link, then pick up its title
		// and find out whether the link is underlined or not
		if (isEnabled && !selection.isEmpty()){
			link = selection.nodes[0][0];
			var linkModel = new Link();
			// linkModel.flushProperties();   // get rid of possible default link properties
			linkModel.load(link.$);
			var title = linkModel.getProperty('title');
			var isUnderlined = linkModel.isUnderlined();
		    // var title = selection.nodes[0][0].getAttribute('title');
		    context.setValueOf(tabName, 'title', title);
	    	context.setValueOf(tabName, 'underlined', isUnderlined);
	    	if (linkModel.hasStyleProperty('color')){
	    		context.setValueOf(tabName, 'color', linkModel.getStyleProperty('color'));
	    	}
		}

		if (!isEnabled){
		    context.getContentElement(tabName, 'text').disable();
		}
		context.setValueOf(tabName, 'text', text);
		context.setValueOf(tabName, 'href', Helper.dropProtocol(href));
	};


	/**
	 * Converts information collected from the link dialog menu into format defined by
	 * {{#crossLink "Link/template:method"}}Link::template{{/crossLink}} method.
	 *
	 * Overrides {{#crossLink "Controller"}}base class{{/crossLink}} definition of
	 * {{#crossLink "Controller/dialogToTemplate:method"}}dialogToTemplate{{/crossLink}}.
 	 * The returning object include the following keys:
	 * <dl>
	 * <dt>rows</dt><dd>number of table rows</dd>
	 * <dt>cols</dt><dd>number of table columns</dd>
	 * <dt>tableBorderWidth</dt><dd>{{#crossLink "Unit"}}Unit{{/crossLink}} instance for table border width</dd>
	 * <dt>tableBorderColor</dt><dd>string for table border color</dd>
	 * <dt>phantomBorderWidth</dt><dd>{{#crossLink "Unit"}}Unit{{/crossLink}} instance for width around table rows</dd>
     * <dt>phantomBorderColor</dt><dd>string for the border around table rows</dd>
     * <dt>cellBorders</dt><dd>boolean variables for borders around table cells:
     * 		<code>leftVer</code>, <code>rightVer</code>, <code>intVer</code>,
     *   	<code>topHor</code>, <code>bottomHor</code>, <code>intHor</code>
     * </dd>
     * <dt>cellBorderWidth</dt><dd>{{#crossLink "Unit"}}Unit{{/crossLink}} instance for border width around table cells</dd>
     * <dt>cellBorderColor</dt><dd>string for border color around table cells</dd>
     * <dt>globalTableBgColor</dt><dd>string for table background color</dd>
     * <dt>spaceTableGlobal</dt><dd>{{#crossLink "Unit"}}Unit{{/crossLink}} instance for the table margin</dd>
     * <dt>paddingTableGlobal</dt><dd>{{#crossLink "Unit"}}Unit{{/crossLink}} instance for the table padding</dd>
     * <dt>spaceBtwRows</dt><dd>{{#crossLink "Unit"}}Unit{{/crossLink}} instance to set vertical spacing between rows
     * (horizontal is set to 0 px)</dd>
     * <dt>spaceCell</dt><dd>{{#crossLink "Unit"}}Unit{{/crossLink}} instance for table cells padding </dd>
	 * <dt>cellWeights</dt><dd>array of (non-negative) numbers that have meaning of weights with which columns contribute
	 * to the total table width</dd>
	 * </dl>
	 * @method         dialogToTemplate
	 * @param          {Object}        obj
	 * @return         {Object}
	 */
	this.dialogToTemplate = function(obj){
		var defaultUnit = 'px';
		var tableInfo = {
			rows:                 parseInt(obj.structure.rows, 10),
			cols:                 parseInt(obj.structure.cols, 10),
			tableBorderWidth:     new Unit(parseInt(obj.borders.globalBorderWidth, 10), defaultUnit),
			tableBorderColor:     obj.borders.globalBorderColor,
			phantomBorderWidth:   new Unit(parseInt(obj.borders.rowBorderWidth, 10), defaultUnit),
			phantomBorderColor:   obj.borders.rowBorderColor,
			cellBorders: {
				leftVer:   obj.borders.leftVerBord,
				rightVer:  obj.borders.rightVerBord,
				intVer:    obj.borders.intVerBord,
				topHor:    obj.borders.topHorBord,
				bottomHor: obj.borders.bottomHorBord,
				intHor:    obj.borders.intHorBord,
			},
			cellBorderWidth:    new Unit(parseInt(obj.borders.cellBorderWidth, 10), defaultUnit),
			cellBorderColor:    obj.borders.cellBorderColor,
			globalTableBgColor: obj.background.globalTableBgColor,
			spaceTableGlobal:   new Unit(parseInt(obj.spaces.spaceTableGlobal, 10), defaultUnit),
			paddingTableGlobal: new Unit(parseInt(obj.spaces.paddingTableGlobal, 10), defaultUnit),
			spaceBtwRows:       new Unit(parseInt(obj.spaces.spaceBtwRows, 10), defaultUnit),
			spaceCell:          new Unit(parseInt(obj.spaces.spaceCell, 10), defaultUnit),
			width:              obj.width,
		};
		// adding key cellWeights for
		var cellWeights = [];
		if (obj.colWeights){
			var colId;
			for (colId in obj.colWeights){
				if (obj.colWeights.hasOwnProperty(colId)){
					cellWeights.push(parseFloat(obj.colWeights[colId]));
				}
			}
		} else {
			// creating array of 1's whose number is equal to number of table columns
			var arrTmp = new Array(tableInfo.cols + 1); // dumb array of specified length
			cellWeights = arrTmp.join(1).split('').map(function(el){return parseFloat(el);});
		}
		tableInfo.cellWeights = cellWeights;
		return tableInfo;
	};

	/**
	 * Converts output of table {{#crossLink "Table/template:method"}}template{{/crossLink}} method
	 * into an object accepted by table dialog menu, that is into a format described by
	 * {{#crossLink "Controller/getDialogData:method"}}getDialogData{{/crossLink}}.
	 * @method         templateToDialog
	 * @param          {Object}        template
	 * @return         {Object}
	 * @since          0.0.7
	 */
	this.templateToDialog = function(template){
		var dialogData = {
			structure: {
				rows: template.rows,
				cols: template.cols
			},
			background: {
				globalTableBgColor: template.globalTableBgColor
			},
			borders: {
				cellBorderColor: template.cellBorderColor,
				globalBorderColor: template.tableBorderColor,
				rowBorderColor: template.rowBorderColor,
				rowBorderWidth: (new Unit(template.rowBorderWidth || 0)).getValueAsString(),
				cellBorderWidth: (new Unit(template.cellBorderWidth || 0)).getValueAsString(),
				globalBorderWidth: (new Unit(template.tableBorderWidth || 0)).getValueAsString(),
				bottomHorBord: template.cellBorders.bottomHor,
				intHorBord: template.cellBorders.intHor,
				intVerBord: template.cellBorders.intVer,
				leftVerBord: template.cellBorders.leftVer,
				rightVerBord: template.cellBorders.rightVer,
				topHorBord: template.cellBorders.topHor
			},
			spaces: {
				paddingTableGlobal: (new Unit(template.paddingTableGlobal || 0)).getValueAsString(),
				spaceBtwRows:       (new Unit(template.spaceBtwRows || 0)).times(2).getValueAsString(),
				spaceCell:          (new Unit(template.spaceCell || 0)).getValueAsString(),
				spaceTableGlobal:   (new Unit(template.spaceTableGlobal || 0)).getValueAsString()
			},
		};
		// filling in column weight fields: corresponding text input fields are called
		// "col0", "col1" etc.
		var weigths = template.cellWeights;
		try {
			var tmp = Helper.divideByGcd(weigths);
			weigths = tmp;
		} catch (e){
			console.log('Error (' + e.name + ') when cancelling common factors of column widths: ' + e.message);
		}
		if (Array.isArray(weigths)){
			dialogData.colWeights = {};
			weigths.forEach(function(val, ind){
				dialogData.colWeights['col' + ind.toString()] = val.toString();
			});
		}
		return dialogData;
	};


	/**
	 * Collects parameters from link dialog menu.
	 *
	 * The returning object include the following keys:
	 * <dl>
	 * <dt>href</dt><dd>(string) url or email (depending on a scheme)</dd>
	 * <dt>text</dt><dd>(string) hyperlink text</dd>
	 * <dt>status</dt><dd>(boolean) whether text field is enabled</dd>
	 * <dt>title</dt><dd>(string, optional) popup text</dd>
     * <dt>underlined</dt><dd>(boolean) whether the link is underlined or not</dd>
     * <dt>target</dt><dd>(boolean) whether the link should be open in a new window</dd>
     * <dt>color</dt><dd>(string) color of the hyperlink text</dd>
	 * </dl>
	 * @method  getDialogData
	 * @param   {Object}        dialog
	 * @return  {Object}
	 */
	// this.getDialogData = function(dialog){
	// 	var tabName = 'linkInfoTab';
	// 	var linkInfo = {
	// 		href:       dialog.getValueOf(tabName, 'href'),
	// 		text:       dialog.getValueOf(tabName, 'text'),
	// 		status:     dialog.getContentElement(tabName, 'text').isEnabled(),
	// 		title:      dialog.getValueOf(tabName, 'title'),
	// 		underlined: dialog.getValueOf(tabName, 'underlined'),
	// 		target:     dialog.getValueOf(tabName, 'target'),
	// 		color:      dialog.getValueOf(tabName, 'color')
	// 	};
	// 	return linkInfo;
	// };
}