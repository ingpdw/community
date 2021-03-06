/**
 * List
 */

import Config from '../../Config';
import Util from '../../Util';
import DropdownLayer from '../../DropdownLayer';
import Search from '../Search';
import Template from '../Template';
import ParamInfo from '../ParamInfo';
import PageNavigation from '../PageNavigation';
import ListTopUtil from '../ListTopUtil';
import Tmpl from 'js-template-string';

class List{
	constructor( node, options ){
		this.set( node, options );
  }

	set( node, options ){
		this.$node = node;
		this._id = this.$node.attr( 'id' );
		this.listId = 'ncCommunityBoardList';

		Config.board = ( options && options.board )?
			options.board: Config.board;

		Config.isCardView = ( options && options.isCardView )?
			options.isCardView: false;

		Config.isListView = ( options && options.isListView )?
			options.isListView: false;

		Config.listViewMode = ( Config.isCardView )? 'card': 'list';

		this.viewMode =  Util.getParams().viewMode || Config.listViewMode || 'list'; //[ list | card ]

		//menu Module
		let listTopUtil = new ListTopUtil( this.$node, ( viewMode ) => {
			let pInfo = this.paramInfo;
			if( viewMode == 'card' ){
				pInfo.setParam( [ 'viewMode', 'card' ] );
			}else{
				pInfo.setParam( [ 'viewMode', 'list' ] );
			}

			location.href = Config.listPage + '?' + pInfo.getParam();
		});

		//parameter & hash Module - page, query, searchType, articleId
		this.paramInfo = new ParamInfo();

		//pagenavigation Module
		this.pageNavigation = new PageNavigation( this.paramInfo );

		//board search Module
		this.search = new Search( listTopUtil.getNode(), ( query = '', searchType = '' ) => {
			let pInfo = this.paramInfo;
			location.href = Config.listPage +
				`?viewMode=${pInfo.getParamByKey( 'viewMode' )}&query=${query}&searchType=${searchType}&page=1`;
		});
	}

	remove(){
		jQuery( `#${this._id} .${this.listId}` ).empty();
		jQuery( `#${this._id} .pagination-container` ).remove();
	}

	setList(){
		let tmp = '';

		//empty listNode
		this.remove();

		//set data to search Module
		this.search.setQuery( pInfo.getParamByKey( 'query' ) );
		this.search.setSearchType( pInfo.getParamByKey( 'searchType' ) );

		//empty data
		if( data.articleList.length == 0 ){
			this.$node.append( Template.empty( this.listId, Config.L10N.list_none_article ) );
			return;
		}else{
			let page = this.pageNavigation.setUI( data.pageNavigation );

			if( this.viewMode == 'card' ){
					tmp = Template.cardList( data, this.listId, pInfo.getParam() );
			}else{
					tmp = Template.list( data, this.listId, pInfo.getParam() );
			}

			//list template + page navigation
			tmp = Tmpl.join( tmp, page );

			//append template data
			this.$node.append( tmp );
		}
	}

  get( url ){
		let _param = Util.getParams();
		let page = _param.page || 1;
		let pInfo = this.paramInfo;

		//set parameter
		pInfo.setParam( ['viewMode', this.viewMode || '' ] );
		pInfo.setParam( ['searchType', _param.searchType || '' ] );
		pInfo.setParam( ['query', _param.query || '' ] );

		let _url = url || Config.list( Config.board, page );

		let list = Util.get( _url, 'GET', {
			page: page,
			query: decodeURIComponent( pInfo.getParamByKey( 'query' ) ),
			searchType: pInfo.getParamByKey( 'searchType' )
		});

    list.then( ( data ) => {
			this.setList( data );
    }, ( data ) => {
			if( data.status == '401' || data.exceptionClassName == 'AccessDeniedException' ){
				location.href = Config.loginPage + '?return_url=' + encodeURIComponent( location.href );
	    }
		})
  }

};

module.exports = List;
