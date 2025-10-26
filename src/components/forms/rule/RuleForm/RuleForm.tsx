import React, {memo, useCallback, useMemo} from 'react';
import {Form, FormikProvider, useFormik} from 'formik';
import {Rule} from '@/interfaces/rule';
import {TextButton} from '@/components/@common/buttons/TextButton';
import {Modal} from '@/components/@common/popups/Modal';
import {RuleActionConfig} from '../RuleActionConfig';
import {RuleActionSwitcher} from '../RuleActionSwitcher';
import {RuleFilter} from '../RuleFilter';
import {RuleLabel} from '../RuleLabel';
import {deserializeRuleForm} from './deserializeRuleForm';
import {RuleFormSchema, ruleFormSchema} from './ruleFormSchema';
import {serializeRuleForm} from './serializeRuleForm';
import SaveIcon from '@/assets/icons/save.svg';
import styles from './ruleForm.css';

interface RuleFormProps {
	mode: 'create' | 'edit';
	initialRule: Rule;
	onSave(rule: Rule): void;
	onCancel(): void;
}

export const RuleForm = memo<RuleFormProps>((props) => {
	const {mode, initialRule, onSave, onCancel} = props;
	const initialValues = useMemo(() => serializeRuleForm(initialRule), [initialRule]);

	const handleSubmit = useCallback(
		(rawValue: RuleFormSchema) => {
			const castedValue = ruleFormSchema.cast(rawValue);
			const value = deserializeRuleForm(castedValue, initialRule.id, initialRule.active);
			onSave(value);
		},
		[initialRule.id, initialRule.active, onSave],
	);

	const form = useFormik<RuleFormSchema>({
		initialValues,
		validateOnBlur: true,
		validateOnChange: false,
		validationSchema: ruleFormSchema,
		onSubmit: handleSubmit,
	});

	return (
		<FormikProvider value={form}>
			<Modal
				title={mode === 'edit' ? 'Rule editing' : 'Create a new rule'}
				footer={
					<div className={styles.footerControls}>
						<TextButton
							icon={<SaveIcon />}
							styleType='outlined'
							iconStyleType='accept'
							type='submit'
							form='id-rule-editor-form'>
							Save the rule
						</TextButton>
						<TextButton styleType='secondary' onClick={onCancel}>
							Cancel
						</TextButton>
					</div>
				}
				onClose={onCancel}>
				<Form id='id-rule-editor-form' className={styles.form}>
					<RuleLabel />
					<RuleFilter />
					<RuleActionSwitcher />
					<div className={styles.config}>
						<RuleActionConfig />
					</div>
				</Form>
			</Modal>
		</FormikProvider>
	);
});

RuleForm.displayName = 'RuleForm';
