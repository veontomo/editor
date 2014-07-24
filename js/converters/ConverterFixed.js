/*jslint plusplus: true, white: true */
/*global */

/**
 * Methods of this class convert into fixed format.
 * @module 	    HtmlElements
 * @class  		ConverterFixed
 * @since       0.0.5
 * @author      A.Shcherbakov
 */

function ConverterFixed(){
	"use strict";
	if (!(this instanceof ConverterFixed)) {
		return new ConverterFixed();
	}


	/**
	 * Converts `content` into fixed format. It means that all units of measure must be expressed in pixels.
	 *
	 * For the moment the action of this method is trivial.
	 * @method         convertToFixed
	 * @param          {DOM.Node}           content
	 * @return         {DOM.Node}
	 */
	this.convert = function(content){
		return content;
	};

}
