/**
 * Write
 */

import Config from '../Config.js';
import Util from '../Util.js';
import DropdownLayer from '../DropdownLayer.js';
import ParamInfo from './ParamInfo.js';
import Template from './Template.js';
import Tmpl from 'js-template-string';

class Write{
	constructor( $node, options ){
		this.$node = $node;

		this.dropdownLayer = '';

		this.isSubmit = false;

		this.isReload = false;

		this.articleId = Util.getParams().articleId;

		jQuery.extend( true, Config, options );

		Config.board = ( options.board )? options.board: Config.board;

		Config.isImage = ( options.isImage )?
			options.isImage: Config.isImage;

		this.$node.append( this.template() );

		//create Editor
		this.editor = new window.ui.RWDEditor( jQuery( '#froala-editor' ) );

		this.getCategory();
		this.addEvent();

		//parameter & hash Module - page, query, searchType, articleId
		this.paramInfo = new ParamInfo();
		this.paramInfo.setParamByUrl();

		if( this.articleId ) this.update();
  }

	removeButtonUI() {
		return '<button class="fe-btn fe-remove-button"><i class="fe-icon-close_circle_o"><span hidden="">remove</span></i></button>';
	}

	update(){
		let viewUrl = Tmpl.render({
	      data: {articleId: this.articleId, board: Config.board},
	      template: Config.view
	  });

	  let view = Util.get( viewUrl );
    view.then( ( data ) => {

			let _article = data.article;
			let _uid = _article.writer.loginUser.uid;
			let _title = _article.title;
			let _contents = _article.contents;
			let _$contents = '';

			if( Config.guid == _uid ){
				jQuery( '#title' ).val( _title );

				 _$contents = jQuery( '<div></div>' );
				 _$contents.append( _contents );

				 _$contents.find( '.fe-image-inner .fe-image' ).after( this.removeButtonUI() );

				_$contents.find( '.fe-video .fe-video-inner iframe' ).after( this.removeButtonUI() );

				_$contents.find( '.fe-video, .fe-image' ).addClass( 'fr-deletable' );

				this.editor.insert( _$contents.html() );
			}
		});
	}

	setCategoryUI( data ){
		let tmp = [];
		data.forEach( ( item )=>  {
			if( item.activated ){
				tmp.push({
					'key': item.categoryId,
					'value': item.categoryName
				});
				}
			});

		if( !tmp.length ) return;

		this.dropdownLayer = new DropdownLayer( jQuery( '.board-write-category' ), tmp, 'boardCategory' );
		this.dropdownLayer.setValue( Util.getParams().categoryId|| tmp[ 0 ].key );
	}

	getCategory(){
		let _post = Util.get( Config.category( Config.board ), 'GET' );
		_post.then( ( data ) => {
			this.setCategoryUI( data );
		}, ( data ) => {
			Config.apiError( data );
		});
	}

  submit( data, callback ){

		let _post = '';

		if( !data.title ){
			alert( Config.L10N.alert_empty_title );
			this.enableWriteButton();
			return;
		}

		if( !data.contents ){
			alert( Config.L10N.alert_empty_contents );
			this.enableWriteButton();
			return;
		}

		_post = ( !this.articleId )?
			Util.get( Config.write( Config.board ), 'POST', data ):
			Util.get( Config.update({
				board: Config.board,
				articleId: this.articleId }), 'PUT', data );

		_post.then( ( data ) => {
			callback && callback( data );
		}, ( data ) => {
			Config.apiError( data );
		});
	}

	reset(){
		this.editor.reset();
	}

	getThumbnail() {
		let contents = this.editor.getSubmitContents();
		let _$contents = jQuery( '<div>' );
		_$contents.append( contents );

		let _image = _$contents.find( `.fe-image-inner img:eq( 0 )` ).attr( 'src' ) || ``;
		let _video = _$contents.find( `.fe-video:eq( 0 )` ).attr( 'data-contents-json' ) || ``;

		if( _video ){
			_video = JSON.parse( _video ).video_id;
			_video = `http://img.youtube.com/vi/${_video}/0.jpg`
		}

		return _image || _video || ``;
	}

	disableWriteButton () {
		jQuery( '.boardWriteSubmit' ).attr( 'disabled', true );
	}

	enableWriteButton () {
		jQuery( '.boardWriteSubmit' ).attr( 'disabled', false );
	}

	addEvent(){

		jQuery( window ).on('beforeunload', () => {
			if( this.isSubmit ){
				return;
			}else if( this.isReload ){
				return;
			}else{
				return Config.L10N.alert_cancel_article;
			}

			return;
		});

		jQuery( 'body' ).on( 'click', '.boardWriteSubmit', ( evt ) => {
			evt.preventDefault();

			this.disableWriteButton();

			let contents = this.editor.getSubmitContents();
			let _title = jQuery( '#title' ).val();

			if( this.editor.isImageUploading() ){
				alert( Config.L10N.alert_valid_upload );
				return;
			}

			if( _title.length < 2 ){
				alert( Config.L10N.alert_too_short_title );
				this.enableWriteButton();
				return;
			}

			if( _title.length > 50 ){
				alert( Config.L10N.alert_too_long_title );
				this.enableWriteButton();
				return;
			}

			if( Config.isImage && jQuery( contents ).find( '.fe-image' ).length == 0 ){
				alert( Config.L10N.alert_empty_images );
				this.enableWriteButton();
				return;
			}

			let data = {
				token: this.editor.getToken(),
				title: jQuery( '#title' ).val(),
				contents: contents,
				thumbnail: this.getThumbnail()
			}

			if( this.articleId ){
				data.articleId = this.articleId;
			}

			if( this.dropdownLayer ){
				data.categoryId = this.dropdownLayer.getValue();
			}

			this.submit( data, ( data ) => {
				this.isSubmit = true;
				location.href = Config.listPage + '?' + this.paramInfo.getParamIgnore( 'articleId' );
			});
		});

		jQuery( 'body' ).on( 'click', '.boardWriteCancel', ( evt ) => {
			evt.preventDefault();
			location.href = Config.listPage;
			// Util.confirm( Config.L10N.alert_cancel_article, () => {
			// 	jQuery( '#title' ).val( '' );
			// 	this.reset();
			//
			// 	location.href = Config.listPage;
			// }, () => {});
		});
	}

	template(){
		return `<div class="board-write">
		<form id="boardWriteForm" name="boardWriteForm" action="/board/${Config.board}/article" method="post" autocomplete="off" onSubmit="return false;">
			<input type="hidden" name="articleId" id="articleId" value="${this.articleId}" />
			<div class="co-btn-wrap">
				<div class="left"><button type="button" class="boardWriteCancel co-btn co-btn-write-cancel">${Config.L10N.btn_cancel}</button></div>
				<div class="right"><button type="button" class="boardWriteSubmit co-btn co-btn-write-submit">${Config.L10N.btn_confirm}</button></div>
			</div>

			<div class="board-write-category"></div>

			<div class="board-write-title">
				<input type="text" name="title" id="title" maxlength="50" placeholder="${Config.L10N.title}" />
			</div>

			<div id="froala-editor"></div>

			<div class="co-btn-wrap">
				<div class="left"><button type="button" class="boardWriteCancel co-btn co-btn-write-cancel">${Config.L10N.btn_cancel}</button></div>
				<div class="right"><button type="button" class="boardWriteSubmit co-btn co-btn-write-submit">${Config.L10N.btn_confirm}</button></div>
			</div>

		</form>
		</div>`;
	}

};

module.exports = Write;
