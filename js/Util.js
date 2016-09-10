/**
 * Connect
 */

import Promise from 'promise-polyfill';

'use strict';
jQuery.support.cors = true;

let Util = {
  get: ( url, method = 'get', data ) => {
    if( !url ) return '';
    return new Promise( ( resolve, reject ) => {
      jQuery.ajax({
        url: url,
        method: method,
        data: data,
        //xhrFields: {withCredentials: true},
        success: ( data ) => { resolve( data ) },
        error: ( _data ) => { reject( _data ) }
      });
    });
  },

  getParams: () => {
    let _vars = {};
    let parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, ( m, key, value ) => {
      _vars[key] = value;
    });
    return _vars;
  },
  confirm: ( msg, resolve, reject ) => {
    let r = confirm( msg );
    if( r ){
      resolve();
    }else{
      reject();
    }
  },
  hashs: ( url ) => {
    let vars = {};
    let parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi, ( m, key, value ) => {
      vars[key] = value;
    });
    return vars;
  },
  getHash: () => {
    let _hash = '';
    if( document.location.hash ){
      _hash = document.location.hash;
      _hash = _hash.replace( '#', '' );
    }
    return _hash;
  },
  escape: ( str ) => {
    str = str.replace( /<script>/g, `&lt;script&gt;` );
    str = str.replace( /<\/script>/g, `&lt;/script&gt;` );
    str = str.replace( /<body>/g, `&lt;body&gt;` );
    str = str.replace( /<\/body>/g, `&lt;/body&gt;` );
    return str;
  }
}

module.exports = Util;
