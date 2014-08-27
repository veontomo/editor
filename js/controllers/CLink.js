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
		var isUnderlined = context.getValueOf('tab-general', 'underlined'),
		    isEnabled = context.getContentElement('tab-general', 'text').isEnabled(),
		    url = 'http://' + encodeURI(Helper.dropProtocol(context.getValueOf('tab-general', 'href_input_field'))),
		    target = context.getValueOf('tab-general', 'target') ? '_blank' : '_self',
		    optionalTitle = context.getValueOf('tab-general', 'optionalTitle'),
		    link, obj,
		    factory = NEWSLETTER.factory;

		// if insertion of text was enabled (i.e. if selection is empty or it is inside an editable link)
		if (isEnabled){
		    link = new Link();
		    link.setHref(url);
		    link.underline(isUnderlined);
		    link.setProperty('target', target);
		    link.setTitle(optionalTitle);
		    link.setContent(new Content(context.getValueOf('tab-general', 'text')));
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
		            link.setTitle(optionalTitle);
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
		    link;

		if (selection.startsInsideLink()){
		    link = selection.getStartElement().getAscendant('a', true);
		    href = link.getAttribute('href');
		}
		// if the selection is nothing but a link, then pick up its title
		// and find out whether the link is underlined or not
		if (isEnabled && !selection.isEmpty()){
			var link = selection.nodes[0][0];
			var linkModel = new Link();
			// linkModel.flushProperties();   // get rid of possible default link properties
			linkModel.load(link.$);
			var title = linkModel.getProperty('title');
			var isUnderlined = linkModel.isUnderlined();
		    // var title = selection.nodes[0][0].getAttribute('title');
		    context.setValueOf('tab-general', 'optionalTitle', title);
	    	context.setValueOf('tab-general', 'underlined', isUnderlined);
		}

		if (!isEnabled){
		    context.getContentElement('tab-general', 'text').disable();
		}
		context.setValueOf('tab-general', 'text', text);
		context.setValueOf('tab-general', 'href_input_field', Helper.dropProtocol(href));

	}
};