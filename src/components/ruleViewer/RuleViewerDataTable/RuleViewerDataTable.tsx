import React, {memo} from 'react';
import styles from './RuleViewerDataTable.css';

interface RuleViewerDataTableProps {
	values: [string, string][];
}

export const RuleViewerDataTable = memo<RuleViewerDataTableProps>(function RuleViewerDataTable({values}) {
	return (
		<table className={styles.root}>
			<tbody>
				{values.map(([key, value], index) => (
					<tr key={key + index.toString()} className={styles.row}>
						<td className={styles.title}>{key}:</td>
						<td className={styles.value}>{value}</td>
					</tr>
				))}
			</tbody>
		</table>
	);
});
