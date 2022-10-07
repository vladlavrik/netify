import React from 'react';
import {observer} from 'mobx-react-lite';
import {SelectField} from '@/components/@common/forms/SelectField';
import {useStores} from '@/stores/useStores';
import {BreakpointRequest} from '../BreakpointRequest';
import {BreakpointResponse} from '../BreakpointResponse';
import styles from './breakpoint.css';

export const Breakpoint = observer(() => {
	const {rulesStore, breakpointsStore} = useStores();

	const {currentOrigin} = rulesStore;
	const list = breakpointsStore.list;
	const activeBreakpoint = breakpointsStore.activeBreakpoint;

	const getRelativeUrl = (absoluteUrl: string) => {
		return absoluteUrl.startsWith(currentOrigin) ? absoluteUrl.substring(currentOrigin.length) : absoluteUrl;
	};

	const getBreakpointTitle = (index: string) => {
		const breakpoint = list[Number(index)]!;
		const url = getRelativeUrl(breakpoint.data.url || '');
		return `${breakpoint.stage === 'Request' ? '⇨' : '⇦'} #${breakpoint.requestId} ${url}`;
	};

	const handleActiveBreakpointChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const index = Number(event.currentTarget.value);
		breakpointsStore.setActiveBreakpointIndex(index);
	};

	if (list.length === 0) {
		return null;
	}

	return (
		<div className={styles.root}>
			<div className={styles.header}>
				{list.length === 1 && activeBreakpoint ? (
					<>
						<p className={styles.title}>
							Intercepted {activeBreakpoint.stage === 'Request' ? 'request' : 'Response'}:
						</p>
						<p className={styles.requestInfo} title={activeBreakpoint.data.url}>
							{getRelativeUrl(activeBreakpoint.data.url)}
						</p>
					</>
				) : (
					<>
						<p className={styles.title}>Intercepted requests:</p>
						<SelectField
							className={styles.requestSelect}
							options={list.map((item, index) => index.toString())}
							optionTitleGetter={getBreakpointTitle}
							onChange={handleActiveBreakpointChange}
						/>
					</>
				)}
			</div>

			{activeBreakpoint?.stage === 'Request' && (
				<BreakpointRequest key={activeBreakpoint.requestId} breakpoint={activeBreakpoint} />
			)}
			{activeBreakpoint?.stage === 'Response' && (
				<BreakpointResponse key={activeBreakpoint.requestId} breakpoint={activeBreakpoint} />
			)}
		</div>
	);
});

Breakpoint.displayName = 'Breakpoint';
