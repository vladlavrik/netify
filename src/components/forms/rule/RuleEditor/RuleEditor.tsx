import React, {useEffect} from 'react';
import {toJS} from 'mobx';
import {observer} from 'mobx-react-lite';
import {Rule} from '@/interfaces/rule';
import {useStores} from '@/stores/useStores';
import {RuleForm} from '../RuleForm';

export const RuleEditor = observer(() => {
	const {rulesStore} = useStores();

	const initialRule = toJS(rulesStore.editingRule);

	const handleSave = async (rule: Rule) => {
		await rulesStore.updateRule(rule);
		rulesStore.closeEditor();
	};

	const handleClose = () => {
		rulesStore.closeEditor();
	};

	useEffect(() => {
		if (!initialRule) {
			handleClose();
		}
	}, [initialRule]);

	if (!initialRule) {
		return null;
	}

	return <RuleForm mode='edit' initialRule={initialRule} onSave={handleSave} onCancel={handleClose} />;
});

RuleEditor.displayName = 'RuleEditor';
