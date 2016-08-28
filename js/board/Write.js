/**
 * Write
 */

import Config from '../Config.js';
import Util from '../Util.js';
import DropdownLayer from '../DropdownLayer.js';
import Template from './Template.js';
import Tmpl from 'js-template-string';

class Write{
	constructor( $node, options ){
		this.$node = $node;
		this.articleId = Util.getParams().articleId;
		Config.board = ( options.board )? options.board: Config.board;
		this.$node.append( this.template() );

		//create Editor
		this.editor = new window.ui.RWDEditor( jQuery( '#froala-editor' ) );

		this.getCategory();
		this.addEvent();

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

			if( window.guid == _uid ){
				jQuery( '#title' ).val( _title );
				_$contents = jQuery( '<div>' );
				_$contents.append( _contents );

				_$contents.find( '.fe-image-inner .fe-image' ).after( this.removeButtonUI() );

				_$contents.find( '.fe-video .fe-video-inner iframe' ).after( this.removeButtonUI() );

				_$contents = _$contents.clone().html();
				this.editor.insert( _$contents );
			}
		});
	}

	setCategoryUI( data ){
		let tmp = [];
		for( let item of data ){
			tmp.push({
				'key': item.categoryId,
				'value': item.categoryName
			})
		}

		new DropdownLayer( jQuery( '.board-write-category' ), tmp, 'boardCategory' );
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
			return;
		}

		if( !data.contents ){
			alert( Config.L10N.alert_empty_contents );
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

	addEvent(){
		jQuery( 'body' ).on( 'click', '#boardWriteSubmit', ( evt ) => {
			evt.preventDefault();
			let contents = this.editor.getSubmitContents();
			let data = {
				articleId: this.articleId,
				token_id: this.editor.getToken(),
				title: jQuery( '#title' ).val(),
				contents: contents,
				thumbnail: this.getThumbnail()
			}

			this.submit( data, ( data ) => {
				location.href = Config.listPage;
			});
		});

		jQuery( 'body' ).on( 'click', '#boardWriteCancel', ( evt ) => {
			evt.preventDefault();
			this.reset();
		});
	}

	template(){
		return `<div class="board-write">
		<form id="boardWriteForm" name="boardWriteForm" action="/board/${Config.board}/article" method="post" autocomplete="off" onSubmit="return false;">
			<input type="hidden" name="articleId" id="articleId" value="${this.articleId}" />
			<div class="co-btn-wrap">
				<div class="left"><button id="boardWriteCancel" type="button" class="co-btn co-btn-write-cancel">${Config.L10N.btn_cancel}</button></div>
				<div class="right"><button id="boardWriteSubmit" type="button" class="co-btn co-btn-write-submit">${Config.L10N.btn_confirm}</button></div>
			</div>

			<div class="board-write-category"></div>

			<div class="board-write-title">
				<input type="text" name="title" id="title" placeholder="${Config.L10N.title}" />
			</div>

			<div id="froala-editor"></div>
		</form>
		</div>`;
	}

};

module.exports = Write;
