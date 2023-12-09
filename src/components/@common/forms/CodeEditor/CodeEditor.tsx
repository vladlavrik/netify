import React, {memo, useEffect, useRef} from 'react';
import {autocompletion, closeBrackets} from '@codemirror/autocomplete';
import {javascript} from '@codemirror/lang-javascript';
import {bracketMatching, foldGutter} from '@codemirror/language';
import {EditorState} from '@codemirror/state';
import {oneDark} from '@codemirror/theme-one-dark';
import {EditorView, highlightActiveLine, lineNumbers} from '@codemirror/view';
import cn from 'classnames';
import {minimalSetup} from 'codemirror';
import {useStores} from '@/stores/useStores';
import styles from './codeEditor.css';

interface CodeEditorProps {
	className?: string;
	readonly?: boolean;
	value: string;
	onChange?(newValue: string): void;
}

export const CodeEditor = memo<CodeEditorProps>((props) => {
	const {className, readonly, value, onChange} = props;

	const rootRef = useRef<HTMLDivElement>(null);
	const {appUiStore} = useStores();

	useEffect(() => {
		const startState = EditorState.create({
			doc: value,
			extensions: [
				minimalSetup,
				foldGutter(),
				bracketMatching(),
				closeBrackets(),
				autocompletion({}),
				lineNumbers(),
				javascript(),
				highlightActiveLine(),
				EditorState.readOnly.of(!!readonly),
				EditorView.updateListener.of((update) => {
					if (update.docChanged && onChange) {
						onChange(update.state.doc.toString());
					}
				}),
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

	return <div ref={rootRef} className={cn(styles.root, className)}></div>;
});

CodeEditor.displayName = 'CodeEditor';
