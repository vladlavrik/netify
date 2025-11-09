import React from 'react';
import {observer} from 'mobx-react-lite';
import {useStores} from '@/stores/useStores';
import {SelectField} from '@/components/@common/forms/SelectField';
import {Modal} from '@/components/@common/popups/Modal';
import {BreakpointRequest} from '../BreakpointRequest';
import {BreakpointResponse} from '../BreakpointResponse';
import styles from './breakpoint.css';

export const Breakpoint = observer(() => {
	const {tabStore, breakpointsStore} = useStores();

	const {targetTabUrlOrigin} = tabStore;
	const list = breakpointsStore.list;
	const activeBreakpoint = breakpointsStore.activeBreakpoint;

	const getRelativeUrl = (absoluteUrl: string) => {
		return targetTabUrlOrigin && absoluteUrl.startsWith(targetTabUrlOrigin)
			? absoluteUrl.substring(targetTabUrlOrigin.length)
			: absoluteUrl;
	};

	const getBreakpointTitle = (index: string) => {
		const breakpoint = list[Number(index)]!;
		const time = new Date(breakpoint.timestamp).toLocaleTimeString('en-GB', {
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
		});
		const url = getRelativeUrl(breakpoint.data.url || '');
		return `${breakpoint.stage === 'Request' ? '⇨' : '⇦'} [${time}] ${url}`;
	};

	const handleActiveBreakpointChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const index = Number(event.currentTarget.value);
		breakpointsStore.setActiveBreakpointIndex(index);
	};

	if (list.length === 0) {
		return null;
	}

	// TODO add feature to hide (minimize) active intercepted request
	return (
		<Modal
			styleType='attention'
			title={
				<>
					{list.length === 1 && activeBreakpoint ? (
						<p className={styles.headerContent}>
							Intercepted {activeBreakpoint.stage === 'Request' ? 'request' : 'response'}:
							<span className={styles.requestInfo} title={activeBreakpoint.data.url}>
								{getRelativeUrl(activeBreakpoint.data.url)}
							</span>
						</p>
					) : (
						<div className={styles.headerContent}>
							Intercepted requests:
							<SelectField
								className={styles.requestSelect}
								options={list.map((item, index) => index.toString())}
								optionTitleGetter={getBreakpointTitle}
								onChange={handleActiveBreakpointChange}
							/>
						</div>
					)}
				</>
			}>
			<>
				{activeBreakpoint?.stage === 'Request' && (
					<BreakpointRequest key={activeBreakpoint.requestId} breakpoint={activeBreakpoint} />
				)}
				{activeBreakpoint?.stage === 'Response' && (
					<BreakpointResponse key={activeBreakpoint.requestId} breakpoint={activeBreakpoint} />
				)}
			</>
		</Modal>
	);
});

Breakpoint.displayName = 'Breakpoint';
