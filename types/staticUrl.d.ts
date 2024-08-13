declare module '*.svg' {
	const content: React.FC<React.SVGProps<SVGSVGElement>>;
	export default content;
}

declare module '*.png' {
	const content: string;
	export default content;
}
