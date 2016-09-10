/**
 * NoticeList
 */

import Config from '../Config';
import Util from '../Util';
import Template from './Template';
import Tmpl from 'js-template-string';

class NoticeList{
	constructor( node ){
		this.$node = node;
		this._id = this.$node.attr( 'id' );
		this.listId = 'ncCommunityNoticeList';

		this.$_node = jQuery( `<div class="${this.listId} board-notice"></div>` );
		this.$node.append( this.$_node );
  }

	remove() {
		this.$_node.remove();
	}

  get(){
		let list = Util.get( Config.noticeList({
			board: Config.board
		}), 'GET' );

    list.then( ( data ) => {
			let tmp = '';

			//empty data
			if( data.length == 0 ){
				this.remove();
			}else{
				tmp = Template.noticeList( data );
				this.$_node.append( tmp );
			}

			this.$_node.slick({
				arrows: true,
				dots: true,
				prevArrow: '<button class="co-slick-arrow co-slick-prev"><i class="fe-icon-chevron_left"></i></button>',
				nextArrow: '<button class="co-slick-arrow co-slick-next"><i class="fe-icon-chevron_right"></i></button>',
				// autoplay: true,
				autoplaySpeed: 2500,
			});

    }, () => {

		})
  }

};

module.exports = NoticeList;
