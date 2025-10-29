import React, {useEffect, useMemo} from 'react';
import {observer} from 'mobx-react-lite';
import {useStores} from '@/stores/useStores';
import {PopUpConfirm} from '@/components/@common/popups/PopUpConfirm';

interface RulesRemoveConfirmProps {
	ruleIds: string[] | 'all';
}

export const RulesRemoveConfirm = observer<RulesRemoveConfirmProps>((props) => {
	const {ruleIds} = props;
	const {rulesStore, tabStore} = useStores();
	const {targetTabUrlOrigin} = tabStore;

	const handleConfirm = () => {
		if (ruleIds === 'all') {
			rulesStore.removeAllRules();
		} else {
			rulesStore.removeRules(ruleIds);
		}
	};

	const handleCancel = () => {
		rulesStore.finishRemoveConfirm();
	};

	const originalTargetTabUrlOrigin = useMemo(() => targetTabUrlOrigin, []);
	useEffect(() => {
		if (originalTargetTabUrlOrigin !== targetTabUrlOrigin) {
			rulesStore.finishRemoveConfirm();
		}
	}, [targetTabUrlOrigin]);

	return (
		<PopUpConfirm onConfirm={handleConfirm} onCancel={handleCancel}>
			{ruleIds === 'all' && 'Remove all rules forever?'}
			{ruleIds !== 'all' && ruleIds.length === 1 && 'Remove the rule forever?'}
			{ruleIds !== 'all' && ruleIds.length !== 1 && 'Remove rules forever?'}
		</PopUpConfirm>
	);
});

RulesRemoveConfirm.displayName = 'RulesRemoveConfirm';
