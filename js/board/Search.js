/**
 * List
 */

import Config from '../Config';
import Util from '../Util';
import Template from './Template';
import DropdownLayer from '../DropdownLayer';
import Tmpl from 'js-template-string';

class Search{
	constructor( $parent, callback ){
		this.$parent = $parent;
		this.callback = callback;
		this._id = 'ncCommunitySearch';
		this._wrapId = 'ncCommunitySearchType';
		this.setCategoryUI();
		this.setSearchBox();
		this.addSearchEvent();
	}

  setCategoryUI(){
		let tmp = [], searchTypes = [
			{categoryId: 'content', categoryName: Config.L10N.search_searchtype_content},
			{categoryId: 'title', categoryName: Config.L10N.search_searchtype_title},
			{categoryId: 'writer', categoryName: Config.L10N.search_searchtype_writer}
		];

		//Symbol is not defined - babel is hell
		// for( let item of searchTypes ){
		// 	tmp.push({
		// 		'key': item.categoryId,
		// 		'value': item.categoryName
		// 	})
		// }

		searchTypes.forEach( ( item )=>  {
			tmp.push({
				'key': item.categoryId,
				'value': item.categoryName
			});
		});

		this.dropdownLayer = new DropdownLayer( this.$parent, tmp, this._wrapId, 'board-search' );
		this.dropdownLayer.addChange( ( data ) => {
			let query = this.getQuery();
			if( query && data )
				this.callback && this.callback( query, data );
		});
	}

	getSearchType() {
		return this.dropdownLayer.getValue();
	}

	setSearchType( val ) {
		this.dropdownLayer.setValue( val );
	}

	setQuery( val ) {
		this.$parent.find( '#' + this._id ).val( val );
	}

	getQuery() {
		return this.$parent.find( '#' + this._id ).val() || '';
	}

	setSearchBox(){
		this.dropdownLayer.getNode().append( this.templateSearchBox() );
	}

	addSearchEvent(){
		this.$parent.on( 'keypress', '#' + this._id , ( evt ) => {
			var key = evt.keyCode;
			if( key == 13 ){
				let _$this = jQuery(  '#' + this._id );
				let val = _$this.val();
				let type = this.getSearchType();
				if( val && type ) this.callback && this.callback( val, type );
			}else{
			}
		});

		this.$parent.on( 'click', '.co-btn-search', ( evt ) => {
			let $searchType = jQuery( '#' + this._wrapId );
			( $searchType.hasClass( 'is-show' ) )?
			 	$searchType.removeClass( 'is-show' ):
				$searchType.addClass( 'is-show' );

			( $searchType.hasClass( 'is-result' ) )?
			 	$searchType.removeClass( 'is-result' ):
				$searchType.addClass( 'is-result' );
		});

		this.$parent.on( 'click', '.co-btn-reset', ( evt ) => {
			jQuery(  '#' + this._id ).val( '' );
		});
	}
	templateSearchBox(){
		return `<div class="ui-input-box ui-input-box-search">
			<input type="text" id="${this._id}" class="input-board-search" name="query" value="">
			<button class="co-btn co-btn-reset"><i class="fe-icon-close_circle"></i></button>
			</div>`;
		}
};

module.exports = Search;
