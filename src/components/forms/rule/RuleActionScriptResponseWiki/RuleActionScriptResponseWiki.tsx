import React, {FC} from 'react';
import {CodePreview} from '@/components/@common/misc/CodePreview';
import styles from './ruleActionScriptResponseWiki.css';

// language=ts
const snippetEntrypoint = `
  async function handler(response: ResponseData, actions: ResponseAction) {
    // Your custom code...
  }
`.trim();

// language=ts
const snippetRequestData = `
interface ResponseData {
  statusCode: number;
  headers: Record<string, string>;
  body: Blob;
  request: {
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'PATCH';
    headers: Record<string, string>;
    body: Blob;
  }
}
`.trim();

// language=ts
const snippetRequestActions = `
interface ResponseAction {
  // Set response status code
  setStatusCode(statusCode: number): void;

  // Set (add or update) single response method
  setHeader(name: string, value: string | number): void;

  // Set group of headers
  setHeaders(headers: Record<string, string | number>): void;

  // Drop a header from the response
  dropHeader(name: string): void;

  // Reset an all headers from the response and set a new one optionally
  resetHeaders(headers?: Record<string, string | number>): void;

  // Set response body
  setBody(body: string | Blob): void;

  // Failure the request - return an error with statusCode 0
  failure(reason?: string): void;
}
`.trim();

// language=js
const snippetExample = `
async function handler(response, actions) {
  if (response.statusCode < 400) {
	  return;
  }
  actions.setStatusCode(200);
  actions.setHeader('Content-Type', 'application/json');
  actions.setBody(JSON.stringify({status: 'ok'}));
}`.trim();

export const RuleActionScriptResponseWiki: FC = () => {
	return (
		<div className={styles.root}>
			<p className={styles.article}>
				You can write javascript code for processing and mutation requests. The written code is executed in a
				sandbox (outside the context of the page)
			</p>
			<br />
			<p className={styles.article}>
				The <span className={styles.highlighted}>handle</span> function is executed by default when a request
				response is intercepted. The function accepts as the first parameter an object that has the response and
				request data, as well as methods for its mutation with the second parameter
			</p>
			<CodePreview className={styles.snippet} value={snippetEntrypoint} />
			<br />
			<p className={styles.article}>
				The <span className={styles.highlighted}>response</span> contains readonly response data (request data
				also included):
			</p>
			<CodePreview className={styles.snippet} value={snippetRequestData} />
			<p className={styles.article}>
				NOTE: To extract text value of the body use:{' '}
				<span className={styles.highlighted}>await request.body.text()</span>
			</p>
			<br />
			<p className={styles.article}>
				The <span className={styles.highlighted}>actions</span> is set of response mutation methods:
			</p>
			<CodePreview className={styles.snippet} value={snippetRequestActions} />
			<br />
			<p className={styles.article}>Example (fix failed request):</p>
			<CodePreview className={styles.snippet} value={snippetExample} />
		</div>
	);
};

RuleActionScriptResponseWiki.displayName = 'RuleActionScriptResponseWiki';
