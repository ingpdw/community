/**
 * Template
 */

//let instance = null;
class Template{
  constructor() {
    // if( !instance ) instance = this;
    // return instance;
  }

	static encode ( str ) {
		return encodeURIComponent( str );
	}

	static upper ( str ) {
		return str.toUpperCase();
	}

	static escape ( str ) {
		return str.replace(/&/g, '&amp;') // first!
			.replace(/>/g, '&gt;')
			.replace(/</g, '&lt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#39;')
			.replace(/`/g, '&#96;');
	}

};

module.exports = Template;
