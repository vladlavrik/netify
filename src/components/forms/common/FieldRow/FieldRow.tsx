import React, {memo, ReactNode} from 'react';
import classNames from 'classnames';
import styles from './fieldRow.css';

interface FieldRowProps {
	className?: string;
	title: ReactNode;
	children?: ReactNode;
}

export const FieldRow = memo<FieldRowProps>(({className, title, children}) => (
	<div className={classNames(styles.root, className)}>
		<p className={styles.title}>{title}</p>
		{children}
	</div>
));

FieldRow.displayName = 'FieldRow';
