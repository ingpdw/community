/**
 * Update
 */

import Config from '../Config.js';
import Util from '../Util.js';
import Template from './Template.js';
import Tmpl from 'js-template-string';

class Update{
	constructor( guid ){
		this.guid = guid;
		this.articleId = Util.getParams().articleId;
		this.selector = '#viewMoreList .co-btn-modify';
		this.show();
		this.addEvent();

  }

	template(){
		return `<li class="more-items"><a href="#" class="co-btn co-btn-modify">수정</a></li>`;
	}

	show(){
		if( window.guid != this.guid )
			jQuery( this.selector ).hide();
	}

	addEvent(){
		jQuery( 'body' ).on( 'click', '#viewMoreList .co-btn-modify', ( evt ) => {
			evt.preventDefault();
			location.href = Config.writePage + '?articleId=' + this.articleId;
		});
	}
};

module.exports = Update;
