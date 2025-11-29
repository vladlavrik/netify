import React, {FC} from 'react';
import {NetworkLogEntry} from '@/interfaces/networkLog';
import {useStores} from '@/stores/useStores';
import {TextButton} from '@/components/@common/buttons/TextButton';
import AddIcon from '@/assets/icons/add.svg';
import FollowIcon from '@/assets/icons/follow.svg';
import styles from './networkLogItemControls.css';

interface RulesItemControlsProps {
	data: NetworkLogEntry;
	onClose(): void;
}

export const NetworkLogItemControls: FC<RulesItemControlsProps> = (props) => {
	const {data, onClose} = props;

	const {rulesStore, tabStore} = useStores();

	const handleRuleOpen = () => {
		rulesStore.showDetails(data.modification!.ruleId);
		onClose();
	};

	const handleRuleCreate = () => {
		// Remove from the url the current origin part
		const tabUrl = new URL(tabStore.targetTab!.url);
		const requestUrl = new URL(data.url);

		const filterUrl =
			tabUrl.origin === requestUrl.origin ? requestUrl.toString().substring(requestUrl.origin.length) : data.url;

		rulesStore.showCompose({
			filter: {
				url: filterUrl,
				methods: [data.method],
			},
		});
		onClose();
	};

	return (
		<div className={styles.root}>
			{data.modification && (
				<TextButton className={styles.control} icon={<FollowIcon />} onClick={handleRuleOpen}>
					Open the applied rule
				</TextButton>
			)}

			<TextButton className={styles.control} icon={<AddIcon />} onClick={handleRuleCreate}>
				Create rule for this request
			</TextButton>
		</div>
	);
};

NetworkLogItemControls.displayName = 'NetworkLogItemControls';
