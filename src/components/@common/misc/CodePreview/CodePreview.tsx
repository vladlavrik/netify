import React, {memo, useEffect, useRef} from 'react';
import {javascript} from '@codemirror/lang-javascript';
import {defaultHighlightStyle, syntaxHighlighting} from '@codemirror/language';
import {EditorState} from '@codemirror/state';
import {oneDark} from '@codemirror/theme-one-dark';
import {EditorView} from '@codemirror/view';
import {useStores} from '@/stores/useStores';

interface CodePreviewProps {
	className?: string;
	value: string;
}

export const CodePreview = memo<CodePreviewProps>((props) => {
	const {className, value} = props;

	const rootRef = useRef<HTMLDivElement>(null);
	const {appUiStore} = useStores();

	useEffect(() => {
		const startState = EditorState.create({
			doc: value,
			extensions: [
				syntaxHighlighting(defaultHighlightStyle, {fallback: true}),
				javascript(),
				EditorView.lineWrapping,
				EditorView.editable.of(false),
				...(appUiStore.themeName === 'dark' ? [oneDark] : []),
			],
		});

		const view = new EditorView({
			state: startState,
			parent: rootRef.current!,
		});

		return () => {
			view.destroy();
		};
	}, []);

	return <div ref={rootRef} className={className}></div>;
});

CodePreview.displayName = 'CodePreview';
