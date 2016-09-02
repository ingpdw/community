/**
 * ListCategory
 */

import DropdownLayer from '../DropdownLayer';
import Config from '../Config';
import Util from '../Util';
import Observer from 'js-observer';

class ListCategory{
	constructor( $parent, value ) {
		this.$parent = $parent;
		this.value = value;
		this.onChange = new Observer;
		this.getCategory();
	}

	setValue( val ) {
		this.dropdownLayer.setValue( val );
	}

	setCategoryUI( data ){
		let tmp = [];
		for( let item of data ){
			tmp.push({
				'key': item.categoryId,
				'value': item.categoryName
			})
		}

		this.dropdownLayer = new DropdownLayer( this.$parent, tmp, 'boardCategory' );
		this.dropdownLayer.addChange( ( data ) => {
			if( data ) this.onChange.emit( data );
		});

		if( this.value ) this.setValue( this.value );
	}

	getCategory(){
		let _post = Util.get( Config.category( Config.board ), 'GET' );
		_post.then( ( data ) => {
			this.setCategoryUI( data );

		}, ( data ) => {
			//Config.apiError( data );
		});
	}
};

module.exports = ListCategory;
