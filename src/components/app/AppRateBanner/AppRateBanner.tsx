import React, {FC} from 'react';
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
			{/* PayPal donation button start*/}
			<form className={styles.donateButton} action='https://www.paypal.com/donate' method='post' target='_blank'>
				<input type='hidden' name='hosted_button_id' value='49WGRXS8GF9PU' />
				<input
					type='image'
					src='https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif'
					style={{border: 0}}
					name='submit'
					title='PayPal - The safer, easier way to pay online!'
					alt='Donate with PayPal button'
				/>
				<img
					alt=''
					style={{border: 0}}
					src='https://www.paypal.com/en_UA/i/scr/pixel.gif'
					width='1'
					height='1'
				/>
			</form>
			{/* PayPal donation button end*/}
		</div>
	);
};

AppRateBanner.displayName = 'AppRateBanner';
