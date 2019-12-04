import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {observer, inject} from 'mobx-react';
import {BreakpointsStore} from '@/stores/BreakpointsStore';
import {RequestBreakpoint, ResponseBreakpoint} from '@/interfaces/breakpoint';
import {BreakpointOfRequest, BreakpointOfResponse} from '@/components/Breakpoint';

interface Props {
	breakpointsStore?: BreakpointsStore;
}

@inject('breakpointsStore')
@observer
export class Breakpoint extends React.Component<Props> {
	render() {
		const {activeBreakpoint, breakpoints} = this.props.breakpointsStore!;

		if (!activeBreakpoint) {
			return null;
		}


		return ReactDOM.createPortal(
			!(activeBreakpoint as ResponseBreakpoint).statusCode ? (
				<BreakpointOfRequest
					data={activeBreakpoint as RequestBreakpoint}
					onExecute={this.onBreakpointExecute}
					onLocalResponse={this.onBreakpointLocalResponse}
					onAbort={this.onBreakpointAbort}
				/>
			) : (
				<BreakpointOfResponse
					data={activeBreakpoint as ResponseBreakpoint}
					onExecute={this.onBreakpointExecute}
					onAbort={this.onBreakpointAbort}
				/>
			),
			document.getElementById('modal-root')!,
		);
	}
	private onBreakpointExecute = this.props.breakpointsStore!.execute.bind(this.props.breakpointsStore!);

	private onBreakpointLocalResponse = this.props.breakpointsStore!.localResponse.bind(this.props.breakpointsStore!);

	private onBreakpointAbort = this.props.breakpointsStore!.abort.bind(this.props.breakpointsStore!);
}
