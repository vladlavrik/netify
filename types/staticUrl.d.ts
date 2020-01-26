declare module '*.svg' {
	import {HTMLFactory} from 'react';
	const content: HTMLFactory<HTMLElement>;
	export default content;
}

declare module '*.png' {
	const content: string;
	export default content;
}
