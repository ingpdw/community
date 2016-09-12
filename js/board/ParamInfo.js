/**
 * List
 */

import Config from '../Config.js';
import Util from '../Util.js';
import Template from './Template.js';
import Tmpl from 'js-template-string';

class ParamInfo{
	constructor(){
		this.param = [];
  }

	setParamByUrl() {
		let _param = Util.getParams();

		if( jQuery.isEmptyObject( _param ) ) return;

		this.param = [];
		for( let item in _param ){
			this.param.push( [ item, _param[ item ] || '' ] )
		}
	}

	setParamByHash() {
		let _hash = Util.getHash();
		let _hashs = Util.hashs( _hash );

		if( jQuery.isEmptyObject( _hashs ) ) return;

		this.param = [];
		for( let item in _hashs ){
			this.param.push( [ item, _hashs[ item ] ] )
		}
	}

	removeParam( param ) {
		for( let i = 0, len = this.param.length; len > i; i++ ){
			if( param[ 0 ] == this.param[ i ][ 0 ] ){
				this.param.splice( i, 1 );
				break;
			}
		}
	}

	getParamByKey( key ) {
		for( let i = 0, len = this.param.length; len > i; i++ ){
			if( key == this.param[ i ][ 0 ] ){
				return this.param[ i ][ 1 ] || '';
			}
		}

		return '';
	}

	setParam( param ) {
		this.removeParam( param );
		this.param.push( param );
	}

	getParam() {
		let tmp = ``;
		// for( let item of this.param ){
		// 	tmp += `&${ item[ 0 ] }=${ item[ 1 ] }`
		// }

		this.param.forEach( ( item )=>  {
			tmp += `&${ item[ 0 ] }=${ item[ 1 ] }`
		});

		return tmp;
	}

	getParamIgnore( ignore ) {
		let tmp = ``;

		this.param.forEach( ( item )=>  {
			if( item[ 0 ] != ignore )
				tmp += `&${ item[ 0 ] }=${ item[ 1 ] }`
		});

		return tmp;
	}
};

module.exports = ParamInfo;
