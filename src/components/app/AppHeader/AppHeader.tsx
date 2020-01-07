import React, {memo, useCallback} from 'react';
import {useStore} from 'effector-react';
import classNames from 'classnames';
import {$debuggerActive, $debuggerSwitching, $useRulesPerDomain, $logAllRequest, toggleDebuggerEnabled, toggleUseRulesPerDomain, toggleLogAllRequest} from '@/stores/uiStore'; // prettier-ignore
import {$hasRules} from '@/stores/rulesStore';
import {useCompactModeCondition} from '@/hooks/useCompactModeCondition';
import {IconButton} from '@/components/@common/buttons/IconButton';
import {Checkbox} from '@/components/@common/forms/Checkbox';
import {WithTooltip} from '@/components/@common/misc/WithTooltip';
import styles from './appHeader.css';

export const AppHeader = memo(() => {
	const debuggerActive = useStore($debuggerActive);
	const debuggerSwitching = useStore($debuggerSwitching);
	const hasRules = useStore($hasRules);
	const useRulesPerDomain = useStore($useRulesPerDomain);
	const logAllRequest = useStore($logAllRequest);

	const isCompactMode = useCompactModeCondition();

	const handleToggleDebuggerEnabled = useCallback(() => toggleDebuggerEnabled(), []);
	const handleToggleUseRulesPerDomain = useCallback(() => toggleUseRulesPerDomain(), []);
	const handleToggleLogAllRequest = useCallback(() => toggleLogAllRequest(), []);

	return (
		<header className={styles.root}>
			<IconButton
				className={classNames(styles.debuggerSwitcher, debuggerActive ? styles.active : styles.inactive)}
				disabled={!hasRules}
				tooltip={debuggerActive ? 'Disable debugger' : 'Enable debugger'}
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
						the current domain will be shown in
						<br />
						the list of rules.
					</span>
				}>
				<Checkbox
					className={styles.control}
					checked={useRulesPerDomain}
					onChange={handleToggleUseRulesPerDomain}>
					Rules per domain
				</Checkbox>
			</WithTooltip>

			{!isCompactMode && (
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

AppHeader.displayName = 'AppHeader';
