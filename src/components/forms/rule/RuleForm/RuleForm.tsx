import React, {memo, useCallback, useMemo} from 'react';
import {Form, FormikProvider, useFormik} from 'formik';
import {Rule} from '@/interfaces/rule';
import {Button} from '@/components/@common/buttons/Button';
import {deserializeRuleForm, RuleFormSchema, ruleFormSchema, serializeRuleForm} from '@/forms/rule';
import {RuleActionConfig} from '../RuleActionConfig';
import {RuleActionSwitcher} from '../RuleActionSwitcher';
import {RuleFilter} from '../RuleFilter';
import {RuleLabel} from '../RuleLabel';
import styles from './ruleForm.css';

interface RuleFormProps {
	initialRule: Rule;
	onSave(rule: Rule): void;
	onCancel(): void;
}

export const RuleForm = memo<RuleFormProps>(({initialRule, onSave, onCancel}) => {
	const initialValues = useMemo(() => serializeRuleForm(initialRule), [initialRule]);

	const handleSubmit = useCallback(
		(rawValue: RuleFormSchema) => {
			const value = deserializeRuleForm(rawValue, initialRule.id, initialRule.active);
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
		<div className={styles.root}>
			<FormikProvider value={form}>
				<Form className={styles.form}>
					<RuleLabel />
					<RuleFilter />
					<RuleActionSwitcher />
					<div className={styles.config}>
						<RuleActionConfig />
					</div>

					<div className={styles.controls}>
						<Button className={styles.saveButton} styleType='dark' type='submit'>
							Save
						</Button>
						<Button onClick={onCancel}>Cancel</Button>
					</div>
				</Form>
			</FormikProvider>
		</div>
	);
});

RuleForm.displayName = 'RuleForm';
