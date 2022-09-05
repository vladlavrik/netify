import React, {FC, ReactNode} from 'react';
import styles from './ruleViewerRow.css';

interface RuleViewerRowProps {
	title: string;
	children: ReactNode;
}

export const RuleViewerRow: FC<RuleViewerRowProps> = ({title, children}) => (
	<tr>
		<td className={styles.title}>{title}</td>
		<td className={styles.value}>{children}</td>
	</tr>
);
RuleViewerRow.displayName = 'RuleViewerRow';
