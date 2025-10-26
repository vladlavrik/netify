import React from 'react';
import cn from 'classnames';
import {observer} from 'mobx-react-lite';
import {useStores} from '@/stores/useStores';
import {Switcher} from '@/components/@common/forms/Switcher';
import {TextLoader} from '@/components/@common/misc/TextLoader';
import {WithTooltip} from '@/components/@common/misc/WithTooltip';
import styles from './debugStateSwitcher.css';

interface DebugStateSwitcherProps {
	className?: string;
}

export const DebugStateSwitcher = observer<DebugStateSwitcherProps>((props) => {
	const {className} = props;

	const {debuggerStateStore, tabStore} = useStores();

	const debuggingAllowed = tabStore.targetTabHasPage;
	const debuggingActive = debuggerStateStore.active;
	const debuggingSwitching = debuggerStateStore.switching;

	const handleToggleEnabled = () => {
		if (debuggingSwitching || !debuggingAllowed) {
			return;
		}

		debuggerStateStore.toggleEnabled();
	};

	let enableTooltip;
	if (!debuggingAllowed) {
		enableTooltip = 'Is not allowed for this page';
	} else if (debuggingActive) {
		enableTooltip = 'Stop requests handling';
	} else {
		enableTooltip = 'Start requests handling';
	}

	return (
		<WithTooltip
			className={cn(styles.root, !debuggingAllowed && styles.isDisabled, className)}
			tooltip={enableTooltip}>
			<Switcher
				id='id-active-switcher'
				className={styles.switcher}
				checked={debuggingActive}
				onChange={handleToggleEnabled}
			/>
			<label htmlFor='id-active-switcher' className={styles.label}>
				{debuggingActive ? 'Active' : 'Inactive'}
				{debuggingSwitching && <TextLoader showDelay={300} />}
			</label>
		</WithTooltip>
	);
});

DebugStateSwitcher.displayName = 'AppHeader';
