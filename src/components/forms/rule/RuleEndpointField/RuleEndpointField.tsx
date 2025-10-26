import React, {memo, useCallback, useRef} from 'react';
import {useField} from 'formik';
import {InlineButton} from '@/components/@common/buttons/InlineButton';
import {FieldError} from '@/components/@common/forms/FieldError';
import {TextField} from '@/components/@common/forms/TextField';
import {Dropdown} from '@/components/@common/misc/Dropdown';
import styles from './ruleEndpointField.css';

interface RuleEndpointFieldProps {
	name: string;
}

export const RuleEndpointField = memo<RuleEndpointFieldProps>(({name}) => {
	const [field, , {setValue}] = useField(name);

	const endpointFieldRef = useRef<HTMLInputElement>(null);

	const handleMacrosInsert = useCallback(
		(event: React.MouseEvent<HTMLElement>) => {
			const macros = event.currentTarget.dataset.value!;
			const input = endpointFieldRef.current!;

			input.focus();

			const start = input.selectionStart || 0;
			const end = input.selectionEnd || 0;

			const value = input.value.substr(0, start) + macros + input.value.substr(end);

			setValue(value);
		},
		[setValue],
	);

	return (
		<div className={styles.root}>
			<TextField
				ref={endpointFieldRef}
				className={styles.field}
				placeholder='Redirect a request by the new url'
				suffixChildren={
					<Dropdown
						className={styles.macrosButton}
						render={(dropdownProps, {expanded}) => (
							<InlineButton {...dropdownProps} tabIndex={-1}>
								{expanded ? 'close' : 'add macros'}
							</InlineButton>
						)}
						content={
							<div className={styles.macrosPicker}>
								<InlineButton
									className={styles.macrosOption}
									data-value='[protocol]//'
									onClick={handleMacrosInsert}>
									Protocol
								</InlineButton>
								<InlineButton
									className={styles.macrosOption}
									data-value='[hostname]'
									onClick={handleMacrosInsert}>
									Hostname
								</InlineButton>
								<InlineButton
									className={styles.macrosOption}
									data-value='[port]'
									onClick={handleMacrosInsert}>
									Port
								</InlineButton>
								<InlineButton
									className={styles.macrosOption}
									data-value='[path]'
									onClick={handleMacrosInsert}>
									Path
								</InlineButton>
								<InlineButton
									className={styles.macrosOption}
									data-value='[query]'
									onClick={handleMacrosInsert}>
									Query
								</InlineButton>
							</div>
						}
					/>
				}
				{...field}
			/>

			<FieldError name={name} />
		</div>
	);
});

RuleEndpointField.displayName = 'RuleEndpointField';
