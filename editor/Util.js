/**
 * Connect
 */

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
        xhrFields: {withCredentials: true},
        success: ( data ) => { resolve( data ) },
        error: ( _data ) => { reject( _data ) }
      });
    });
  },
  getParams: () => {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
    function(m,key,value) {
      vars[key] = value;
    });
    return vars;
  }
}

module.exports = Util;
