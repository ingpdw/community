/**
 * CommentChat
 */

import Config from '../Config';
import Util from '../Util';
import InfiniteScroll from '../InfiniteScroll';
import Template from './Template';
import Loading from '../Loading';
import CommentReply from './CommentReply';
import CommentHeader from './CommentHeader';
import CommentListWrap from './CommentListWrap';
import Tmpl from 'js-template-string';
import DateFormat from 'date-format-simple';

let dateFormat = new DateFormat( Config.now, {
  'a_few_seconds_ago': Config.L10N.a_few_seconds_ago,
  'seconds_ago': Config.L10N.seconds_ago,
  'a_minute_ago': Config.L10N.a_minute_ago,
  'minutes_ago': Config.L10N.minutes_ago,
  'an_hour_ago': Config.L10N.an_hour_ago,
  'hours_ago': Config.L10N.hours_ago,
  'a_day_ago': Config.L10N.a_day_ago,
  'days_ago': Config.L10N.days_ago,
  'a_month_ago': Config.L10N.a_month_ago,
  'months_ago': Config.L10N.months_ago,
  'a_year_ago': Config.L10N.a_year_ago,
  'years_ago': Config.L10N.years_ago
}, true);

class CommentChat{
	constructor( node, options ){
		this.$node = node;

    this.isLoaded = false;

		this._id = this.$node.attr( 'id' );

    this._writeId = 'contentWrite';

    this.articleId = window.articleId;

		Config.board = ( options.board )?
			options.board: Config.board;

		Config.commentMore = ( options.commentAPIUrl )?
			options.commentAPIUrl: Config.commentMore;

		Config.comment = ( options.commentWriteAPIUrl )?
			options.commentWriteAPIUrl: Config.comment;

		Config.isApp = ( options.isApp )?
			options.isApp: false;

		Config.init = ( options.init )?
			options.init: () => {};

		jQuery.extend( true, Config, options );

		//comment wrap UI
		this.commentListWrap = new CommentListWrap( this.$node );

		//comment count UI
		this.commentHeader = new CommentHeader( this.$node );

		this.infiniteScroll = new InfiniteScroll( ( dir ) => {
      //'.agit-chat-wrap'
			if( dir == 'down' ) this.get( this.getLastId(), 'AFTER' );
      if( dir == 'up' ) this.get( this.getFirstId(), 'BEFORE' );
		});

		//loading spinner
		this.loading = new Loading( this.$node );
		this.loading.setUI();

    this.addEvent();

    this.timer();
  }

  timer(){
    setInterval( () => {
      this.get( this.getLastId(), 'AFTER' );
    }, 5000 );
  }

  get( callArticleId, direction ){
		this.loading.show();

		let commentUrl = Tmpl.render({
	      data: {
          articleId: this.articleId,
          board: Config.board,
          moreDirection: direction,
          commentId: callArticleId
        },
	      template: Config.commentMore
	  });

    let comment = Util.get( commentUrl );
    comment.then( ( data ) => {

      let header = '', write = '', body = '', wrapComment = '';

      data.commentList = data.commentList.reverse();

			data = Util.convertCamelCase( data );

			//set comment List UI
			body = this.commentListWrap.setUI( this.templateCommentList( data ) );

			//merge comment Template String
      if( !this.isLoaded ){

        //set comment Header UI
        header = this.commentHeader.setUI( data.pageNavigation || data.commentPagination );

        //set comment write textare UI
        write = this.commentWrite( this._writeId );

        wrapComment = Template.comment( header + write + body );

  			this.$node.append( wrapComment );

        this.infiniteScroll.start();
        Config.init && Config.init();
      }else{
        jQuery( `#${this._id} .commentThread` ).append( this.templateCommentList( data ) );
      }

      this.isLoaded = true;
			this.loading.hide();

      // if( direction == 'AFTER' )
      //   jQuery( 'body' ).scrollTop( jQuery('body')[0].scrollHeight );

    }, () => {
      this.isLoaded = true;
			this.loading.hide();
      if( !this.isLoaded ){
        Config.init && Config.init();
      }
		})
  }

  write( msg ){
    this.submit({
      contents: msg
    });
  }

	clear(){
		jQuery( `#${this._id} .${this._writeId}` ).val( '' );
	}

  submit( data ){
    if( data.contents.length == 0 ){
      alert( Config.L10N.alert_empty_reply );
      return;
    }

    if( data.contents.length > 300 ){
      alert( Config.L10N.comment_placeholder_login );
      return;
    }

		let _post = Util.get( Config.comment( {'board': Config.board, articleId: this.articleId} ), 'POST', data );
		_post.then( ( data ) => {
      this.get( this.getLastId(), 'AFTER' );
      this.clear();
		}, ( data ) => {

		});
	}

  addEvent(){
    jQuery( 'body' ).on( 'focus', `#${this._id} .${this._writeId}` , ( evt ) => {
      jQuery( `#${this._id} .comment-form` ).addClass( 'is-focus' );
    });

    jQuery( 'body' ).on( 'blur', `#${this._id} .${this._writeId}` , ( evt ) => {
      setTimeout( () => {
        jQuery( `#${this._id} .comment-form` ).removeClass( 'is-focus' );
      }, 200 );
    });

    $( 'body' ).on( 'click', '.btn-chat-send', ( evt ) => {
      let val = jQuery( `#${this._id} .${this._writeId}` ).val();
    	this.write( val );
    });

    jQuery( 'body' ).on( 'keypress', `#${this._id} .${this._writeId}` , ( evt ) => {
      let key = evt.keyCode;
      if( key == 13 ){
        evt.preventDefault();
        let _$this = jQuery( `#${this._id} .${this._writeId}` );

        let _val = _$this.val();

        if( _val.length == 0 ){
          alert( Config.L10N.alert_empty_reply );
          return;
        }

        if( _val.length > 300 ){
          alert( Config.L10N.comment_placeholder_login );
          return;
        }

        this.submit({
          contents: _val
        });
      }else{
      }
    });
  }

  getLastId(){
    return jQuery( `#${this._id} .comment-article` ).last().attr( 'data-commentid' ) || '';
  }

  getFirstId(){
    return jQuery( `#${this._id} .comment-article` ).first().attr( 'data-commentid' ) || '';
  }

	templateCommentList( _data, timeMsg = '' ) {
		return Tmpl.iterate({
			data: _data.commentList,
			template: ( _v ) => `
				<div class="comment-article
          ${ ( _v.writer.loginUser.uid == Config.guid )? ` is-send`: ` is-receive`}" data-commentid="${_v.commentId}">
					<div class="comment-info">
						<i class="fe-icon-reply"></i>
						<!--span class="thumb">
              <img src="http://dn.sfile.plaync.com/data/${_v.writer.loginUser.uid}/profile?type=small" alt="">
            </span-->
            <span class="writer" style="display:block;">${_v.writer.loginUser.name}</span>
						<span class="date">${ dateFormat.printFull( _v.postDate )}</span>
					</div>
					<div class="comment-contents${ ( _v.contents.indexOf( '<img') != -1 )? ` emoticon`: ''}">${ _v.contents }</div>
				</div>`
		});
	}

	commentWrite( content, placeHolder = '혈맹원들과 대화를 나눠보세요.' ){
    return `<div class="comment-form">
				<div class="comment-form-textarea">
					<textarea class="content ${content}" name="content" placeholder="${placeHolder}"></textarea>
					</div>
			</div>`;
  }
};

module.exports = CommentChat;
