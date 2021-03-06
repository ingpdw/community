/**
 * Viewer
 */

import Config from '../Config';
import Util from '../Util';
import Template from './Template';
import Tmpl from 'js-template-string';

class Viewer{
	constructor(){
		if( window.nc && window.nc.ui && window.nc.ui.ImageViewer )
			this.addEvent();
  }

  isEmoticonImage( src ){
    var emoticonUrl = [ '/emoticon', '/emo/' ];
		// for( let item of emoticonUrl ){
    //   if( src.indexOf( emoticonUrl[ item ] ) !== -1 )
		// 		return true;
    // }

		for( let item = 0, len = emoticonUrl.length; len > item; item++ ){
			if( src.indexOf( emoticonUrl[ item ] ) !== -1 )
				return true;
		}

    return false;
  }

  replaceOrigin( src ){
    return src.replace('/download_mobile/', '/download/');
  }

	popView( src ){
		if( this.isEmoticonImage( src ) ) return;

		if( !this.mobileImageViewer ){
				var arr = [];

				jQuery( '.fe-image:not(".gdict_contents>.fe-image")' ).each( ( idx, item ) => {

					let _src = jQuery( item ).attr( 'src' );

					if( _src.indexOf('/download_mobile/') != -1 ){
							_src = this.replaceOrigin( _src );
					}

					if( !this.isEmoticonImage( _src ) ) arr.push( _src );
				});

				if( window.nc && window.nc.ui && window.nc.ui.ImageViewer )
					this.mobileImageViewer = new nc.ui.ImageViewer( jQuery( 'body' ), arr, {commentUrl: ''} );
		}

		src = this.replaceOrigin( src );
		this.mobileImageViewer.slideByUrl( src );
	}

  addEvent(){
		jQuery( 'body' ).on( 'click', '.fe-image', ( evt ) => {
	    evt.preventDefault();
	    this.popView( jQuery( evt.currentTarget ).attr( 'src' ) );
	  });
  }
};

module.exports = Viewer;
