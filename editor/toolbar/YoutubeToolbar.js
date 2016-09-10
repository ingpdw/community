/**
 * YoutubeToolbar
 */
import Config from '../Config.js';
import Toolbar from '../toolbar/Toolbar.js';
import Youtube from '../plugin/Youtube.js';
import getYoutubeId from 'js-youtube-id';
import Template from 'js-template-string';

class YoutubeToolbar extends Toolbar{
	constructor( $node, options = () => {} ){
		super();
		this.$node = $node;
		this.insert = options.insert;
		this.$tmp = jQuery( this.template() );
		$node.append( this.$tmp );
		this.addEvent();
	}

	template(){
		return Template.render({
			data: `append youtube`,
			template: ( name ) => `<div class="fe-layer">
					<div class="fe-layer-header">
						<h2 class="fe-layer-title">${Config.L10N.layer_video_title}</h2>
						<button class="fe-btn fe-btn-close"><i class="fe-icon-close"></i></button>
					</div>

					<div class="fe-layer-body">
						<p class="fe-layer-copy">${Config.L10N.layer_video_copy1}</p>
						<div class="fe-layer-form">
							<div class="fe-layer-input">
								<input id="rwdEditor_youtube_url" type="text" placeholder="${Config.L10N.layer_video_copy1}"/>
								<button class="fe-btn fe-btn-reset"><i class="fe-icon-close_circle"></i></button>
							</div>
						</div>
					</div>

					<div class="fe-btn-wrap">
						<button id="rwdEditor_youtube_button" class="fe-btn fe-btn-layer" type="button">${Config.L10N.btn_apply}</button>
					</div>
				</div>`
		});
	}

	addEvent(){
		jQuery( '#rwdEditor_youtube_button' ).on( 'click', ( evt ) => {
			let url = jQuery( '#rwdEditor_youtube_url' ).val();
			this.insert( url );
			this.hide();
		});

		jQuery( '.fe-btn-close' ).on( 'click', ( evt ) => {
			this.hide();
		});

		jQuery( '.fe-btn-reset' ).on( 'click', ( evt ) => {
			jQuery( '#rwdEditor_youtube_url' ).val( '' );
		});

	}

	show(){
		this.$tmp.addClass( 'active' );
	}

	hide(){
		this.$tmp.removeClass( 'active' );
	}
};

module.exports = YoutubeToolbar;
