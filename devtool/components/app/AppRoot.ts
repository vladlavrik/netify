import {LitElement, html, customElement} from '@polymer/lit-element';
import {classMap} from "lit-html/directives/class-map";
// import {Log} from '../../debugger/constants/Log';
import {Rule} from '../../debugger/constants/Rule';
import '../@common/IconButton';
import '../compose/ComposeRoot';
import '../rules/RulesRoot';
import '../logs/LogsRoot';
import {RulesRoot} from '../rules/RulesRoot';
import {LogsRoot} from '../logs/LogsRoot';
import './AppSectionHeader';
import './AppSeparatedSections';
import {AppSeparatedSections, resizeEvent} from './AppSeparatedSections';


declare global {
	interface HTMLElementTagNameMap {
		'app-root': AppRoot;
	}
}

/*
 * TODO
 * use "ifTrusty" directive
 * Add info hints
 * Add %fullUrl% to "replaceEndpoint"
 * Replace eventHandler prefix form "handle" to "on"
 * Format code style
 * Add feature: disable/enable rule
 * Use compose options from constants
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
			.header-control.type-clear {
				--icon-button-bg: url('/devtool/styles/icons/clear.svg');
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
					class="header-control type-clear"
					tooltip="Clear all rules"
					@click="${this.onClearRules}">
				</icon-button>
			</app-section-header>
			<rules-root
				class="section-content"
				slot="top-section"
				@requireRuleRemove="${this.onRequireRuleRemove}">
			</rules-root>

			<app-section-header slot="bottom-section">
				Logs
				<icon-button
					slot="controls"
					class="header-control type-clear"
					tooltip="Clear log"
					@click="${this.onClearLogs}">
				</icon-button>
				<icon-button
					slot="controls"
					class="${classMap({
						'header-control': true,
						'type-collapse': !this.logsCollapsed,
						'type-expand': this.logsCollapsed,
					})}"
					@click="${this.onToggleLogsShow}">
				</icon-button>
			</app-section-header>
			<logs-root
				class="section-content"
				slot="bottom-section"
				@requireRuleHighlight="${this.onRequireRuleHighlight}">
			</logs-root>
		</app-separated-sections>
		${this.composeShown ? (
			html`
				<compose-root
					id="compose"
					@requireComposeHide="${this.onHideCompose}"
					@requireComposeSave="${this.onSaveRule}">
				</compose-root>
			`
		) : ''}
		`;
	}
	
	public onToggleComposeShow = () => {
		this.composeShown = !this.composeShown;
		this.requestUpdate('composeShown', !this.composeShown);
	};
	
	public onHideCompose = (event: Event) => {
		event.stopPropagation();
		if (this.composeShown) {
			this.composeShown = false;
			this.requestUpdate('composeShown', true);
		}
	};

	private onSaveRule = (event: CustomEvent<{rule: Rule}>) => {
		// TODO
		console.log('onSaveRule', event.detail.rule);
	};

	private onClearRules = () => {
		// TODO
		console.log('onCleanRules');
	};

	private onClearLogs = () => {
		(this.shadowRoot!.querySelector('logs-root') as LogsRoot).clearLogs();
	};

/* TODO
	private onAddLog = (log: Log) => {
		(this.shadowRoot!.querySelector('logs-root') as LogsRoot).addLog(log);
	};
*/

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
		event.stopPropagation();
		const oldLogsCollapsed  = this.logsCollapsed;
		this.logsCollapsed = event.detail.edgesReached.bottom;
		if (this.logsCollapsed !== oldLogsCollapsed) {
			this.requestUpdate('logsCollapsed', oldLogsCollapsed);
		}
	}

	private onRequireRuleRemove(event: CustomEvent) {
		//TODO
		event.stopPropagation();
		console.log('requireRuleRemove', event.detail.id);
	}

	private onRequireRuleHighlight(event: CustomEvent) {
		event.stopPropagation();
		(this.shadowRoot!.querySelector('rules-root') as RulesRoot).highlightRule(event.detail.ruleId);
	}
}
