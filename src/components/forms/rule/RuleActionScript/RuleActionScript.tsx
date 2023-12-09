import React, {memo} from 'react';
import {useField} from 'formik';
import {RuleActionsType} from '@/constants/RuleActionsType';
import {Checkbox} from '@/components/@common/forms/Checkbox';
import {CodeEditor} from '@/components/@common/forms/CodeEditor';
import {RuleRow} from '../RuleRow';
import styles from './ruleActionScript.css';

export const RuleActionScript = memo(() => {
	const [requestEnabledField] = useField({
		name: `actionConfigs.${RuleActionsType.Script}.request.enabled`,
		type: 'checkbox',
	});
	const [responseEnabledField] = useField({
		name: `actionConfigs.${RuleActionsType.Script}.response.enabled`,
		type: 'checkbox',
	});
	const [requestCodeField, , {setValue: setRequestCodeField}] = useField(
		`actionConfigs.${RuleActionsType.Script}.request.code`,
	);
	const [responseCodeField, , {setValue: setResponseCodeField}] = useField(
		`actionConfigs.${RuleActionsType.Script}.response.code`,
	);

	return (
		<>
			<RuleRow title='Request:'>
				<div className={styles.main}>
					<div className={styles.primaryRow}>
						<Checkbox {...requestEnabledField}>Enabled</Checkbox>
					</div>
					{requestEnabledField.checked && (
						<CodeEditor
							className={styles.codeField}
							value={requestCodeField.value}
							onChange={setRequestCodeField}
						/>
					)}
				</div>
			</RuleRow>
			<RuleRow title='Response:'>
				<div className={styles.main}>
					<div className={styles.primaryRow}>
						<Checkbox {...responseEnabledField}>Enabled</Checkbox>
					</div>
					{responseEnabledField.checked && (
						<CodeEditor
							className={styles.codeField}
							value={responseCodeField.value}
							onChange={setResponseCodeField}
						/>
					)}
				</div>
			</RuleRow>
		</>
	);
});

RuleActionScript.displayName = 'RuleActionScript';
