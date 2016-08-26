
/**
 * InfiniteScroll
 */

class InfiniteScroll{
	constructor( callback, $target ){
		this.isCreated = false;
		this.isLoading = false;
		this.isUpStop = false;
		this.isDownStop = false;
		this.direction = 'down';
		this.offset = 30;
		this.callback = callback;
		this.currScrollTop = this.offset;
	}

	loadedEnd(){
		this.isLoading = false;
		jQuery( window ).scrollTop( this.currScrollTop );
	}

	stop( dir ) {
		if( dir == 'up' ){
			this.isUpStop = true;
		}else{
			this.isDownStop = true;
		}
	}

	setInitPos () {
		this.currScrollTop = jQuery( window ).scrollTop() || this.offset;
		jQuery( window ).scrollTop( this.currScrollTop );
		//jQuery( 'body' ).stop().animate({scrollTop: this.currScrollTop }, '500', 'swing', () => { });
	}

	start() {
		if( !this.isCreated ) {
			this.isCreated = true;

			jQuery( window ).scroll( () => {

				if( this.isLoading ) return;

				if ( jQuery( window ).scrollTop() == 0 ) {
					if( this.isUpStop ) return;
					this.isLoading = true;
					this.direction = 'up';
					this.currScrollTop = jQuery( window ).height() - this.offset;
					this.callback && this.callback( this.direction );

				} else if ( ( jQuery( document ).height() - jQuery( window ).height() ) <= $( window ).scrollTop() + this.offset ){
					if( this.isDownStop ) return;
					this.isLoading = true;
					this.direction = 'down';
					this.currScrollTop = jQuery( window ).scrollTop();
					this.callback && this.callback( this.direction );
				}
			});

			this.setInitPos();
		}

	}
}

module.exports = InfiniteScroll;
