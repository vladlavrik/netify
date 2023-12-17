import React, {FC} from 'react';
import {CodePreview} from '@/components/@common/misc/CodePreview';
import styles from './ruleActionScriptRequestWiki.css';

// language=ts
const snippetEntrypoint = `
  async function handler(request: RequestData, actions: RequestAction) {
    // Your custom code...
  }
`.trim();

// language=ts
const snippetRequestData = `
interface RequestData {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'PATCH';
  headers: Record<string, string>;
  body: Blob;
}
`.trim();

// language=ts
const snippetRequestActions = `
interface RequestAction {
  // Set request endpoint url
  setUrl(url: string): void;

  // Set request HTTP method
  setMethod(method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'PATCH'): void;

  // Set (add or update) single request method
  setHeader(name: string, value: string | number): void;

  // Set group of headers
  setHeaders(headers: Record<string, string | number>): void;

  // Drop a header from the request
  dropHeader(name: string): void;

  // Reset an all headers from the request and set a new one optionally
  // NOTE: not all request can be removed updated
  // due to limitations of Chrome Devtools
  resetHeaders(headers?: Record<string, string | number>): void;

  // Set request body
  // NOTE: Only string type are supported for now,
  // in future a blob will be also allowed
  setBody(body: string): void;

  // Failure the request - return an error with statusCode 0
  failure(reason?: string): void;

  // Make a local response to the request,
  // The request will not be sent to a server
  response(responseData: {
  	// Default: 200
    statusCode?: number;

    headers?: Record<string, string>;

    body?: string | Blob;
  }): void;
}
`.trim();

// language=js
const snippetExample = `
async function handler(request, actions) {
  const textBody = await request.body.text();
  const jsonBody = JSON.parse(textBody);
  const newBody = JSON.stringify({...jsonBody, user: 'Alex'});
  actions.setBody(newBody);
}`.trim();

export const RuleActionScriptRequestWiki: FC = () => {
	return (
		<div className={styles.root}>
			<p className={styles.article}>
				You can write javascript code for processing and mutation requests. The written code is executed in a
				sandbox (outside the context of the page)
			</p>
			<br />
			<p className={styles.article}>
				The <span className={styles.highlighted}>handle</span> function is executed by default when a request is
				intercepted. The function accepts as the first parameter an object that has the request data, as well as
				methods for its mutation with the second parameter
			</p>
			<CodePreview className={styles.snippet} value={snippetEntrypoint} />
			<br />
			<p className={styles.article}>
				The <span className={styles.highlighted}>request</span> contains readonly request data:
			</p>
			<CodePreview className={styles.snippet} value={snippetRequestData} />
			<p className={styles.article}>
				NOTE: To extract text value of the body use:{' '}
				<span className={styles.highlighted}>await request.body.text()</span>
			</p>
			<br />
			<p className={styles.article}>
				The <span className={styles.highlighted}>actions</span> is set of request mutation methods:
			</p>
			<CodePreview className={styles.snippet} value={snippetRequestActions} />
			<br />
			<p className={styles.article}>Example (replace JSON body):</p>
			<CodePreview className={styles.snippet} value={snippetExample} />
		</div>
	);
};

RuleActionScriptRequestWiki.displayName = 'RuleActionScriptRequestWiki';
