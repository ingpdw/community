/**
 * List
 */

import Config from '../Config';
import Util from '../Util';
import Search from './Search';
import Template from './Template';
import DropdownLayer from '../DropdownLayer';
import ParamInfo from './ParamInfo';
import ListCategory from './ListCategory';
import PageNavigation from './PageNavigation';
import ListTopUtil from './ListTopUtil';
import NoticeList from './NoticeList';
import Tmpl from 'js-template-string';

class List{
	constructor( node, options ){
		this.$node = node;
		this._id = this.$node.attr( 'id' );
		this.listId = 'ncCommunityBoardList';

		this.isFirstLoaded = false;

		jQuery.extend( true, Config, options );

		Config.board = ( options && options.board )?
			options.board: Config.board;

		Config.isCardView = ( options && options.isCardView )?
			options.isCardView: false;

		Config.isListView = ( options && options.isListView )?
			options.isListView: false;

		Config.isTopNotice = ( options && options.isTopNotice )?
			options.isTopNotice: false;

		Config.isListShare = ( options && options.isListShare )?
			options.isListShare: false;

		this.viewMode =  Util.getParams().viewMode|| 'list'; //[ list | card ]

		//menu Module
		let listTopUtil = this.listTopUtil = new ListTopUtil( this.$node );

		listTopUtil.onViewMode.add( ( viewMode ) => {
			let pInfo = this.paramInfo;
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

		if( Config.isTopNotice ){
			let noticeList = new NoticeList( this.$node );
			noticeList.get();
		}

		//parameter & hash Module - page, query, searchType, articleId
		this.paramInfo = new ParamInfo();

		//pagenavigation Module
		this.pageNavigation = new PageNavigation( this.paramInfo );

		//board search Module
		this.search = new Search( listTopUtil.getNode(), ( query = '', searchType = '' ) => {
			let pInfo = this.paramInfo;
			location.href = Config.listPage +
				`?query=${query}
					&searchType=${searchType}
					&page=1
					&viewMode=${pInfo.getParamByKey( 'viewMode' )}
					&categoryId=${pInfo.getParamByKey( 'categoryId' )}`;
		});
  }

	remove(){
		jQuery( `#${this._id} .${this.listId}` ).empty();
		jQuery( `#${this._id} .pagination-container` ).remove();
	}

  get(){
		if( Config.isCategory ){
			let listCategory = new ListCategory( this.listTopUtil.getNode(), Util.getParams().categoryId || '', true );
			listCategory.onChange.add( ( data ) => {
				let pInfo = this.paramInfo;
				pInfo.setParam( [ 'categoryId', data ] );
				location.href = Config.listPage + '?' + pInfo.getParam();
			});
			listCategory.onInit.add( ( categoryId ) => {
				this.getList( categoryId );
			});
		}else{
			this.getList();
		}
  }

	getList( categoryId ) {
		let _param = Util.getParams();
		let page = _param.page || 1;
		let pInfo = this.paramInfo;

		//set parameter
		pInfo.setParamByUrl();
		pInfo.setParam( ['viewMode', this.viewMode || '' ] );
		// pInfo.setParam( ['searchType', _param.searchType || '' ] );
		// pInfo.setParam( ['query', _param.query || '' ] );
		// pInfo.setParam( ['categoryId', _param.categoryId || '' ] );

		let list = Util.get( Config.list( Config.board, page ), 'GET', {
			page: page,
			query: decodeURIComponent( pInfo.getParamByKey( 'query' ) ),
			searchType: pInfo.getParamByKey( 'searchType' ),
			categoryId: pInfo.getParamByKey( 'categoryId' ) || categoryId,
			summary: ( pInfo.getParamByKey( 'viewMode' ) == 'card' )? true: false
		});

		list.then( ( data ) => {
			let tmp = '';

			//empty listNode
			this.remove();

			//set data to search Module
			this.search.setQuery( decodeURIComponent( pInfo.getParamByKey( 'query' ) ) );
			this.search.setSearchType( pInfo.getParamByKey( 'searchType' ) );

			//empty data
			if( data.articleList.length == 0 && !this.isFirstLoaded ){
				this.$node.append( Template.empty( this.listId, Config.L10N.list_none_article ) );
				return;
			}else{
				let page = this.pageNavigation.setUI( data.pageNavigation );

				if( this.viewMode == 'card' && Config.isCardView ){
						tmp = Template.cardList( data, this.listId, pInfo.getParam() );
				}else{
						tmp = Template.list( data, this.listId, pInfo.getParam() );
				}

				//list template + page navigation
				tmp = Tmpl.join( tmp, page );

				//append template data
				this.$node.append( tmp );

				this.isFirstLoaded = true;
			}

		}, () => {})
	}

};

module.exports = List;
