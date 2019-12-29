import React, {memo} from 'react';
import {Rule} from '@/interfaces/Rule';
import {RuleForm} from '../RuleForm';

interface RuleEditorProps {
	rule: Rule;
}

export const RuleEditor = memo<RuleEditorProps>(({rule}) => {
	return <RuleForm initialRule={rule} onCancel={() => {}} onSave={() => {}} />;
});

RuleEditor.displayName = 'RuleEditor';
