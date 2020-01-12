import React, {memo, ReactNode} from 'react';
import styles from './RuleViewerRow.css';

interface RuleViewerRowProps {
	title: string;
	children: ReactNode;
}

export const RuleViewerRow = memo<RuleViewerRowProps>(function RuleViewerRow({title, children}) {
	return (
		<tr>
			<td className={styles.title}>{title}</td>
			<td className={styles.value}>{children}</td>
		</tr>
	);
});
