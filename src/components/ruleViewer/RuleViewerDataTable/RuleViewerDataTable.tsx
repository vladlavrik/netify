import React, {FC} from 'react';
import styles from './ruleViewerDataTable.css';

interface RuleViewerDataTableProps {
	values: [string, string][];
}

export const RuleViewerDataTable: FC<RuleViewerDataTableProps> = ({values}) => (
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

RuleViewerDataTable.displayName = 'RuleViewerDataTable';
