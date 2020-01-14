import React, {memo, useCallback, useContext} from 'react';
import {useStore, useStoreMap} from 'effector-react';
import {Rule} from '@/interfaces/Rule';
import {DbContext} from '@/contexts/dbContext';
import {$rules, updateRule} from '@/stores/rulesStore';
import {$ruleEditorShownFor, hideRuleEditor} from '@/stores/uiStore';
import {RuleForm} from '../RuleForm';

export const RuleEditor = memo(function RuleEditor() {
	const {rulesMapper} = useContext(DbContext)!;

	const initialRuleId = useStore($ruleEditorShownFor);
	const initialRule = useStoreMap({
		store: $rules,
		keys: [initialRuleId],
		fn: (rules, [ruleId]) => rules.find(({id}) => id === ruleId),
	})!;

	const handleSave = useCallback(async (rule: Rule) => {
		await updateRule({rulesMapper, rule});
		hideRuleEditor();
	}, []);

	const handleCancel = useCallback(async () => {
		hideRuleEditor();
	}, []);

	return <RuleForm initialRule={initialRule} onSave={handleSave} onCancel={handleCancel} />;
});
