/**
 * DropdownLayer
 */

import Config from './Config';
import Util from './Util';
import Tmpl from 'js-template-string';

class DropdownLayer{
	constructor( $node, data, name = 'board', className ){
		this.$node = $node;
		this.name = name;
		this.listValue = '';
		this.$_node = jQuery( this.template( data, className ) );
		this.$node.append( 	this.$_node );
		this.$callback = $.Callbacks();
		this.dropDownLayer =  '#' + this.name + ' .ui-dropdown-community';

		let dropdownLayer = this.dropDownLayer;
		let dropdownLayerTitle =  dropdownLayer + ' .select';
		let dropdownLayerList =  dropdownLayer + ' .option';

		// layer
		function toggleSelectLayer( parent ){
			let $p = parent;
			if( $p.hasClass( 'is-active' ) ){
				$p.removeClass( 'is-active' );
			} else {
				jQuery( dropdownLayer ).removeClass( 'is-active' ); // select메뉴가 복수일 경우 모두 제거
				$p.addClass( 'is-active' );
			}
		}

		//셀렉트메뉴 레이어: title 클릭 시 리스트 활성화/비활성화
		jQuery( 'body' ).on( 'click', dropdownLayerTitle, ( e ) => {

			if( jQuery( dropdownLayerTitle ).hasClass( 'disabled' ) ) return;

			let $parent = jQuery( dropdownLayerTitle ).parent( dropdownLayer );

			toggleSelectLayer( $parent );
		});

		//셀렉트메뉴 레이어: list 선택 시 title 변경

		jQuery( 'body' ).on( 'click', dropdownLayerList, ( e ) => {

			let $selectedDropdown = jQuery( dropdownLayerList ).parent( dropdownLayer );
			let $eventTartget = jQuery( e.target );

			this.textValue = $eventTartget.text();
			this.listValue = $eventTartget.data( 'value' );

			toggleSelectLayer( $selectedDropdown );

			jQuery( dropdownLayerList ).siblings( dropdownLayerTitle ).find( 'span' ).text( this.textValue ); // 타이틀 영역 텍스트 변경

			this.$callback.fire( this.listValue );

			//jQuery('input[type="hidden"]', $selectedDropdown).val(listValue).attr( 'data-value', textValue ).change(); // input 값 변경
		});

		//mobile
		jQuery( '#' + this.name ).on( 'change', 'select', ( evt ) => {
			let $eventTartget = jQuery( evt.target );
			this.listValue = $eventTartget.val();
			this.$callback.fire( this.listValue );
		});
	}

	addChange( callback ) {
		this.$callback.add( callback );
	}

	getNode() {
		return this.$_node;
	}

	setValue( val = '' ) {
		if( !val ) return;

		let valueNode = jQuery( this.dropDownLayer ).find( '.option' ).find( `[data-value="${val}"]` );

		if( valueNode.length ){
				let text = jQuery( this.dropDownLayer ).find( '.option' ).find( `[data-value="${val}"]` ).text();
				jQuery( this.dropDownLayer ).find( '.select' ).find( 'span' ).text( text || '' );
				this.textValue = text;
				this.listValue = val;
				//mobile
				if( val ) jQuery( '#' + this.name ).find( 'select' ).val( val );
		}
	}

	getValue() {
		return this.listValue;
	}

	template( _data, className = 'board-category' ){
		let mobileList = Tmpl.iterate({
			data: _data,
			template: ( _v ) => `<option value="${_v.key}">${_v.value}</option>`
		});

		let pcList = Tmpl.iterate({
			data: _data,
			template: ( _v ) => `<li class="ui-dropdown-custom_items" data-value="${_v.key}">${_v.value}</li>`
		});

		return `<div id="${this.name}" class="ui-dropdown-wrap ${className}">
				<!-- mobile -->
				<div class="ui-dropdown ui-dropdown-elements">
					<select name="${className}">
						${mobileList}
					</select>
					<i class="fe-icon-chevron_down"></i>
				</div>

				<!-- pc -->
				<div class="ui-dropdown ui-dropdown-community">
					<div class="select">
						<span>분류</span>
						<i class="fe-icon-chevron_down"></i>
					</div>
					<ul class="option">
						${pcList}
					</ul>
				</div>
			</div>`;
	}
}

module.exports = DropdownLayer;
