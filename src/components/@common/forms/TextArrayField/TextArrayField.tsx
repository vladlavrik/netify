import React, {memo} from 'react';
import cn from 'classnames';
import {FieldArray, getIn} from 'formik';
import {IconButton} from '@/components/@common/buttons/IconButton';
import {TextField} from '@/components/@common/forms/TextField';
import {FieldError} from '@/components/@common/forms/FieldError';
import styles from './textArrayField.css';

interface TextArrayFieldProps {
	name: string;
	placeholder?: string;
	addControlTitle?: string;
	removeControlTitle?: string;
}

export const TextArrayField = memo<TextArrayFieldProps>(function TextArrayField(props) {
	const {name, placeholder, addControlTitle = 'Add new one', removeControlTitle = 'Remove item'} = props;

	return (
		<ul className={styles.root}>
			<FieldArray
				name={name}
				render={helpers => {
					const list = getIn(helpers.form.values, name);
					return list.map((_: any, index: number) => (
						// eslint-disable-next-line react/no-array-index-key
						<li key={index} className={styles.item}>
							<div className={styles.entry}>
								<TextField
									className={styles.field}
									name={`${name}[${index}]`}
									placeholder={placeholder}
								/>

								{index === list.length - 1 ? (
									<IconButton
										className={cn(styles.control, styles.typeAdd)}
										tooltip={addControlTitle}
										onClick={() => helpers.push('')}
									/>
								) : (
									<IconButton
										className={cn(styles.control, styles.typeRemove)}
										tooltip={removeControlTitle}
										onClick={() => helpers.remove(index)}
									/>
								)}
							</div>
							<FieldError name={`${name}[${index}]`} />
						</li>
					));
				}}
			/>
		</ul>
	);
});
