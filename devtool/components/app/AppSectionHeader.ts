import BaseUIElement from '../../helpers/BaseUIElement';

class AppSectionHeader extends BaseUIElement {
	static template = BaseUIElement.htmlToTemplate(`
		<style>
			:host {
				display: flex;
				height: 28px;
				align-items: center;
				border-bottom: #555555 1px solid;
			}
			.title {
				color: #A5A5A5;
				flex-grow: 1;
				flex-shrink: 1;
				overflow: hidden;
				text-overflow: ellipsis;
				font-size: 12px;
				margin: 0 0 0 8px;
			}
		</style>
		
		<p class="title">
			<slot></slot>
		</p>
		<slot name="controls"></slot>
	`);

	constructor(){
		super();
		this.render();
	}
}


customElements.define('app-section-header', AppSectionHeader);
