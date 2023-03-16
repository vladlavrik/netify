import React, {FC, ReactNode} from 'react';
import cn from 'classnames';
import styles from './ruleRow.css';

interface RuleRowProps {
	className?: string;
	title: string;
	children?: ReactNode;
}

export const RuleRow: FC<RuleRowProps> = ({className, title, children}) => (
	<div className={cn(styles.root, className)}>
		<p className={styles.title}>{title}</p>
		{children}
	</div>
);

RuleRow.displayName = 'RuleRow';
