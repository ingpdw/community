/**
 * Submit
 */

import Config from './Config.js';

class Submit{
	constructor () {}

	beforeSubmit( code ){
		//remove removeButton
		//let reg = new RegExp( /\<button class=\"fe-btn fe-remove-button\"\>.+?\<\/button\>/, 'g' );
		//code = code.replace( reg, '' );

		//add data-contents-type attr
		code = code.replace( /\<div\>/g, '<div data-contents-type="text">');

		let _$contents = jQuery( '<div></div>' );
		_$contents.append( code );

		_$contents.find( 'button.fe-remove-button' ).remove();
		_$contents.find( '.fr-deletable' ).removeClass( 'fr-deletable' );

		code = _$contents.html();

		return code;
	}
};

module.exports = Submit;
