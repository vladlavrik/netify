import {fromZodError} from 'zod-validation-error';
import {Rule} from '@/interfaces/rule';
import {downloadFileFromString} from '@/helpers/downloadFileFromString';
import {RuleExportInputSchema, rulesExportSchema} from './schemas/rulesExportSchema';

export class RulesExporter {
	async export(rules: Rule[]): Promise<{success: true} | {success: false; error: Error}> {
		const contentSource: RuleExportInputSchema = {
			version: 1,
			rules,
		};

		if (contentSource.rules.length === 0) {
			return {
				success: false,
				error: new Error('RulesExporter: no rules to export'),
			};
		}

		const contentOutput = await rulesExportSchema.safeParseAsync(contentSource);
		if (!contentOutput.success) {
			return {
				success: false,
				error: fromZodError(contentOutput.error),
			};
		}

		const contentString = JSON.stringify(contentOutput.data);
		const fileName = `netify_rules_${Date.now()}.json`;
		downloadFileFromString(contentString, fileName, 'application/json');

		return {
			success: true,
		};
	}
}
