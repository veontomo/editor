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
			href = 'http://' + encodeURI(Helper.dropProtocol(linkInfo.linkInfoTab.href));
		} else {
			href = 'mailto:' + encodeURI(Helper.dropProtocol(linkInfo.linkInfoTab.href));
		}
		// if insertion of text was enabled (i.e. if selection is empty or it is inside an editable link)
		if (linkInfo.linkInfoTab.status){
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
	this.fillInDialog_old = function(context, selection){
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
	 * Returns an object with the following keys:<dl>
	 * <dt>href</dt><dd> (String) value of the link "href" attribute</dd>
	 * <dt>scheme</dt><dd> (String) scheme (mail or link)</dd>
	 * <dt>color</dt><dd>(String) link color</dd>
	 * <dt>isUnderlined</dt><dd>(Boolean) whether the link is underlined</dd>
	 * <dt>isCompound</dt><dd>(Boolean) whether the link content contains more that one element</dd>
	 * <dt>target</dt><dd> (String) in what window the link is supposed to be open</dd>
	 * <dt>text</dt><dd> (String) string representation of the link content</dd>
	 * <dt>title</dt><dd> (String) title attribute</dd>
	 * </dl>
	 * @method         dialogToTemplate
	 * @param          {Object}        obj
	 * @return         {Object}
	 */
	this.dialogToTemplate = function(obj){
		var tabName = 'linkInfoTab',
			template = {
				href:          obj[tabName].href,
				scheme:        obj[tabName].scheme,
				color:         obj[tabName].color,
				isUnderlined:  obj[tabName].isUnderlined,
				isCompound:    obj[tabName].status,
				target:        obj[tabName].isNewWindow ? '_blank' : '_self',
				title:         obj[tabName].title
			};
		return template;
	};

	/**
	 * Converts output of link {{#crossLink "Link/template:method"}}template{{/crossLink}} method
	 * into an object accepted by link dialog menu, that is into a format described by
	 * {{#crossLink "Controller/getDialogData:method"}}getDialogData{{/crossLink}}.
	 * @method         templateToDialog
	 * @param          {Object}        template
	 * @return         {Object}
	 * @since          0.0.7
	 */
	this.templateToDialog = function(template){
		var dialogData,
			tabName = 'linkInfoTab';
		dialogData = {};
		dialogData[tabName] = {
			href:          template.href,
			scheme:        template.scheme,
			color:         template.color,
			isUnderlined:  template.isUnderlined,
			status:        template.isCompound ,
			isNewWindow:   template.target ==='_blank' ,
			title:         template.title,
		};
		return dialogData;
	};

	/**
	 * Returns instance of {{#crossLink "Link"}}Link{{/crossLink}} corresponding to a DOM.Element
	 * inside which the cursor is situated. If no link is found, nothing is returned.
	 * @method        getLink
	 * @param         {Object}              editor            editor instance
	 * @return        {Link}
	 */
	this.getLink = function(editor){
		var linkElem = this.findParentLink(editor);
		console.log('linkElem: ', linkElem);
		if (linkElem){
			var factory = NEWSLETTER.factory,
				link = factory.mimic(linkElem);
			return link;
		}
	};


	/**
	 * Returns the nearest (for current cursor position) parent link. If no link is found among ancestors, `null`
	 * is returned.
	 *
	 * Sought element has tag `a`.
	 *
	 * @method         findParentLink
	 * @param          {CKEDITOR}      editor
	 * @return         {DOM.Node}
	 */
	this.findParentLink = function(editor){
		var elem = editor.getSelection().getStartElement(),
			criteria = function(el){return el.tagName.toLowerCase() === 'a';};
		if (elem){
			return this.findAscendant(elem.$, criteria);
		}
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
	this.getDialogData = function(dialog){
		var c = new Controller();
		var dialogData = c.getDialogData(dialog);
		dialogData.linkInfoTab.status = true;
		return dialogData;
	};

	/**
	 * Fills in `dialog` window based on information  `selection`.
	 * @method         fillInDialogWithSelection
	 * @param          {CKEDITOR.dialog}     dialog           [CKEDITOR.dialog](http://docs.ckeditor.com/#!/api/CKEDITOR.dialog)
	 * @param          {CKEDITOR}            editor           [CKEDITOR](http://docs.ckeditor.com/#!/api/CKEDITOR)
	 * @param          {Selection}           selection        {{#crossLink "Selection"}}Selection{{/crossLink}}
	 * @return         {void}
	 */
	this.fillInDialogWithSelection = function(dialog, editor, selection){
		var link;
		var linkElem, criteria;
		criteria = function(el){
			return el && el.type === CKEDITOR.NODE_ELEMENT && el.getName() === 'a';
		};
		linkElem = selection.findAscendant(criteria);
		console.log(linkElem.$);
		if (linkElem){
			var f = NEWSLETTER.factory;
			link = f.mimic(linkElem.$);
		} else {
			link = new Link();
		}
		console.log(link.template());
		this.fillInDialog(dialog, link.template());
	};
}
CLink.prototype = Object.create(Controller.prototype);