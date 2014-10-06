/*jslint plusplus: true, white: true */
/*global Unit, CKEDITOR, NEWSLETTER, Properties, LinkProperties, Helper, Selection, FACTORY, Content, Link */

/**
 * Link Controller.
 * @module    Controllers
 * @class     CLink
 * @type      {Object}
 * @since     0.0.5
 * @author    A.Shcherbakov
 */
var CLink = {

	/**
	 * Reads the content of the link insertion dialog, generates links and inserts them into the editor.
	 * @method        convertToLinks
	 * @param         {Object}              context           context of the dialog menu
	 * @param         {Object}              editor            editor instance
	 * @param         {Selection}           selection         instance of Selection class
	 *                                                        Contains objects that user selects in the editor window.
	 * @return        {void}                                  inserts link into the editor
	 */
	convertToLinks: function(context, editor, selection){
		var tabName = 'linkInfoTab';
		var isUnderlined = context.getValueOf(tabName, 'underlined'),
		    isEnabled = context.getContentElement(tabName, 'text').isEnabled(),
		    url = 'http://' + encodeURI(Helper.dropProtocol(context.getValueOf(tabName, 'href'))),
		    target = context.getValueOf(tabName, 'target') ? '_blank' : '_self',
		    title = context.getValueOf(tabName, 'title'),
		    color = context.getValueOf(tabName, 'color'),
		    link, obj,
		    factory = NEWSLETTER.factory;

		// if insertion of text was enabled (i.e. if selection is empty or it is inside an editable link)
		if (isEnabled){
		    link = new Link();
		    link.setHref(url);
		    link.underline(isUnderlined);
		    link.setProperty('target', target);
		    link.setTitle(title);
		    link.setStyleProperty('color', color);
		    link.setContent(new Content(context.getValueOf(tabName, 'text')));
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
		            var newNode, objLink;
		            link = new Link();
		            link.setHref(url);
		            link.underline(isUnderlined);
		            link.setProperty('target', target);
		            link.setTitle(title);
		            link.setStyleProperty('color', color);
		            obj = factory.mimic(el.$);
		            if (obj &&  !obj.isEmpty()){
		                // CKeditor remembers this attr and replaces proper url by this one.
		                // So, if the current object is a Link instance, let us update
		                // value of "data-cke-saved-href"
		                if (obj &&  (obj instanceof Link) && (typeof obj.setProperty === 'function')){
		                    obj.setProperty('data-cke-saved-href', url);
		                }
		                objLink = link.apply(obj);
		                newNode = objLink.toNode();
		                el.$.parentNode.replaceChild(newNode, el.$);
		            }
		        });
		    });
		}
	},

	/**
	 * Populates the field of the link insertion dialog.
	 * @method        fillInDialog
	 * @param         {Object}              context           context of the dialog menu
	 * @param         {Object}              editor            editor instance
	 * @param         {Selection}           selection         instance of Selection class
	 * @return        {void}
	 */
	fillInDialog: function(context, editor, selection){
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
	},

	/**
	 * Collects parameters from link dialog menu.
	 *
	 * The returning object include the following keys:
	 * <dl>
	 * <dt>href</dt><dd>(string) url or email (depending on a scheme)</dd>
	 * <dt>text</dt><dd>(string) hyperlink text</dd>
	 * <dt>title</dt><dd>(string) popup text. It is an optional field.</dd>
     * <dt>underlined</dt><dd>(boolean) whether the link is underlined or not</dd>
     * <dt>target</dt><dd>(boolean) whether the link should be open in a new window</dd>
     * <dt>color</dt><dd>(string) color of the hyperlink text</dd>
	 * </dl>
	 * @method  getDialogData
	 * @param   {Object}        dialog
	 * @return  {Object}
	 */
	getDialogData: function(dialog){
		var tabName = 'linkInfoTab';
		var info = {
			href:       dialog.getValueOf(tabName, 'href'),
			text:       dialog.getValueOf(tabName, 'text'),
			title:      dialog.getValueOf(tabName, 'title'),
			underlined: dialog.getValueOf(tabName, 'underlined'),
			target:     dialog.getValueOf(tabName, 'target'),
			color:      dialog.getValueOf(tabName, 'color')
		};
		return info;
	},

	/**
	 * "Revise" `scheme`.
	 *
	 * Alias of {{#crossLink "Link/revisitScheme:method"}}Link::revisitScheme{{/crossLink}}.

	 * @method  revisitScheme
	 * @param  {String} scheme
	 * @return {String}
	 */
	revisitScheme: function(scheme){

	}
};