import * as React from 'react';
import {observer, inject} from 'mobx-react';
import {RulesStore} from './RulesStore';
import {RulesItem} from './RulesItem';
import {RulesDetails} from './RulesDetails';
import styles from './rules.css';

import {Rule} from '@/debugger/constants/Rule'
import {UrlFilterTypes} from '@/debugger/constants/UrlFilterTypes';
import {RequestTypes} from '@/debugger/constants/RequestTypes';
import {RequestMethods} from '@/debugger/constants/RequestMethods';
import {RequestBodyTypes} from '@/debugger/constants/RequestBodyTypes';
import {ErrorReasons} from '@/debugger/constants/ErrorReasons';

const rules: Rule[] = [{
	id: 0,
	filter: {
		url: {
			type: UrlFilterTypes.StartsWith,
			value: 'http://vlad-accounts.dev.ukr.net/api/v1/token/verification/acquire',
		},
		requestTypes: [RequestTypes.XHR, RequestTypes.Fetch],
		methods: [RequestMethods.GET, RequestMethods.POST],
	},
	mutateRequest: {
		enabled: true,
		endpointReplace: 'https://hacker-server.anonim.com/youtube-stream?url=%protocol%//%hostname%:%port%%path%%query%',
		method: RequestMethods.POST,
		headersToAdd: { 'X-my-header': 'secret-header' },
		headersToRemove: ['s-id'],
		replaceBody: {
			enabled: true,
			type: RequestBodyTypes.Text,
			value: 'new Body',
		},
	},
	mutateResponse: {
		enabled: true,
		responseLocally: false,
		statusCode: 200,
		headersToAdd: { 'X-Sid': 'null' },
		headersToRemove: [],
		replaceBody: {
			enabled: true,
			type: RequestBodyTypes.Text,
			value: 'response body',
		},
	},
	responseError: {
		enabled: false,
		locally: false,
		reason: ErrorReasons.Aborted,
	},
}];


interface Props {
	rulesStore?: RulesStore
}

@inject('rulesStore')
@observer
export class Rules extends React.Component<Props> {

	render() {

		if (rules.length === 0) {
			return (
				<div className={styles.root}>
					<p className={styles.placeholder}>No rules yet</p>
				</div>
			);
		}

		return (
			<div className={styles.root}>
				<ul className={styles.list}>
					{rules.map(rule => (
						<li className={styles.item} key={rule.id}>
							<RulesItem data={rule}>
								<RulesDetails data={rule}/>
							</RulesItem>
						</li>
					))}
				</ul>
			</div>
		);
	}
}
