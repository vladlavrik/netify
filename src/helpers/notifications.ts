import logoIconUrl from '@/style/icons/logo-128.png';

export function pushNotification(id: string, title: string, message: string, buttons: string[] = []) {
	// TODO check permission before, maybe
	chrome.notifications.create(id, {
		type: 'basic',
		iconUrl: logoIconUrl,
		title,
		message,
		buttons: buttons.map(itemTitle => ({title: itemTitle})), // TODO test on windows, maybe need add icon
	});
}

export function subscribeNotificationClick(callback: (notificationId: string, buttonIndex: number) => void) {
	chrome.notifications.onButtonClicked.addListener(callback);
}
