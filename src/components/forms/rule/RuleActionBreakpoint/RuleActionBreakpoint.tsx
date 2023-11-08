import React, {memo} from 'react';
import {useField} from 'formik';
import {BreakpointStage} from '@/constants/BreakpointStage';
import {RuleActionsType} from '@/constants/RuleActionsType';
import {RadioButton} from '@/components/@common/forms/RadioButton';
import {RuleRow} from '../RuleRow';
import styles from './ruleActionBreakpoint.css';

const valueDisplayNames: Record<BreakpointStage, string> = {
	[BreakpointStage.Request]: 'Request',
	[BreakpointStage.Response]: 'Response',
	[BreakpointStage.Both]: 'Both',
};

export const RuleActionBreakpoint = memo(() => {
	const name = `actionConfigs.${[RuleActionsType.Breakpoint]}.stage`;
	const [field] = useField(name);

	return (
		<RuleRow className={styles.root} title={chrome.i18n.getMessage('stage')}>
			{Object.values(BreakpointStage).map((value) => (
				<RadioButton
					key={value}
					className={styles.option}
					{...field}
					value={value}
					checked={field.value === value}>
					{valueDisplayNames[value]}
				</RadioButton>
			))}
		</RuleRow>
	);
});

RuleActionBreakpoint.displayName = 'RuleActionBreakpoint';
