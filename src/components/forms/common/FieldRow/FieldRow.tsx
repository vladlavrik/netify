import React, {FC, ReactNode} from 'react';
import cn from 'classnames';
import styles from './fieldRow.css';

interface FieldRowProps {
	className?: string;
	title: ReactNode;
	children?: ReactNode;
}

export const FieldRow: FC<FieldRowProps> = ({className, title, children}) => (
	<div className={cn(styles.root, className)}>
		<p className={styles.title}>{title}</p>
		{children}
	</div>
);

FieldRow.displayName = 'FieldRow';
