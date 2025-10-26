import React from 'react';
import {observer} from 'mobx-react-lite';
import {isUIColorThemeDark} from '@/helpers/isUIColorThemeDark';
import {useStores} from '@/stores/useStores';
import {IconButton} from '@/components/@common/buttons/IconButton';
import {Dropdown} from '@/components/@common/misc/Dropdown';
import {DebugStateSwitcher} from '@/components/misc/DebugStateSwitcher';
import {ErrorLogButton} from '@/components/misc/errorLog';
import {TargetTabButton} from '@/components/misc/TargetTabButton';
import {AppRateBanner} from '../AppRateBanner';
import DarkModeSwitchIcon from '@/assets/icons/dark-mode-switch.svg';
import RateIcon from '@/assets/icons/rate.svg';
import ReloadIcon from '@/assets/icons/reload.svg';
import styles from './appHeader.css';

export const AppHeader = observer(() => {
	const {settingsStore, appUiStore} = useStores();

	const handleReload = () => {
		location.reload();
	};

	const handleThemeSwitch = () => {
		settingsStore.setUITheme(isUIColorThemeDark(settingsStore.uiTheme) ? 'light' : 'dark');
	};

	return (
		<header className={styles.root}>
			<DebugStateSwitcher className={styles.switcher} />

			<div className={styles.tail}>
				{process.env.NODE_ENV === 'development' && (
					<IconButton icon={<ReloadIcon />} tooltip='Reload' onClick={handleReload} />
				)}

				{appUiStore.runtimeMode === 'popup' && <TargetTabButton />}

				<ErrorLogButton />

				<IconButton icon={<DarkModeSwitchIcon />} tooltip='Switch dark mode' onClick={handleThemeSwitch} />

				<Dropdown
					render={(dropdownProps, {expanded}) => (
						<IconButton
							{...dropdownProps}
							icon={<RateIcon />}
							tooltip={'Rate and support us'}
							tooltipDisabled={expanded}
							active={expanded}
						/>
					)}
					content={<AppRateBanner />}
				/>
			</div>
		</header>
	);
});

AppHeader.displayName = 'AppHeader';
