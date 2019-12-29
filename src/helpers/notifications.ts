import {Event} from '@/helpers/Events';
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

export const notificationButtonClickEvent = new Event<{notificationId: string; buttonIndex: number}>();
chrome.notifications.onButtonClicked.addListener((notificationId: string, buttonIndex: number) => {
	notificationButtonClickEvent.emit({notificationId, buttonIndex});
});
