import React, {memo} from 'react';
import {Field, FieldArray, FieldProps, getIn} from 'formik';
import {IconButton} from '@/components/@common/buttons/IconButton';
import {FieldError} from '@/components/@common/forms/FieldError';
import {TextField} from '@/components/@common/forms/TextField';
import AddIcon from './icons/add.svg';
import RemoveIcon from './icons/remove.svg';
import styles from './textArrayField.css';

interface TextArrayFieldProps {
	name: string;
	placeholder?: string;
	addControlTitle?: string;
	removeControlTitle?: string;
}

export const TextArrayField = memo<TextArrayFieldProps>((props) => {
	const {name, placeholder, addControlTitle = 'Add new one', removeControlTitle = 'Remove item'} = props;

	return (
		<ul className={styles.root}>
			<FieldArray
				name={name}
				render={(helpers) => {
					const list = getIn(helpers.form.values, name);
					return list.map((_: any, index: number) => (
						// eslint-disable-next-line react/no-array-index-key
						<li key={index} className={styles.item}>
							<div className={styles.entry}>
								<Field name={`${name}[${index}]`}>
									{({field}: FieldProps) => (
										<TextField className={styles.field} placeholder={placeholder} {...field} />
									)}
								</Field>

								{index === list.length - 1 ? (
									<IconButton
										className={styles.control}
										icon={<AddIcon />}
										tooltip={addControlTitle}
										onClick={() => helpers.push('')}
									/>
								) : (
									<IconButton
										className={styles.control}
										icon={<RemoveIcon />}
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

TextArrayField.displayName = 'TextArrayField';
