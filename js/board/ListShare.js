/**
 * ListCategory
 */

import DropdownLayer from '../DropdownLayer';
import Config from '../Config';
import Util from '../Util';
import Template from './Template';
import Observer from 'js-observer';

class ListShare{
	constructor( $node, options ) {
		this.$node = $node;
		this.options = options;
		this.init();
		this.addEvent();
	}

	setValue( val ) {
		this.dropdownLayer.setValue( val );
	}

	addEvent() {
		jQuery( 'body' ).on( 'click', '.co-btn-share', ( evt ) => {
			evt.preventDefault();
			evt.stopPropagation();

			let _parent = jQuery( evt.target ).parents( 'li' );
			let $desc = _parent.find( '.desc' );
			let msg = $desc.text();
			let url = $desc.find( 'a' ).attr( 'href' );
			let breakpoint = this.options.breakpoint;
			let windowWidth = jQuery( window ).width();

			this.share.resetOptions( {msg: msg, url: url} );
			if( breakpoint && windowWidth <= breakpoint ){
				this.share.$shareRoot.addClass( 'active' );
			}
		});
	}

	init() {
		if( nc && nc.uikit && nc.uikit.ShareV2 ){
			this.share = new nc.uikit.ShareV2({
				$parent: this.$node,
				appid: this.options.appid || '',
				appver: this.options.appver || '',
				appname: this.options.appname || '',
				img: this.options.img || '',
				breakpoint: this.options.breakpoint || '',
				msg: this.options.msg || '',
			});
		}
		//to hide shareButton
		console.log( this.$node );
		this.$node.css({border:0, height:0});
	}
};

module.exports = ListShare;
