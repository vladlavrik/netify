import {Rule} from '@/interfaces/rule';
import {rulesImportSchema} from '@/services/rulesImportExport/schemas/rulesImportSchema';

export class RulesImporter {
	async import(file: File): Promise<{success: true; rules: Rule[]} | {success: false; error: Error}> {
		// Read files content
		let contentString;
		try {
			contentString = await file.text();
		} catch (error) {
			console.error(error);
			return {success: false, error: error as Error};
		}

		// Parse as JSON
		let contentSource;
		try {
			contentSource = JSON.parse(contentString);
		} catch (error) {
			console.error(error);
			return {success: false, error: error as Error};
		}

		// Validate the imported rules list
		const parseResult = rulesImportSchema.safeParse(contentSource);
		if (!parseResult.success) {
			console.error(parseResult.error);
			return {success: false, error: parseResult.error};
		}

		const content = parseResult.data;

		if (content.version !== 1) {
			return {
				success: false,
				error: new Error(`RulesImporter: version ${content.version} is not supported`),
			};
		}

		return {
			success: true,
			rules: content.rules,
		};
	}
}
