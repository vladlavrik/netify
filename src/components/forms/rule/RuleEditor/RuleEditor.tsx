import React, {memo} from 'react';
import {Rule} from '@/interfaces/Rule';
import {RuleForm} from '../RuleForm';

interface RuleEditorProps {
	rule: Rule;
	onSave(rule: Rule): void;
	onCancel(): void;
}

export const RuleEditor = memo<RuleEditorProps>(({rule, onSave, onCancel}) => {
	return <RuleForm initialRule={rule} onSave={onSave} onCancel={onCancel} />;
});

RuleEditor.displayName = 'RuleEditor';
