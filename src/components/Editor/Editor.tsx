import * as React from 'react';
import {inject} from 'mobx-react';
import {RulesStore} from '@/stores/RulesStore';
import {Button} from '@/components/@common/Button';
import {ExpandableCheckbox} from '@/components/@common/ExpandableCheckbox';
import {EditorForm} from './EditorForm';
import {EditorFilter} from './EditorFilter';
import {EditorActionRequest} from './EditorActionRequest';
import {EditorActionResponse} from './EditorActionResponse';
import {EditorActionCancel} from './EditorActionCancel';
import {Rule} from '@/interfaces/Rule';
import styles from './editor.css';

interface Props {
	rulesStore?: RulesStore;
	onSave: (rule: Rule) => any;
	onCancel: () => any;
}

@inject('rulesStore')
export class Editor extends React.PureComponent<Props> {
	render() {
		return (
			<div className={styles.root}>
				<EditorForm className={styles.form} onSave={this.props.onSave}>
					<h3 className={styles.title}>Filter requests:</h3>
					<EditorFilter />

					<h3 className={styles.title}>Actions:</h3>
					<ExpandableCheckbox name='actions.mutateRequest.enabled' label='Mutate request'>
						<EditorActionRequest />
					</ExpandableCheckbox>

					<ExpandableCheckbox name='actions.mutateResponse.enabled' label='Mutate Response'>
						<EditorActionResponse />
					</ExpandableCheckbox>

					<ExpandableCheckbox name='actions.cancelRequest.enabled' label='Cancel'>
						<EditorActionCancel />
					</ExpandableCheckbox>

					<div className={styles.controls}>
						<Button className={styles.saveButton} type='submit'>
							Save
						</Button>
						<Button styleType='secondary' onClick={this.props.onCancel}>
							Cancel
						</Button>
					</div>
				</EditorForm>
			</div>
		);
	}
}
