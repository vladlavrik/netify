import React, {memo, useMemo, useState, useCallback} from 'react';
import {RequestBody, ResponseBody} from '@/interfaces/body';
import {ResponseBodyType} from '@/constants/ResponseBodyType';
import {RequestBodyType, responseBodyTypesHumanTitles} from '@/constants/RequestBodyType';
import {TextButton} from '@/components/@common/buttons/TextButton';
import {RuleViewerDataTable} from '../RuleViewerDataTable';
import styles from './RuleViewerBodyData.css';

interface RuleViewerBodyDataProps {
	body: RequestBody | ResponseBody;
}

export const RuleViewerBodyData = memo<RuleViewerBodyDataProps>(function RuleViewerBodyData({body}) {
	const [expanded, setExpanded] = useState(false);
	const handleExpand = useCallback(() => setExpanded(true), []);

	const compactBodyLength = 1024;

	const fileUrl = useMemo(() => {
		if (body.type !== ResponseBodyType.File) {
			return;
		}

		return URL.createObjectURL(body.value);
	}, [body]);

	switch (body.type) {
		case RequestBodyType.Text:
		case ResponseBodyType.Text: {
			const {value} = body;

			return value.length > compactBodyLength && !expanded ? (
				// Show trimmed body by default
				<>
					<p className={styles.textContent}>{value.slice(0, compactBodyLength)}...</p>
					<TextButton onClick={handleExpand}>Show all</TextButton>
				</>
			) : (
				<p className={styles.textContent}>{value}</p>
			);
		}

		case ResponseBodyType.Base64:
			return (
				<>
					<p>
						<span className={styles.additionalInfo}>Base 64 encoded content</span>
						{!expanded && (
							<TextButton className={styles.indented} onClick={handleExpand}>
								Show
							</TextButton>
						)}
					</p>
					{expanded && <p className={styles.base64Content}>{body.value}</p>}
				</>
			);

		case RequestBodyType.UrlEncodedForm:
		case RequestBodyType.MultipartFromData:
			return (
				<>
					<p className={styles.additionalInfo}>{responseBodyTypesHumanTitles[body.type]}</p>
					<RuleViewerDataTable values={body.value.map(({key, value}) => [key, value])} />
				</>
			);

		case ResponseBodyType.File:
			return (
				<p>
					{body.value.name} <span className={styles.additionalInfo}>({body.value.size} bytes)</span>
					<a className={styles.downloadLink} href={fileUrl} download={body.value.name}>
						Download
					</a>
				</p>
			);
	}
});
