import React, {memo} from 'react';
import {useField} from 'formik';
import {RuleActionsType} from '@/constants/RuleActionsType';
import {useToggle} from '@/hooks/useToggle';
import {TextButton} from '@/components/@common/buttons/TextButton';
import {Checkbox} from '@/components/@common/forms/Checkbox';
import {CodeEditor} from '@/components/@common/misc/CodeEditor';
import {RuleActionScriptRequestWiki} from '../RuleActionScriptRequestWiki';
import {RuleActionScriptResponseWiki} from '../RuleActionScriptResponseWiki';
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

	const [requestWikiShown, toggleRequestWikiShown] = useToggle(false);
	const [responseWikiShown, toggleResponseWikiShown] = useToggle(false);

	return (
		<>
			<RuleRow title='Request:'>
				<div className={styles.main}>
					<div className={styles.primaryRow}>
						<Checkbox {...requestEnabledField}>Enabled</Checkbox>
						<TextButton onClick={toggleRequestWikiShown}>Wiki</TextButton>
					</div>
					{requestWikiShown && <RuleActionScriptRequestWiki />}
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
						<TextButton onClick={toggleResponseWikiShown}>Wiki</TextButton>
					</div>
					{responseWikiShown && <RuleActionScriptResponseWiki />}
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
