/**
 * Youtube
 */
import Config from '../Config.js';
import Plugin from '../plugin/Plugin.js';
import getYoutubeId from 'js-youtube-id';
import Template from 'js-template-string';

class Youtube extends Plugin{
	constructor(){
		super();
	}

	template( url ){
		let id = this.getYoutubeId( url );
		return ( id )? Config.appendYoutubeTemplate( id ): '';
	}

	getYoutubeId( url ){
		return getYoutubeId( url );
	}
};

module.exports = Youtube;
