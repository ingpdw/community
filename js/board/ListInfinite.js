/**
 * List
 * 무한 스크롤 UP
 * 파라미터 및 해쉬 관리 Class 만들기
 */

import Config from '../Config';
import Util from '../Util';
import Loading from '../Loading';
import Search from './Search';
import Template from './Template';
import DropdownLayer from '../DropdownLayer';
import PageNavigation from './PageNavigation';
import PrevNextArticle from './PrevNextArticle';
import ListTopUtil from './ListTopUtil';
import ParamInfo from './ParamInfo';
import NoticeList from './NoticeList';
import Tmpl from 'js-template-string';
import InfiniteScroll from '../InfiniteScroll.js';

class ListInfinite{
	constructor( $node, options ){
		this.$node = $node;
		this._id = this.$node.attr( 'id' );
		this.listId = 'ncCommunityBoardList';

		//BEFORE: old article, AFTER : new article
		this.moreDirection = 'BEFORE';

		//clicked MoreButton
		this.isFirstLoaded = false;

		//clicked article id
		this.articleId = 0;

		jQuery.extend( true, Config, options );

		Config.board = ( options && options.board )?
			options.board: Config.board;

		Config.listViewMode = ( options && options.listViewMode )?
			options.listViewMode: Config.listViewMode;

		Config.isCardView = ( options && options.isCardView )?
			options.isCardView: false;

		Config.isListView = ( options && options.isListView )?
			options.isListView: false;

		Config.isTopNotice = ( options && options.isTopNotice )?
			options.isTopNotice: false;

		Config.listViewMode = ( Config.isCardView )? 'card': 'list';

		//parameter & hash Module - page, query, searchType, articleId
		this.paramInfo = new ParamInfo();

		//infiniteScrolling Module
		this.infiniteScroll = new InfiniteScroll( ( dir ) => {
			( dir == 'up' )?
				this.getNextArticleId():
				this.getPrevArticleId();
		});

		//menu Module
		let listTopUtil = new ListTopUtil( this.$node );

		listTopUtil.onViewMode.add( ( viewMode ) => {
			let pInfo = this.paramInfo;
			pInfo.setParam( [ 'articleId', 0 ] );
			if( viewMode == 'card' ){
				pInfo.setParam( [ 'viewMode', 'card' ] );
			}else{
				pInfo.setParam( [ 'viewMode', 'list' ] );
			}

			location.href = Config.listPage + '?' + pInfo.getParam();
		}, this );

		listTopUtil.onWrite.add( () => {
			let pInfo = this.paramInfo;
			location.href = Config.writePage + '?' + pInfo.getParam();
		}, this );

		this.loading = new Loading( this.$node );
		this.loading.setUI();

		//pagenavigation Module
		this.pageNavigation = new PageNavigation( this.paramInfo );

		//board search Module
		this.search = new Search( listTopUtil.getNode(), ( query = '', searchType = '' ) => {
			let pInfo = this.paramInfo;
			pInfo.setParam( [ 'articleId', 0 ] );
			location.href = Config.listPage +
				`?viewMode=${pInfo.getParamByKey( 'viewMode' )}&query=${query}&searchType=${searchType}&page=1`;
		});

		//get prev, next article Info
		this.prevNextArticle = new PrevNextArticle();

		if( Config.isTopNotice ){
			let noticeList = new NoticeList( this.$node );
			noticeList.get();
		}

		this.addEvent();
  }

	setMoreButtonUI() {
		return `<div class="wrap-community-more"><button class="ncCommmentMore">${Config.L10N.btn_more}</button></div>`;
	}

	removeMoreButton() {
		jQuery( `#${this._id} .ncCommmentMore` ).hide();
	}

	addEvent() {
		//bind event - more button
		jQuery( 'body' ).on( 'click', `#${this._id} .ncCommmentMore`, ( evt ) => {
			this.getPrevArticleId();
			this.removeMoreButton();
		});

		//if board's item is clicked, set hash
		jQuery( 'body' ).on( 'click', `#${this._id} li.board-items`, ( evt ) => {
			evt.preventDefault();
			let _$target = jQuery( evt.currentTarget ),
					_articleId = _$target.attr( 'data-articleid' ),
					pInfo = this.paramInfo;

			//get prev AriticleId
			//@TODO bad code.

			if( Config.listSize > jQuery( `#${this._id} li.board-items` ).length ){
				pInfo.setParam([ 'articleId', 0 ]);
				document.location.hash = '#' + pInfo.getParam();
				location.href = _$target.find( 'a' ).attr( 'href' );
				return;
			}

			this.prevNextArticle.get( _articleId, ( articleId ) => {
				pInfo.setParam([ 'articleId', articleId ]);
				document.location.hash = '#' + pInfo.getParam();
				location.href = _$target.find( 'a' ).attr( 'href' );
			});
		});
	}

	getPrevArticleId () {
		let pInfo = this.paramInfo;
		this.articleId =  jQuery( `#${this._id} .board-items:last` ).attr( 'data-articleid' );
		this.moreDirection = 'BEFORE';
		pInfo.setParam([ 'articleId', this.articleId ]);
		document.location.hash = '#' + pInfo.getParam();
		this.get();
	}

	getNextArticleId () {
		let pInfo = this.paramInfo;
		this.articleId =  jQuery( `#${this._id} .board-items:first` ).attr( 'data-articleid' );
			pInfo.setParam([ 'articleId', this.articleId ]);
			document.location.hash = '#' + pInfo.getParam();
		this.moreDirection = 'AFTER';
		this.get();
	}

  get(){
		let pInfo = this.paramInfo;

		//set paramInfo by url's parameters
		pInfo.setParamByUrl();

		if( !this.isFirstLoaded ){
			//set paramInfo by hash
			pInfo.setParamByHash();
			this.articleId = pInfo.getParamByKey( 'articleId' ) || 0;
		}

		let list = Util.get( Config.listMore( Config.board ), 'GET', {
			size: Config.listSize,
			query: pInfo.getParamByKey( 'query' ),
			searchType: pInfo.getParamByKey( 'searchType' ),
			moreDirection: this.moreDirection,
			previousArticleId: this.articleId,
			summary: true
		});

		//show Loading animation
		( this.moreDirection == 'AFTER' )?
			this.loading.showTop():
			this.loading.showBottom();

    list.then( ( data ) => {
			let tmp = '', pInfo = this.paramInfo;

			//set data to search Module
			this.search.setQuery( decodeURIComponent( pInfo.getParamByKey( 'query' ) ) );
			this.search.setSearchType( pInfo.getParamByKey( 'searchType' ) );

			if( data && data.articleList.length == 0 ){

				if( data.articleList.length == 0 && !this.isFirstLoaded ){
					this.$node.append( Template.empty( this.listId, Config.L10N.list_none_article ) );
					this.loading.hide();
				}

				if( !data.hasMore ){
					this.infiniteScroll.stop( ( this.moreDirection == 'AFTER' )? 'up': 'down' );
				}
				//end
			}else{
				tmp = ( pInfo.getParamByKey( 'viewMode' ) == 'card' || ( Config.isCardView && !Config.isListView ) )?
					Template.cardList( data, this.listId ):
					Template.list( data, this.listId );

				let moreButton = '';
				if( !this.isFirstLoaded && !pInfo.getParamByKey( 'articleId' ) && data && data.hasMore ){
					moreButton = this.setMoreButtonUI();
				}else{
					this.removeMoreButton();
					this.infiniteScroll.start();
				}

				let $appendNode = jQuery( `#${this._id} .${this.listId}` );
				if( $appendNode.length > 0 ){
					tmp = jQuery( tmp ).html();
				}else{
					$appendNode = this.$node;
				}

				//append template data
				( this.moreDirection == 'AFTER' )?
					$appendNode.prepend( tmp + moreButton ):
					$appendNode.append( tmp + moreButton );
			}

			this.isFirstLoaded = true;
			this.loading.hide();

			//articleId 초기화
			pInfo.setParam( ['articleId', ''] );
			document.location.hash = '#' + pInfo.getParam();

			//scroll 허용
			this.infiniteScroll.loadedEnd();
    }, () => {})
  }

};

module.exports = ListInfinite;
