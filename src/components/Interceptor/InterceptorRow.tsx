import * as React from 'react';
import styles from './interceptorRow.css';

interface Props {
	title: string;
	children?: React.ReactNode;
}

export const InterceptorRow = React.memo(({title, children}: Props) => (
	<div className={styles.root}>
		<p className={styles.title}>{title}</p>
		{children}
	</div>
));
