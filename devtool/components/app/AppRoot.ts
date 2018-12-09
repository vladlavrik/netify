import {LitElement, html, customElement} from '@polymer/lit-element';
import {classMap} from "lit-html/directives/class-map";
import '../@common/IconButton';
import '../compose/ComposeRoot';
import './AppSectionHeader';
import './AppSeparatedSections';
import {AppSeparatedSections, resizeEvent} from './AppSeparatedSections';


declare global {
	interface HTMLElementTagNameMap {
		'app-root': AppRoot;
	}
}

/*
 * TODO use "ifTrusty" directive
 */

@customElement('app-root' as any)
export class AppRoot extends LitElement {

	private composeShown = false;
	private logsCollapsed = false;

	protected render() {
		return html`
		<style>
			:host {
				display: flex;
				position: relative;
				height: 100vh;
				flex-direction: column;
			}
			.section {
				min-height: 30px;
			}
			.header-control {
				margin: 0 6px;
			}
			.header-control.type-add,
			.header-control.type-close {
				--icon-button-bg: url('/devtool/styles/icons/add.svg');
			}
			.header-control.type-close {
				--icon-button-rotate: 45deg;
			}
			.header-control.type-clean {
				--icon-button-bg: url('/devtool/styles/icons/clean.svg');
			}
			.header-control.type-collapse {
				--icon-button-bg: url('/devtool/styles/icons/panel-collapse.svg');
			}
			.header-control.type-expand {
				--icon-button-bg: url('/devtool/styles/icons/panel-expand.svg');
			}
			#sectionSeparator {
				padding: 2px 0;
				cursor: row-resize;
			}
			#sectionSeparator::before {
				display: block;
				content: '';
				height: 3px;
				background: #777;
			}
			#compose {
				position: absolute;
				top: 28px;
				left: 0;
				right: 0;
				bottom: 0;
				border-top: #555555 1px solid;
				background: #383838;
				z-index: 1;
			}
			#compose::before {
				content: '';
				display: block;
				position: absolute;
				width: 10px;
				height: 6px;
				right: 40px;
				top: -6px;
				clip-path: polygon(0 100%, 50% 0, 100% 100%);
				background: #555555;
			}
			.section-content {
				height: calc(100% - 29px);
			}
		</style>

		<app-separated-sections
			minHeight="30"
			@separatedSectionResize="${this.onSectionsResize}">
			<app-section-header slot="top-section">
				Rules
				<icon-button
					slot="controls"
					id="controlCompose"
					class="${classMap({
						'header-control': true,
						'type-add': !this.composeShown,
						'type-close': this.composeShown,
					})}"
					tooltip="${this.composeShown ? 'Cancel add' : 'Add rule'}"
					@click="${this.onToggleComposeShow}">
				</icon-button>
				<icon-button
					slot="controls"
					id="controlCleanRules"
					class="header-control type-clean"
					tooltip="Clean all rules"
					@click="${this.onCleanRules}">
				</icon-button>
			</app-section-header>
			<div class="section-content" slot="top-section">
				rules
				<!--<rules-root></rules-root>-->
			</div>


			<app-section-header slot="bottom-section">
				Logs
				<icon-button
					slot="controls"
					id="controlCleanLogs"
					class="header-control type-clean"
					tooltip="Clean log"
					@click="${this.onCleanLogs}">
				</icon-button>
				<icon-button
					slot="controls"
					id="controlToggleLogs"
					class="${classMap({
						'header-control': true,
						'type-collapse': !this.logsCollapsed,
						'type-expand': this.logsCollapsed,
					})}"
					@click="${this.onToggleLogsShow}">
				</icon-button>
			</app-section-header>
			<div class="section-content" slot="bottom-section">
				logs
				<!--<logs-root></logs-root>-->
			</div>
		</app-separated-sections>
		${this.composeShown ? (
			html`
				<compose-root
					id="compose"
					@requireComposeHide="${this.onHideCompose}">
				</compose-root>
			`
		) : ''} 
		`;
	}

	public onHideCompose = () => {
		if (this.composeShown) {
			this.composeShown = false;
			this.requestUpdate('composeShown', true);
		}
	};

	public onToggleComposeShow = () => {
		this.composeShown = !this.composeShown;
		this.requestUpdate('composeShown', !this.composeShown);
	};

	private onCleanRules = () => {
		console.log('onCleanRules');
	};

	private onCleanLogs = () => {
		console.log('onCleanLogs');
	};

	private onToggleLogsShow = () => {
		let ratio;
		if (this.logsCollapsed) {
			ratio = 50;
		} else {
			ratio = 100;
		}

		(this.shadowRoot!.querySelector('app-separated-sections') as AppSeparatedSections).setRatio(ratio);

		this.logsCollapsed = !this.logsCollapsed;
		this.requestUpdate('logsCollapsed', !this.logsCollapsed);
	};

	private onSectionsResize(event: CustomEvent<resizeEvent>) {
		const oldLogsCollapsed  = this.logsCollapsed;
		this.logsCollapsed = event.detail.edgesReached.bottom;
		if (this.logsCollapsed !== oldLogsCollapsed) {
			this.requestUpdate('logsCollapsed', oldLogsCollapsed);
		}
	}
}
