import React, {FC} from 'react';
import BmcIcon from './icons/bmc.svg';
import ChromeStoreIcon from './icons/chrome-store.svg';
import GithubIcon from './icons/github.svg';
import styles from './appRateBanner.css';

export const AppRateBanner: FC = () => {
	return (
		<div className={styles.root}>
			<p className={styles.title}>Rate and feedback</p>
			<a
				className={styles.linkEntry}
				href='https://github.com/vladlavrik/netify'
				target='_blank'
				rel='noreferrer'>
				<GithubIcon className={styles.linkEntryIcon} />
				Star on github
			</a>
			<a
				className={styles.linkEntry}
				href='https://chrome.google.com/webstore/detail/netify/mdafhjaillpdogjdigdkmnoddeoegblj'
				target='_blank'
				rel='noreferrer'>
				<ChromeStoreIcon className={styles.linkEntryIcon} />
				Rate on Chrome WebStore
			</a>

			<p className={styles.title}>Support us</p>
			<p className={styles.subtitle}>
				Netify is fully free and open source. <br />
				You can thank the author by making a small donation
			</p>
			<a
				className={styles.linkEntry}
				href='https://www.buymeacoffee.com/vladlavrik'
				target='_blank'
				rel='noreferrer'>
				<BmcIcon />
			</a>
		</div>
	);
};

AppRateBanner.displayName = 'AppRateBanner';
