import React from 'react';
import {observer} from 'mobx-react-lite';
import {useStores} from '@/stores/useStores';
import {RulesHeader} from '../RulesHeader';
import {RulesList} from '../RulesList';
import {RulesRemoveConfirm} from '../RulesRemoveConfirm';
import styles from './rules.css';

export const Rules = observer(() => {
	const {rulesStore} = useStores();

	const {removeConfirmShownFor} = rulesStore;

	return (
		<div className={styles.root}>
			<div className={styles.header}>
				<RulesHeader />
			</div>
			<div className={styles.content}>
				<RulesList />
			</div>

			{removeConfirmShownFor && <RulesRemoveConfirm ruleIds={removeConfirmShownFor} />}
		</div>
	);
});

Rules.displayName = 'Rules';
