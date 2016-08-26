/**
 * List
 */

import Config from '../Config.js';
import Util from '../Util.js';
import Template from './Template.js';
import Tmpl from 'js-template-string';

class ViewMenu{
	constructor(){
		//this.setUI();
		this.addEvent();
  }

	addEvent(){
		jQuery( 'body' ).on( 'click', '#ncCommunityMoreButton', ( evt ) => {
			evt.preventDefault();
			let _$target = jQuery( evt.currentTarget );
			( _$target.hasClass( 'is-active' ) )?
				_$target.removeClass( 'is-active' ):
				_$target.addClass( 'is-active' );
		}).trigger( 'click' );
	}

};

module.exports = ViewMenu;
