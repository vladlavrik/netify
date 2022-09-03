import React, {memo} from 'react';
import {RulesHeader} from '../RulesHeader';
import {RulesList} from '../RulesList';
import styles from './rules.css';

export const Rules = memo(() => (
	<div className={styles.root}>
		<div className={styles.header}>
			<RulesHeader />
		</div>
		<div className={styles.content}>
			<RulesList />
		</div>
	</div>
));

Rules.displayName = 'Rules';
