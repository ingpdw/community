/**
 * List
 */

import Config from '../Config.js';
import Util from '../Util.js';
import Template from './Template.js';
import Tmpl from 'js-template-string';

class ViewMenu{
	constructor( $parent, isNotice ){
		//this.setUI();
		this.$parent = $parent;
		this._id = this.$parent.attr( 'id' );
		if( isNotice )
			this.remove();

		this.addEvent();
  }

	remove(){
		jQuery( `#${this._id} .ncCommunityMoreButton` ).hide();
	}

	addEvent(){
		jQuery( 'body' ).on( 'click', `#${this._id} .ncCommunityMoreButton`, ( evt ) => {
			evt.preventDefault();
			let _$target = jQuery( evt.currentTarget );
			( _$target.hasClass( 'is-active' ) )?
				_$target.removeClass( 'is-active' ):
				_$target.addClass( 'is-active' );
		}).trigger( 'click' );
	}

};

module.exports = ViewMenu;
