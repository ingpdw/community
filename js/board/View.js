/**
 * View
 */

import Config from '../Config';
import Util from '../Util';
import Template from './Template';
import Vote from './Vote';
import Loading from '../Loading';
import ViewMenu from './ViewMenu';
import Scrap from './Scrap';
import Report from './Report';
import Delete from './Delete';
import Update from './Update';
import Viewer from './Viewer';
import Tmpl from 'js-template-string';
import PrevNextArticle from './PrevNextArticle';

class View{
	constructor( node, options ){
		this.$node = node;

		jQuery.extend( true, Config, options );

		Config.board = ( options.board )? options.board: Config.board;

		Config.isShare = ( options.isShare )? options.isShare: Config.isShare;

		Config.share = ( options.share )? options.share: Config.share;

		Config.isAdmin = ( options.isAdmin )?
			options.isAdmin: false;

		Config.isShowSignature = ( options.isShowSignature )?
			options.isShowSignature: Config.isShowSignature;

		Config.isShowViewUtil = ( options.isShowViewUtil )?
			options.isShowViewUtil: Config.isShowViewUtil;

		let param = Util.getParams();

		this.articleId = param.articleId;

		this.isNotice = ( param.isNotice == '1' )? true: false;

		this.guid = '';

		this.loading = new Loading( this.$node );
		this.loading.setUI();
		this.loading.show();
  }

  get(){
		let viewUrl = '';

		if( !this.isNotice ) {
			viewUrl = Tmpl.render({
		      data: {articleId: this.articleId, board: Config.board},
		      template: Config.view
		  });
		}else{
			viewUrl = Tmpl.render({
		      data: {articleId: this.articleId, board: Config.board},
		      template: Config.noticeView
		  });
		}

    let view = Util.get( viewUrl );
    view.then( ( data ) => {
			this.guid = data.article.writer.loginUser.uid;
			//이전 다음
			this.prevNextArticle = new PrevNextArticle( this.$node );

			let tmp = Template.view( data, Template, this.isNotice );
			//let prevNextTmp = this.prevNextArticle.setUI( data.prevNextArticleEntries );
			//tmp = Tmpl.join( tmp, prevNextTmp );
			this.$node.append( tmp );

			//메뉴
			this.viewMenu = new ViewMenu( this.$node, this.isNotice );

			//투표
			this.vote = new Vote( this.guid );

			//스크랩
			this.scrap = new Scrap( this.guid );

			//삭제
			this.delete = new Delete( this.guid );

			//수정
			this.update = new Update( this.guid );

			//신고
			this.report = new Report( jQuery( 'body' ), data.article.writer.loginUser.name );

			//뷰어
			this.Viewer = new Viewer();

			if( Config.isShare && Config.share && nc && nc.uikit && nc.uikit.ShareV2 ){
				new nc.uikit.ShareV2({
				  $parent: jQuery( '#ncShare' ),
				  appid: Config.share.appid || '',
				  appver: Config.share.appver || '',
				  appname: Config.share.appname || '',
				  img: Config.share.img || '',
				  breakpoint: Config.share.breakpoint || '',
				  msg: Config.share.msg || '',
				});
			}else{
				jQuery( '#ncShare' ).remove();
			}

			this.loading.hide();

    }, ( data ) => {
			if( data.status == 400 ){
				location.href = Config.listPage;
			}

			if( data.status == 401 ){
				Config.apiError( data );
			}

			this.loading.hide();
		})
  }
};

module.exports = View;
