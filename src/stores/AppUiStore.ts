import {RuntimeMode} from '@/interfaces/runtimeMode';

export class AppUiStore {
	runtimeMode?: RuntimeMode;

	setRuntimeMode(runtimeMode: RuntimeMode) {
		this.runtimeMode = runtimeMode;
	}
}
