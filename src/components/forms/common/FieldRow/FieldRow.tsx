import React, {memo, ReactNode} from 'react';
import classNames from 'classnames';
import styles from './fieldRow.css';

interface FieldRowProps {
	className?: string;
	title: ReactNode;
	children?: ReactNode;
}

export const FieldRow = memo(({className, title, children}: FieldRowProps) => (
	<div className={classNames(styles.root, className)}>
		<p className={styles.title}>{title}</p>
		{children}
	</div>
));

FieldRow.displayName = 'FieldRow';
