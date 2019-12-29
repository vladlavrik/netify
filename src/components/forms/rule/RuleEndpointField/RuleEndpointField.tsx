import React, {memo, useCallback, useRef, useState} from 'react';
import {useFormikContext} from 'formik';
import {FieldRow} from '@/components/forms/common/FieldRow';
import {TextField} from '@/components/@common/forms/TextField';
import {TextButton} from '@/components/@common/buttons/TextButton';
import styles from './ruleEndpointField.css';

interface RuleEndpointField {
	name: string;
}

export const RuleEndpointField = memo<RuleEndpointField>(({name}) => {
	const [urlMacrosShown, setUrlMacrosShown] = useState(false);

	const form = useFormikContext();

	const endpointFieldRef = useRef<HTMLInputElement>(null);

	const handleUrlMacrosShownToggle = useCallback(() => setUrlMacrosShown(!urlMacrosShown), [urlMacrosShown]);

	const handleMacrosInsert = useCallback((event: React.MouseEvent<HTMLElement>) => {
		const macros = event.currentTarget.dataset.value!;
		const input = endpointFieldRef.current!;

		input.focus();

		const start = input.selectionStart || 0;
		const end = input.selectionEnd || 0;

		const value = input.value.substr(0, start) + macros + input.value.substr(end);

		// Temporary solution | TODO use field.onChange when it wil be fixed in formik
		form.setFieldValue(name, value);
		setUrlMacrosShown(false);
	}, []);

	return (
		<FieldRow title='Endpoint:'>
			<TextField
				ref={endpointFieldRef}
				className={styles.field}
				name={name}
				placeholder='Redirect a request by the new url'
				suffix={
					<div className={styles.macros}>
						<TextButton className={styles.macrosButton} tabIndex={-1} onClick={handleUrlMacrosShownToggle}>
							{urlMacrosShown ? 'close' : 'add macros'}
						</TextButton>
						{urlMacrosShown && (
							<div className={styles.macrosPicker}>
								<TextButton
									className={styles.macrosOption}
									data-value='%protocol%'
									onClick={handleMacrosInsert}>
									Protocol
								</TextButton>
								<TextButton
									className={styles.macrosOption}
									data-value='%hostname%'
									onClick={handleMacrosInsert}>
									Hostname
								</TextButton>
								<TextButton
									className={styles.macrosOption}
									data-value='%port%'
									onClick={handleMacrosInsert}>
									Port
								</TextButton>
								<TextButton
									className={styles.macrosOption}
									data-value='%path%'
									onClick={handleMacrosInsert}>
									Path
								</TextButton>
								<TextButton
									className={styles.macrosOption}
									data-value='%query%'
									onClick={handleMacrosInsert}>
									Query
								</TextButton>
							</div>
						)}
					</div>
				}
			/>
		</FieldRow>
	);
});

RuleEndpointField.displayName = 'RuleEndpointField';
