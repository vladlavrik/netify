import React, {memo, useMemo} from 'react';
import {useFormik, Form, FormikProvider} from 'formik';
import {Rule} from '@/interfaces/rule';
import {ruleFormSchema, RuleFormSchema} from '@/forms/rule';
import {Button} from '@/components/@common/buttons/Button';
import {serializeRuleForm} from '@/forms/rule/serializeRuleForm';
import {RuleFilter} from '../RuleFilter';
import {RuleActionSwitcher} from '../RuleActionSwitcher';
import {RuleActionConfig} from '../RuleActionConfig';
import styles from './ruleForm.css';

interface RuleFormProps {
	initialRule: Rule;
	onSave(rule: Rule): void;
	onCancel(): void;
}

export const RuleForm = memo<RuleFormProps>(({initialRule, onSave, onCancel}) => {
	const initialValues = useMemo(() => serializeRuleForm(initialRule), [initialRule]);

	const form = useFormik<RuleFormSchema>({
		initialValues,
		validateOnBlur: true,
		validateOnChange: false,
		validationSchema: ruleFormSchema,
		onSubmit(values) {
			console.log('submit', values);
		},
	});

	return (
		<div className={styles.root}>
			<FormikProvider value={form}>
				<Form className={styles.form}>
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
