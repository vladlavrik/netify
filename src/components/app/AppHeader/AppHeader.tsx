import React, {memo, useCallback} from 'react';
import {useStore} from 'effector-react';
import {$debuggerActive, $debuggerSwitching, $useRulesPerDomain, $logAllRequest, toggleDebuggerEnabled, toggleUseRulesPerDomain, toggleLogAllRequest} from '@/stores/uiStore'; // prettier-ignore
import {$hasActiveRules} from '@/stores/rulesStore';
import {useCompactModeCondition} from '@/hooks/useCompactModeCondition';
import {IconButton} from '@/components/@common/buttons/IconButton';
import {Checkbox} from '@/components/@common/forms/Checkbox';
import {WithTooltip} from '@/components/@common/misc/WithTooltip';
import ListeningActiveIcon from './icons/listening-active.svg';
import ListeningInactiveIcon from './icons/listening-inactive.svg';
import styles from './appHeader.css';

export const AppHeader = memo(function AppHeader() {
	const debuggerActive = useStore($debuggerActive);
	const debuggerSwitching = useStore($debuggerSwitching);
	const hasActiveRules = useStore($hasActiveRules);
	const useRulesPerDomain = useStore($useRulesPerDomain);
	const logAllRequest = useStore($logAllRequest);

	const isCompactMode = useCompactModeCondition();

	const handleToggleDebuggerEnabled = useCallback(() => toggleDebuggerEnabled(), []);
	const handleToggleUseRulesPerDomain = useCallback(() => toggleUseRulesPerDomain(), []);
	const handleToggleLogAllRequest = useCallback(() => toggleLogAllRequest(), []);

	return (
		<header className={styles.root}>
			<IconButton
				className={styles.debuggerSwitcher}
				disabled={!hasActiveRules}
				tooltip={debuggerActive ? 'Stop requests listening' : 'Start requests listening'}
				icon={debuggerActive ? <ListeningActiveIcon /> : <ListeningInactiveIcon />}
				onClick={handleToggleDebuggerEnabled}>
				{!debuggerSwitching && debuggerActive && 'Listening'}
				{!debuggerSwitching && !debuggerActive && 'Inactive'}
				{debuggerSwitching && debuggerActive && 'Stopping'}
				{debuggerSwitching && !debuggerActive && 'Starting'}
			</IconButton>

			<div className={styles.separator} />

			<WithTooltip
				tooltip={
					<span>
						If checked - only rules created within
						<br />
						the current page origin will be shown
						<br />
						in the list of rules.
					</span>
				}>
				<Checkbox
					className={styles.control}
					checked={useRulesPerDomain}
					onChange={handleToggleUseRulesPerDomain}>
					Rules per site
				</Checkbox>
			</WithTooltip>

			{!isCompactMode && false /* TODO waiting for feature implementation */ && (
				<WithTooltip
					tooltip={
						<span>
							If checked - all requests will be logged,
							<br />
							not just those affected by the rules.
						</span>
					}>
					<Checkbox className={styles.control} checked={logAllRequest} onChange={handleToggleLogAllRequest}>
						Log all requests
					</Checkbox>
				</WithTooltip>
			)}
		</header>
	);
});
