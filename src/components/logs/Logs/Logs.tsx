import React, {memo, useCallback} from 'react';
import classNames from 'classnames';
import {useStore} from 'effector-react';
import {$secondarySectionCollapsed, highlightRule, toggleSecondarySectionCollapse} from '@/stores/uiStore';
import {$logs, clearLogsList} from '@/stores/logsStore';
import {$rules} from '@/stores/rulesStore';
import {SectionHeader} from '@/components/@common/misc/SectionHeader';
import {IconButton} from '@/components/@common/buttons/IconButton';
import {LogsItem} from '../LogsItem';
import styles from './logs.css';

// TODO add in section width in px
export const Logs = memo(() => {
	const logs = useStore($logs);
	const collapsed = useStore($secondarySectionCollapsed);

	const listIsEmpty = logs.length === 0;

	const handleRuleFollow = useCallback((ruleId: string) => {
		if ($rules.getState().some(rule => rule.id === ruleId)) {
			highlightRule(ruleId);
		} else {
			// TODO shoe en error: The rule is not exist (maybe it was removed).
		}
	}, []);

	const onToggleSectionCollapsed = useCallback(() => toggleSecondarySectionCollapse(), []);

	const handleClearList = useCallback(() => clearLogsList(), []);

	return (
		<div className={styles.root}>
			<SectionHeader title='Logs'>
				<IconButton
					className={classNames(styles.control, styles.typeClear)}
					tooltip='Clear log'
					disabled={listIsEmpty}
					onClick={handleClearList}
				/>
				<IconButton
					className={classNames(styles.control, collapsed ? styles.typeExpand : styles.typeCollapse)}
					onClick={onToggleSectionCollapsed}
				/>
			</SectionHeader>

			<div className={styles.content}>
				{logs.length === 0 ? (
					<p className={styles.placeholder}>No logs here</p>
				) : (
					<ul className={styles.list}>
						{logs.map(item => (
							<li key={item.requestId + item.requestStage} className={styles.item}>
								<LogsItem
									ruleId={item.ruleId}
									requestStage={item.requestStage}
									date={item.date}
									url={item.url}
									resourceType={item.resourceType}
									method={item.method}
									onFollowRule={handleRuleFollow}
								/>
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
});

Logs.displayName = 'Logs';
