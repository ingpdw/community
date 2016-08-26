/**
 * List
 */

import Config from '../Config.js';
import Util from '../Util.js';
import Template from './Template.js';
import Tmpl from 'js-template-string';

let instance = '';

class Report {

	constructor( $parent, writer ) {
		this.$id = 'ncCommunityReport';
		this.maxCount = 20;
		this.$node = jQuery( Template.report( this.$id ) );
		this.$modal = jQuery( Template.modal( this.$id + 'Modal' ) );
		this.articleId = Util.getParams().articleId;
		this.commentId = '';
		this.writer = writer;
		$parent.append( this.$modal, this.$node );
		this.addEvent();

		if( !instance ){
			instance = this;
		}

		return instance;
  }

	setUser( writer ) {
		this.writer = writer;
	}

	getUser() {
		return this.writer;
	}

	show() {
		//모든 layer hide
		jQuery( '.co-layer-container' ).removeClass( 'is-active' );
		jQuery( '.co-layer-modal' ).removeClass( 'is-active' );

		this._reportedCount(( data )=>{
			if( data != this.maxCount && data != -1 ){
				this.$node.find( '.wrap-count .count' ).text( this.maxCount - data );
				this.$node.find( '.target' ).text( this.writer );
				this.$node.addClass( 'is-active' );
				this.$modal.addClass( 'is-active' );
			}else if( data == -1 ){
				alert( '이미 신고하신 글입니다.' );
			}else{
				alert( '오늘 하루 신고 횟수를 초과했습니다.' );
			}
		});
	}

	hide() {
		this.$node.removeClass( 'is-active' );
		this.$modal.removeClass( 'is-active' );
	}

	_reportedCount( callback ){
		let _get = Util.get( Config.todayReportedCount(), 'GET' );
		_get.then( ( data ) => {
			callback && callback( data );
		}, ( data ) => {
			Config.apiError( data );
		})
	}

	addEvent(){
		//메뉴
		jQuery( 'body' ).on( 'click', '#viewMoreList .co-btn-report', ( evt ) => {
			evt.preventDefault();
			this.show();
		});

		//닫기 버튼
		jQuery( 'body' ).on( 'click', `#${this.$id} .co-btn-close`, ( evt ) => {
			evt.preventDefault();
			this.hide();
		});

		//취소 버튼
		jQuery( 'body' ).on( 'click', `#${this.$id} .reportCancel`, ( evt ) => {
			evt.preventDefault();
			this.hide();
		});

		//need to work L10N msg
		jQuery( 'body' ).on( 'click', `#${this.$id} .reportFinish`, ( evt ) => {
			evt.preventDefault();
			let value = jQuery( ':radio[name="reportCase"]:checked' ).val();
			if( !value ){
				alert( Config.L10N.report_reason );
				return;
			}

			this.submit({
				reason: value
			}, ( data )=>{
				if( data == -1 ){
					alert( '이미 신고하신 글입니다.' );
				}else{
					alert( Config.L10N.report_have_done );
				}
				this.hide();
			});
		});
	}

  submit( data, callback ) {
		let _post = Util.get( Config.reportArticle({
			board: Config.board,
			articleId: this.articleId}), 'POST', data );
		_post.then( ( data ) => {
			callback && callback( data );
		}, ( data ) => {
			Config.apiError( data );
		});
	}
};

module.exports = Report;
