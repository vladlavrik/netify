import {observable, action} from 'mobx';
import {RootStore} from '@/components/App/RootStore';
import {Log} from '@/debugger/interfaces/Log';
import {ResourceType} from '@/debugger/constants/ResourceType';
import {RequestMethod} from '@/debugger/constants/RequestMethod';

export class LogsStore {
	constructor(_rootStore: RootStore) {}

	@observable
	readonly list: Log[] = [
		{
			id: '0',
			ruleId: 0,
			loaded: true,
			date: new Date(),
			resourceType: ResourceType.Fetch,
			method: RequestMethod.GET,
			url:
				'https://youtube.com/api/3/videos/streem/webrtc/public/AHWqTUl5Pb92BoXYQ6JhM9q4msaEy2gQqL7STOooj03YT5G',
		},
		{
			id: '1',
			ruleId: 0,
			loaded: true,
			date: new Date(),
			resourceType: ResourceType.Fetch,
			method: RequestMethod.GET,
			url:
				'https://youtube.com/api/3/videos/streem/webrtc/public/AHWqTUl5Pb92BoXYQ6JhM9q4msaEy2gQqL7STOooj03YT5G',
		},
		{
			id: '2',
			ruleId: 0,
			loaded: false,
			date: new Date(),
			resourceType: ResourceType.Fetch,
			method: RequestMethod.GET,
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
