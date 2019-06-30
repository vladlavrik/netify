import * as React from 'react';
import classNames from 'classnames';
import {Checkbox} from '@/components/@common/Checkbox';
import styles from './expandableCheckbox.css';
import {useField} from 'formik';

interface Props {
	className?: string;
	name: string;
	label?: string;
	disabled?: boolean;
	children: React.ReactNode;
}

export const ExpandableCheckbox = React.memo(({className, name, label, disabled, children}: Props) => {
	const [{value}] = useField<boolean>(name);

	return (
		<div className={classNames(styles.root, className)}>
			<Checkbox className={styles.checkbox} name={name} disabled={disabled}>
				{label}
			</Checkbox>

			<div className={styles.content}>{value && children}</div>
		</div>
	)
});
