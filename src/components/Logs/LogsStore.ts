import {observable, action} from 'mobx';
import {RootStore} from '@/components/App/RootStore';
import {Log} from '@/debugger/constants/Log';
import {RequestTypes} from '@/debugger/constants/RequestTypes';
import {RequestMethods} from '@/debugger/constants/RequestMethods';

export class LogsStore {
	constructor(_rootStore: RootStore) {}

	@observable
	readonly list: Log[] = [
		{
			requestId: 0,
			ruleId: 0,
			date: new Date(),
			requestType: RequestTypes.Fetch,
			method: RequestMethods.GET,
			url:
				'https://youtube.com/api/3/videos/streem/webrtc/public/AHWqTUl5Pb92BoXYQ6JhM9q4msaEy2gQqL7STOooj03YT5G',
		},
		{
			requestId: 1,
			ruleId: 0,
			date: new Date(),
			requestType: RequestTypes.Fetch,
			method: RequestMethods.GET,
			url:
				'https://youtube.com/api/3/videos/streem/webrtc/public/AHWqTUl5Pb92BoXYQ6JhM9q4msaEy2gQqL7STOooj03YT5G',
		},
		{
			requestId: 2,
			ruleId: 0,
			date: new Date(),
			requestType: RequestTypes.Fetch,
			method: RequestMethods.GET,
			url:
				'https://youtube.com/api/3/videos/streem/webrtc/public/AHWqTUl5Pb92BoXYQ6JhM9q4msaEy2gQqL7STOooj03YT5G',
		},
	];

	@action
	add(item: Log) {
		this.list.push(item);
	}

	@action
	clearAll() {
		this.list.splice(0, this.list.length);
	}
}
