/**
 * Image
 */

import Config from '../Config.js';
import Plugin from '../plugin/Plugin.js';

class Image extends Plugin{
	constructor( url ){
		super();
		this.url = url;
	}

	template( data ){
		return Config.appendImageTemplate( data );
	}
};

module.exports = Image;
